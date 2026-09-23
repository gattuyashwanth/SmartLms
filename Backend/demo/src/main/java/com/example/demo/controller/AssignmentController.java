package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getTeacherAssignments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsForTeacher(userPrincipal.getId())));
    }

    @GetMapping("/student")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getStudentAssignments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsForStudent(userPrincipal.getId())));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAssignmentsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long studentId = (userPrincipal != null && userPrincipal.isStudent()) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByCourse(courseId, studentId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentDto>> getAssignmentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long studentId = (userPrincipal != null && userPrincipal.isStudent()) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentById(id, studentId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDto>> createAssignment(
            @Valid @RequestBody AssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        AssignmentDto created = assignmentService.createAssignment(request, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Assignment created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDto>> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        AssignmentDto updated = assignmentService.updateAssignment(id, request, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        assignmentService.deleteAssignment(id, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted successfully", null));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionDto>> submitAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentSubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        SubmissionDto submission = assignmentService.submitAssignment(id, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Assignment submitted successfully", submission));
    }

    @GetMapping("/{id}/submissions")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getSubmissions(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<SubmissionDto> submissions = assignmentService.getSubmissionsByAssignment(id, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    @PutMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionDto>> gradeSubmission(
            @PathVariable Long submissionId,
            @Valid @RequestBody AssignmentGradeRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        SubmissionDto graded = assignmentService.gradeSubmission(submissionId, request, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Submission graded successfully", graded));
    }
}
