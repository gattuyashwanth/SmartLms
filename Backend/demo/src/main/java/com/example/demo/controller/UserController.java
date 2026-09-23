package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.UserDto;
import com.example.demo.entity.enums.RoleType;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/teachers")
    public ResponseEntity<ApiResponse<List<UserDto>>> getTeachers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(RoleType.ROLE_TEACHER)));
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN', 'ROLE_TEACHER', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getStudents() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(RoleType.ROLE_STUDENT)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@RequestBody Map<String, Object> payload) {
        UserDto dto = new UserDto();
        dto.setFullName((String) payload.get("fullName"));
        dto.setEmail((String) payload.get("email"));
        dto.setPhone((String) payload.get("phone"));
        dto.setRole((String) payload.get("role"));
        dto.setRollNumber((String) payload.get("rollNumber"));
        dto.setActive(payload.get("active") != null ? (Boolean) payload.get("active") : true);
        if (payload.get("departmentId") != null) {
            dto.setDepartmentId(Long.valueOf(payload.get("departmentId").toString()));
        }
        String password = (String) payload.get("password");

        UserDto created = userService.createUser(dto, password);
        return ResponseEntity.ok(ApiResponse.success("User created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        // Enforce permission: Admin can edit any, user can edit own
        if (userPrincipal == null || (!userPrincipal.isAdmin() && !userPrincipal.getId().equals(id))) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied: You do not have permission to modify this user account."));
        }
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", userService.updateUser(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
