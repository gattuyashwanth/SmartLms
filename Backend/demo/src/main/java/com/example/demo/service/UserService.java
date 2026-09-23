package com.example.demo.service;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.Department;
import com.example.demo.entity.User;
import com.example.demo.entity.enums.RoleType;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, DepartmentRepository departmentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRole(RoleType role) {
        return userRepository.findByRole(role).stream().map(this::toDto).collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return toDto(u);
    }

    @Transactional
    public UserDto createUser(UserDto dto, String password) {
        if (userRepository.existsByEmail(dto.getEmail().trim())) {
            throw new BadRequestException("Email already exists: " + dto.getEmail());
        }

        Department department = null;
        if (dto.getDepartmentId() != null) {
            department = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
        }

        String plainPassword = (password != null && !password.isBlank()) ? password : "Password@123";
        String roleStr = dto.getRole() != null ? dto.getRole().trim() : "ROLE_STUDENT";
        if (!roleStr.toUpperCase().startsWith("ROLE_")) {
            roleStr = "ROLE_" + roleStr.toUpperCase();
        }
        RoleType parsedRole;
        try {
            parsedRole = RoleType.valueOf(roleStr);
        } catch (Exception e) {
            parsedRole = RoleType.ROLE_STUDENT;
        }

        User user = new User(
                dto.getFullName(),
                dto.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(plainPassword),
                parsedRole,
                department
        );
        user.setPhone(dto.getPhone());
        user.setRollNumber(dto.getRollNumber());
        user.setActive(dto.isActive());

        User saved = userRepository.save(user);
        return toDto(saved);
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        if (dto.getRollNumber() != null) {
            user.setRollNumber(dto.getRollNumber());
        }

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
            user.setDepartment(dept);
        }

        if (dto.getRole() != null) {
            String r = dto.getRole().trim();
            if (!r.toUpperCase().startsWith("ROLE_")) {
                r = "ROLE_" + r.toUpperCase();
            }
            try {
                user.setRole(RoleType.valueOf(r));
            } catch (Exception ignored) {}
        }

        user.setActive(dto.isActive());
        User saved = userRepository.save(user);
        return toDto(saved);
    }

    @Transactional
    public UserDto toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        return toDto(saved);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().name());
        dto.setRollNumber(user.getRollNumber());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
        }
        return dto;
    }
}
