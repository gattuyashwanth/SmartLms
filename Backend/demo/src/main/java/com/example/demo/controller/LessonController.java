package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.LessonDto;
import com.example.demo.dto.LessonRequest;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.LessonService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<LessonDto>>> getLessonsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long studentId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonsByCourse(courseId, studentId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<LessonDto>> createLesson(@Valid @RequestBody LessonRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lesson created successfully", lessonService.createLesson(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<LessonDto>> updateLesson(@PathVariable Long id, @Valid @RequestBody LessonRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lesson updated successfully", lessonService.updateLesson(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted successfully", null));
    }

    @PostMapping("/{id}/toggle-complete")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> toggleComplete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        boolean completed = lessonService.toggleCompleteLesson(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Lesson completion status updated", Map.of("completed", completed)));
    }
}
