package com.example.demo.service;

import com.example.demo.dto.CategoryDto;
import com.example.demo.entity.Category;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), c.getDescription()))
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return new CategoryDto(c.getId(), c.getName(), c.getDescription());
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category already exists: " + dto.getName());
        }
        Category c = new Category(dto.getName(), dto.getDescription());
        Category saved = categoryRepository.save(c);
        return new CategoryDto(saved.getId(), saved.getName(), saved.getDescription());
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        c.setName(dto.getName());
        c.setDescription(dto.getDescription());
        Category saved = categoryRepository.save(c);
        return new CategoryDto(saved.getId(), saved.getName(), saved.getDescription());
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
