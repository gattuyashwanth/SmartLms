package com.example.demo.service;

import com.example.demo.dto.AttendanceBatchRequest;
import com.example.demo.dto.AttendanceRecordDto;
import com.example.demo.dto.AttendanceSummaryDto;
import com.example.demo.entity.Attendance;
import com.example.demo.entity.Course;
import com.example.demo.entity.Enrollment;
import com.example.demo.entity.User;
import com.example.demo.entity.enums.AttendanceStatus;
import com.example.demo.exception.AccessDeniedException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository
    ) {
        this.attendanceRepository = attendanceRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    public List<AttendanceRecordDto> getRosterForCourseAndDate(Long courseId, LocalDate date, Long teacherId, String role) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if ("ROLE_TEACHER".equals(role) && !course.getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only take attendance for your assigned courses");
        }

        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        List<AttendanceRecordDto> roster = new ArrayList<>();

        for (Enrollment e : enrollments) {
            User student = e.getStudent();
            Optional<Attendance> existing = attendanceRepository.findByStudentIdAndCourseIdAndDate(student.getId(), courseId, date);

            AttendanceRecordDto dto = new AttendanceRecordDto();
            dto.setStudentId(student.getId());
            dto.setStudentName(student.getFullName());
            dto.setRollNumber(student.getRollNumber());

            if (existing.isPresent()) {
                Attendance att = existing.get();
                dto.setId(att.getId());
                dto.setStatus(att.getStatus());
                dto.setRemarks(att.getRemarks());
            } else {
                dto.setStatus(AttendanceStatus.PRESENT); // default for ease of marking
                dto.setRemarks("");
            }
            roster.add(dto);
        }

        return roster;
    }

    @Transactional
    public void saveAttendanceBatch(AttendanceBatchRequest request, Long teacherId, String role) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if ("ROLE_TEACHER".equals(role) && !course.getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only submit attendance for your assigned courses");
        }

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        LocalDate date = request.getDate();

        for (AttendanceRecordDto recordDto : request.getRecords()) {
            User student = userRepository.findById(recordDto.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

            Optional<Attendance> existing = attendanceRepository.findByStudentIdAndCourseIdAndDate(student.getId(), course.getId(), date);
            Attendance attendance;
            if (existing.isPresent()) {
                attendance = existing.get();
                attendance.setStatus(recordDto.getStatus());
                attendance.setRemarks(recordDto.getRemarks());
            } else {
                attendance = new Attendance(student, course, teacher, date, recordDto.getStatus(), recordDto.getRemarks());
            }

            attendanceRepository.save(attendance);
        }
    }

    public AttendanceSummaryDto getStudentAttendanceSummary(Long studentId) {
        List<Attendance> allStudentRecords = attendanceRepository.findByStudentId(studentId);
        long total = allStudentRecords.size();
        long present = allStudentRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long late = allStudentRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();
        long absent = allStudentRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();

        // Formula: (Present + 0.5 * Late) / Total * 100
        double overallPercentage = (total > 0) ? Math.round(((present + (late * 0.5)) / total) * 100.0) : 100.0;

        // Course Breakdown
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<AttendanceSummaryDto.CourseAttendanceDto> breakdown = new ArrayList<>();

        for (Enrollment e : enrollments) {
            Course c = e.getCourse();
            List<Attendance> courseRecords = attendanceRepository.findByStudentIdAndCourseId(studentId, c.getId());
            long cTotal = courseRecords.size();
            long cPresent = courseRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
            long cLate = courseRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.LATE).count();
            double cPct = (cTotal > 0) ? Math.round(((cPresent + (cLate * 0.5)) / cTotal) * 100.0) : 100.0;

            breakdown.add(new AttendanceSummaryDto.CourseAttendanceDto(
                    c.getId(),
                    c.getTitle(),
                    c.getCode(),
                    cTotal,
                    cPresent + cLate,
                    cPct
            ));
        }

        // Recent Logs
        List<AttendanceSummaryDto.AttendanceLogDto> recentLogs = allStudentRecords.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(20)
                .map(a -> new AttendanceSummaryDto.AttendanceLogDto(
                        a.getId(),
                        a.getCourse().getId(),
                        a.getCourse().getTitle(),
                        a.getDate(),
                        a.getStatus().name(),
                        a.getRemarks()
                ))
                .collect(Collectors.toList());

        AttendanceSummaryDto summary = new AttendanceSummaryDto();
        summary.setTotalClasses(total);
        summary.setPresentCount(present);
        summary.setAbsentCount(absent);
        summary.setLateCount(late);
        summary.setOverallPercentage(overallPercentage);
        summary.setCourseBreakdown(breakdown);
        summary.setRecentLogs(recentLogs);

        return summary;
    }
}
