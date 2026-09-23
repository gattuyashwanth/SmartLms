package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.GradeDto;
import com.example.demo.dto.GradeRequest;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.GradeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<GradeDto>>> getStudentGrades(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        // Enforce: Student can only view own grades
        if (userPrincipal != null && userPrincipal.isStudent() && !userPrincipal.getId().equals(studentId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied: You can only view your own grades"));
        }
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesByStudent(studentId)));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<GradeDto>>> getCourseGrades(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesByCourse(courseId, userPrincipal.getId(), userPrincipal.getRoleName())));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<GradeDto>> saveGrade(
            @Valid @RequestBody GradeRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        GradeDto saved = gradeService.saveOrUpdateGrade(request, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Grade saved successfully", saved));
    }
}
