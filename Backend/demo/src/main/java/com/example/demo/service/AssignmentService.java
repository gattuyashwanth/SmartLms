package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.entity.enums.AssignmentStatus;
import com.example.demo.exception.AccessDeniedException;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AssignmentService(
            AssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<AssignmentDto> getAssignmentsForTeacher(Long teacherId) {
        return assignmentRepository.findByCourseTeacherId(teacherId).stream()
                .map(a -> toDto(a, null))
                .collect(Collectors.toList());
    }

    public List<AssignmentDto> getAssignmentsForStudent(Long studentId) {
        List<Long> courseIds = enrollmentRepository.findByStudentId(studentId).stream()
                .map(e -> e.getCourse().getId())
                .collect(Collectors.toList());

        return assignmentRepository.findByCourseIdIn(courseIds).stream()
                .map(a -> toDto(a, studentId))
                .collect(Collectors.toList());
    }

    public List<AssignmentDto> getAssignmentsByCourse(Long courseId, Long studentId) {
        return assignmentRepository.findByCourseId(courseId).stream()
                .map(a -> toDto(a, studentId))
                .collect(Collectors.toList());
    }

    public AssignmentDto getAssignmentById(Long id, Long studentId) {
        Assignment a = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + id));
        return toDto(a, studentId);
    }

    @Transactional
    public AssignmentDto createAssignment(AssignmentRequest request, Long teacherId, String role) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if ("ROLE_TEACHER".equals(role) && !course.getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only create assignments for your assigned courses");
        }

        Assignment a = new Assignment(
                request.getTitle(),
                request.getDescription(),
                request.getDeadline(),
                request.getMaxMarks(),
                request.getInstructions(),
                course
        );

        Assignment saved = assignmentRepository.save(a);
        return toDto(saved, null);
    }

    @Transactional
    public AssignmentDto updateAssignment(Long id, AssignmentRequest request, Long teacherId, String role) {
        Assignment a = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + id));

        if ("ROLE_TEACHER".equals(role) && !a.getCourse().getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only update assignments for your assigned courses");
        }

        a.setTitle(request.getTitle());
        a.setDescription(request.getDescription());
        a.setDeadline(request.getDeadline());
        a.setMaxMarks(request.getMaxMarks());
        a.setInstructions(request.getInstructions());

        Assignment saved = assignmentRepository.save(a);
        return toDto(saved, null);
    }

    @Transactional
    public void deleteAssignment(Long id, Long teacherId, String role) {
        Assignment a = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + id));

        if ("ROLE_TEACHER".equals(role) && !a.getCourse().getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only delete assignments for your assigned courses");
        }

        assignmentRepository.delete(a);
    }

    @Transactional
    public SubmissionDto submitAssignment(Long assignmentId, Long studentId, AssignmentSubmissionRequest request) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Check if student already submitted
        Optional<AssignmentSubmission> existing = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
        AssignmentSubmission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setContent(request.getContent());
            submission.setFileUrl(request.getFileUrl());
            submission.setSubmissionDate(LocalDateTime.now());
        } else {
            submission = new AssignmentSubmission();
            submission.setAssignment(assignment);
            submission.setStudent(student);
            submission.setContent(request.getContent());
            submission.setFileUrl(request.getFileUrl());
            submission.setSubmissionDate(LocalDateTime.now());
        }

        if (LocalDateTime.now().isAfter(assignment.getDeadline())) {
            submission.setStatus(AssignmentStatus.LATE);
        } else {
            submission.setStatus(AssignmentStatus.SUBMITTED);
        }

        AssignmentSubmission saved = submissionRepository.save(submission);
        return toSubmissionDto(saved);
    }

    public List<SubmissionDto> getSubmissionsByAssignment(Long assignmentId, Long teacherId, String role) {
        Assignment a = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        if ("ROLE_TEACHER".equals(role) && !a.getCourse().getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only view submissions for your assigned courses");
        }

        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(this::toSubmissionDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubmissionDto gradeSubmission(Long submissionId, AssignmentGradeRequest request, Long teacherId, String role) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        if ("ROLE_TEACHER".equals(role) && !submission.getAssignment().getCourse().getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only grade submissions for your assigned courses");
        }

        if (request.getMarksObtained() > submission.getAssignment().getMaxMarks()) {
            throw new BadRequestException("Marks obtained cannot exceed maximum marks (" + submission.getAssignment().getMaxMarks() + ")");
        }

        submission.setMarksObtained(request.getMarksObtained());
        submission.setFeedback(request.getFeedback());
        submission.setStatus(AssignmentStatus.GRADED);
        submission.setGradedAt(LocalDateTime.now());

        AssignmentSubmission saved = submissionRepository.save(submission);
        return toSubmissionDto(saved);
    }

    private AssignmentDto toDto(Assignment a, Long studentId) {
        AssignmentDto dto = new AssignmentDto();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setDeadline(a.getDeadline());
        dto.setMaxMarks(a.getMaxMarks());
        dto.setInstructions(a.getInstructions());
        dto.setCourseId(a.getCourse().getId());
        dto.setCourseTitle(a.getCourse().getTitle());
        dto.setCourseCode(a.getCourse().getCode());

        long count = submissionRepository.findByAssignmentId(a.getId()).size();
        dto.setTotalSubmissions(count);

        if (studentId != null) {
            Optional<AssignmentSubmission> sub = submissionRepository.findByAssignmentIdAndStudentId(a.getId(), studentId);
            if (sub.isPresent()) {
                AssignmentSubmission s = sub.get();
                dto.setStatus(s.getStatus().name());
                dto.setMarksObtained(s.getMarksObtained());
                dto.setFeedback(s.getFeedback());
                dto.setSubmittedAt(s.getSubmissionDate());
            } else {
                dto.setStatus(LocalDateTime.now().isAfter(a.getDeadline()) ? "LATE" : "PENDING");
            }
        } else {
            dto.setStatus("PENDING");
        }

        return dto;
    }

    private SubmissionDto toSubmissionDto(AssignmentSubmission s) {
        SubmissionDto dto = new SubmissionDto();
        dto.setId(s.getId());
        dto.setAssignmentId(s.getAssignment().getId());
        dto.setAssignmentTitle(s.getAssignment().getTitle());
        dto.setMaxMarks(s.getAssignment().getMaxMarks());
        dto.setStudentId(s.getStudent().getId());
        dto.setStudentName(s.getStudent().getFullName());
        dto.setRollNumber(s.getStudent().getRollNumber());
        dto.setSubmissionDate(s.getSubmissionDate());
        dto.setContent(s.getContent());
        dto.setFileUrl(s.getFileUrl());
        dto.setStatus(s.getStatus().name());
        dto.setMarksObtained(s.getMarksObtained());
        dto.setFeedback(s.getFeedback());
        dto.setGradedAt(s.getGradedAt());
        return dto;
    }
}
