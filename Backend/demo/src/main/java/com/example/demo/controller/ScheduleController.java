package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ScheduleDto;
import com.example.demo.dto.ScheduleRequest;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getSchedules(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(ApiResponse.success(scheduleService.getAllSchedules()));
        }

        if (userPrincipal.isTeacher()) {
            return ResponseEntity.ok(ApiResponse.success(scheduleService.getSchedulesForTeacher(userPrincipal.getId())));
        } else if (userPrincipal.isStudent()) {
            return ResponseEntity.ok(ApiResponse.success(scheduleService.getSchedulesForStudent(userPrincipal.getId())));
        } else {
            return ResponseEntity.ok(ApiResponse.success(scheduleService.getAllSchedules()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleDto>> createSchedule(@Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Schedule created successfully", scheduleService.createSchedule(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleDto>> updateSchedule(@PathVariable Long id, @Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", scheduleService.updateSchedule(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted successfully", null));
    }
}
