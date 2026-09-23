package com.example.demo.repository;

import com.example.demo.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    List<LessonProgress> findByStudentIdAndLessonCourseId(Long studentId, Long courseId);
    Optional<LessonProgress> findByStudentIdAndLessonId(Long studentId, Long lessonId);
    long countByStudentIdAndLessonCourseIdAndCompletedTrue(Long studentId, Long courseId);
}
