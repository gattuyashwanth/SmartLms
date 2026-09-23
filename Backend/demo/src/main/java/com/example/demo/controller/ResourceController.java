package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ResourceDto;
import com.example.demo.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<ResourceDto>>> getResourcesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(resourceService.getResourcesByCourse(courseId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ResourceDto>> addResource(@RequestBody ResourceDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Resource added successfully", resourceService.addResource(dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'TEACHER', 'ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully", null));
    }
}
