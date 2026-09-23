package com.example.demo.service;

import com.example.demo.dto.GradeDto;
import com.example.demo.dto.GradeRequest;
import com.example.demo.entity.Course;
import com.example.demo.entity.Grade;
import com.example.demo.entity.User;
import com.example.demo.exception.AccessDeniedException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.GradeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public GradeService(GradeRepository gradeRepository, CourseRepository courseRepository, UserRepository userRepository) {
        this.gradeRepository = gradeRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public List<GradeDto> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<GradeDto> getGradesByCourse(Long courseId, Long teacherId, String role) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if ("ROLE_TEACHER".equals(role) && !course.getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only manage grades for your assigned courses");
        }

        return gradeRepository.findByCourseId(courseId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public GradeDto saveOrUpdateGrade(GradeRequest request, Long teacherId, String role) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if ("ROLE_TEACHER".equals(role) && !course.getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only submit grades for your assigned courses");
        }

        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Optional<Grade> existing = gradeRepository.findByStudentIdAndCourseId(request.getStudentId(), request.getCourseId());
        Grade grade;
        if (existing.isPresent()) {
            grade = existing.get();
            grade.setAssignmentMarks(request.getAssignmentMarks());
            grade.setQuizMarks(request.getQuizMarks());
            grade.setExamMarks(request.getExamMarks());
            grade.setRemarks(request.getRemarks());
            grade.calculateGrade();
        } else {
            grade = new Grade(student, course, request.getAssignmentMarks(), request.getQuizMarks(), request.getExamMarks(), request.getRemarks());
        }

        Grade saved = gradeRepository.save(grade);
        return toDto(saved);
    }

    private GradeDto toDto(Grade g) {
        GradeDto dto = new GradeDto();
        dto.setId(g.getId());
        dto.setStudentId(g.getStudent().getId());
        dto.setStudentName(g.getStudent().getFullName());
        dto.setRollNumber(g.getStudent().getRollNumber());
        dto.setCourseId(g.getCourse().getId());
        dto.setCourseTitle(g.getCourse().getTitle());
        dto.setCourseCode(g.getCourse().getCode());
        dto.setAssignmentMarks(g.getAssignmentMarks());
        dto.setQuizMarks(g.getQuizMarks());
        dto.setExamMarks(g.getExamMarks());
        dto.setTotalMarks(g.getTotalMarks());
        dto.setPercentage(g.getPercentage());
        dto.setLetterGrade(g.getLetterGrade());
        dto.setRemarks(g.getRemarks());
        dto.setUpdatedAt(g.getUpdatedAt());
        return dto;
    }
}
