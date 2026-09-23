package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<QuizDto>>> getTeacherQuizzes(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuizzesForTeacher(userPrincipal.getId())));
    }

    @GetMapping("/student")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<QuizDto>>> getStudentQuizzes(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuizzesForStudent(userPrincipal.getId())));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<QuizDto>>> getQuizzesByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long studentId = (userPrincipal != null && userPrincipal.isStudent()) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuizzesByCourse(courseId, studentId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuizDto>> getQuizById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long studentId = (userPrincipal != null && userPrincipal.isStudent()) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuizById(id, studentId)));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<ApiResponse<List<QuizQuestionDto>>> getQuestionsForStudent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuestionsForStudent(id)));
    }

    @GetMapping("/{id}/questions/manage")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizQuestionDto>>> getQuestionsForTeacher(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(ApiResponse.success(quizService.getQuestionsForTeacher(id, userPrincipal.getId(), userPrincipal.getRoleName())));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<QuizDto>> createQuiz(
            @Valid @RequestBody QuizRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        QuizDto created = quizService.createQuiz(request, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Quiz created successfully", created));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<ApiResponse<QuizResultDto>> submitQuiz(
            @PathVariable Long id,
            @RequestBody QuizSubmitRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        QuizResultDto result = quizService.submitQuiz(id, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Quiz evaluated successfully", result));
    }

    @GetMapping("/{id}/attempts")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizResultDto>>> getQuizAttempts(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<QuizResultDto> results = quizService.getQuizAttempts(id, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        quizService.deleteQuiz(id, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Quiz deleted successfully", null));
    }
}
