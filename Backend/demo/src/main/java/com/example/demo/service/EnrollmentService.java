package com.example.demo.service;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.Course;
import com.example.demo.entity.Enrollment;
import com.example.demo.entity.User;
import com.example.demo.entity.enums.EnrollmentStatus;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, UserRepository userRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public Enrollment enrollStudent(Long studentId, Long courseId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new BadRequestException("Student is already enrolled in this course");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Enrollment enrollment = new Enrollment(student, course);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        return enrollmentRepository.save(enrollment);
    }

    public List<UserDto> getEnrolledStudents(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(e -> {
                    User u = e.getStudent();
                    UserDto dto = new UserDto();
                    dto.setId(u.getId());
                    dto.setFullName(u.getFullName());
                    dto.setEmail(u.getEmail());
                    dto.setPhone(u.getPhone());
                    dto.setRollNumber(u.getRollNumber());
                    dto.setRole(u.getRole().name());
                    if (u.getDepartment() != null) {
                        dto.setDepartmentName(u.getDepartment().getName());
                    }
                    dto.setActive(u.isActive());
                    dto.setCreatedAt(e.getEnrollmentDate());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void unenroll(Long enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}
