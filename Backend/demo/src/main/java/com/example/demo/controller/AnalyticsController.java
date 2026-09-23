package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }

        DashboardStatsDto stats;

        if (userPrincipal.isAdmin()) {
            stats = analyticsService.getAdminDashboardStats();
        } else if (userPrincipal.isTeacher()) {
            stats = analyticsService.getTeacherDashboardStats(userPrincipal.getId(), userPrincipal.getFullName());
        } else {
            stats = analyticsService.getStudentDashboardStats(userPrincipal.getId(), userPrincipal.getFullName());
        }

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
