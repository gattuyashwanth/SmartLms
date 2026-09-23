package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.UserDto;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'STUDENT', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> enrollStudent(
            @RequestBody Map<String, Long> payload,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long courseId = payload.get("courseId");
        Long studentId = payload.get("studentId");

        // If student calls, ensure enrolling themselves
        if (userPrincipal != null && userPrincipal.isStudent()) {
            studentId = userPrincipal.getId();
        }

        enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.ok(ApiResponse.success("Enrolled successfully", null));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getEnrolledStudents(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrolledStudents(courseId)));
    }
}
