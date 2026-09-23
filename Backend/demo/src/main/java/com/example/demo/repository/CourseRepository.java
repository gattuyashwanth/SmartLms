package com.example.demo.repository;

import com.example.demo.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);
    List<Course> findByDepartmentId(Long departmentId);
    List<Course> findByCategoryId(Long categoryId);
    List<Course> findByActiveTrue();
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);
}
