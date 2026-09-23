package com.example.demo.repository;

import com.example.demo.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByCourseId(Long courseId);
    List<Grade> findByCourseTeacherId(Long teacherId);
    Optional<Grade> findByStudentIdAndCourseId(Long studentId, Long courseId);
}
