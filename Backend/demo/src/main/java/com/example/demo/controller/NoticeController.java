package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.NoticeDto;
import com.example.demo.dto.NoticeRequest;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.NoticeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoticeDto>>> getNotices(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String role = userPrincipal != null ? userPrincipal.getRoleName() : "ROLE_STUDENT";
        return ResponseEntity.ok(ApiResponse.success(noticeService.getNoticesForUser(role)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN', 'ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<NoticeDto>> createNotice(
            @Valid @RequestBody NoticeRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        NoticeDto created = noticeService.createNotice(request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Notice created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN', 'ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<NoticeDto>> updateNotice(@PathVariable Long id, @Valid @RequestBody NoticeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Notice updated successfully", noticeService.updateNotice(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(ApiResponse.success("Notice deleted successfully", null));
    }
}
