package com.example.demo.service;

import com.example.demo.dto.DepartmentDto;
import com.example.demo.entity.Department;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> new DepartmentDto(d.getId(), d.getName(), d.getCode(), d.getDescription()))
                .collect(Collectors.toList());
    }

    public DepartmentDto getDepartmentById(Long id) {
        Department d = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return new DepartmentDto(d.getId(), d.getName(), d.getCode(), d.getDescription());
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.existsByCode(dto.getCode())) {
            throw new BadRequestException("Department code already exists: " + dto.getCode());
        }
        Department d = new Department(dto.getName(), dto.getCode(), dto.getDescription());
        Department saved = departmentRepository.save(d);
        return new DepartmentDto(saved.getId(), saved.getName(), saved.getCode(), saved.getDescription());
    }

    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto dto) {
        Department d = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        d.setName(dto.getName());
        d.setDescription(dto.getDescription());
        Department saved = departmentRepository.save(d);
        return new DepartmentDto(saved.getId(), saved.getName(), saved.getCode(), saved.getDescription());
    }

    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with ID: " + id);
        }
        departmentRepository.deleteById(id);
    }
}
