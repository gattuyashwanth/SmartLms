package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.CourseDto;
import com.example.demo.dto.CourseRequest;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseDto>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCourses()));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getPublicCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getPublicCourses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDto>> getCourseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(courseService.getCourseById(id, userId)));
    }

    @GetMapping("/teacher/my-courses")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getMyTeacherCourses(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCoursesByTeacher(userPrincipal.getId())));
    }

    @GetMapping("/student/my-courses")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getMyStudentCourses(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCoursesByStudent(userPrincipal.getId())));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN', 'ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<CourseDto>> createCourse(
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        if (userPrincipal != null && userPrincipal.isTeacher()) {
            request.setTeacherId(userPrincipal.getId());
        }
        CourseDto created = courseService.createCourse(request);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN', 'ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<CourseDto>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        CourseDto updated = courseService.updateCourse(id, request, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }
}
