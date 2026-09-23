package com.example.demo.service;

import com.example.demo.dto.ResourceDto;
import com.example.demo.entity.Course;
import com.example.demo.entity.Resource;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final CourseRepository courseRepository;

    public ResourceService(ResourceRepository resourceRepository, CourseRepository courseRepository) {
        this.resourceRepository = resourceRepository;
        this.courseRepository = courseRepository;
    }

    public List<ResourceDto> getResourcesByCourse(Long courseId) {
        return resourceRepository.findByCourseId(courseId).stream().map(r -> {
            ResourceDto dto = new ResourceDto();
            dto.setId(r.getId());
            dto.setTitle(r.getTitle());
            dto.setResourceType(r.getResourceType());
            dto.setFileUrl(r.getFileUrl());
            dto.setCourseId(r.getCourse().getId());
            dto.setCreatedAt(r.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ResourceDto addResource(ResourceDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Resource r = new Resource(dto.getTitle(), dto.getResourceType(), dto.getFileUrl(), course);
        Resource saved = resourceRepository.save(r);

        ResourceDto result = new ResourceDto();
        result.setId(saved.getId());
        result.setTitle(saved.getTitle());
        result.setResourceType(saved.getResourceType());
        result.setFileUrl(saved.getFileUrl());
        result.setCourseId(saved.getCourse().getId());
        result.setCreatedAt(saved.getCreatedAt());
        return result;
    }

    @Transactional
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found");
        }
        resourceRepository.deleteById(id);
    }
}
