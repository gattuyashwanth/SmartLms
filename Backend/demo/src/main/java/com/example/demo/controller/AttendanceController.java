package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.AttendanceBatchRequest;
import com.example.demo.dto.AttendanceRecordDto;
import com.example.demo.dto.AttendanceSummaryDto;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/roster")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<AttendanceRecordDto>>> getRoster(
            @RequestParam Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<AttendanceRecordDto> roster = attendanceService.getRosterForCourseAndDate(courseId, date, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success(roster));
    }

    @PostMapping("/batch")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> saveAttendanceBatch(
            @Valid @RequestBody AttendanceBatchRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        attendanceService.saveAttendanceBatch(request, userPrincipal.getId(), userPrincipal.getRoleName());
        return ResponseEntity.ok(ApiResponse.success("Attendance saved successfully", null));
    }

    @GetMapping("/my-summary")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'STUDENT')")
    public ResponseEntity<ApiResponse<AttendanceSummaryDto>> getMyAttendanceSummary(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentAttendanceSummary(userPrincipal.getId())));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN', 'ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<AttendanceSummaryDto>> getStudentAttendanceSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentAttendanceSummary(studentId)));
    }
}
