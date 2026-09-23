package com.example.demo.repository;

import com.example.demo.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizId(Long quizId);
    List<QuizAttempt> findByStudentId(Long studentId);
    List<QuizAttempt> findByQuizCourseTeacherId(Long teacherId);
    Optional<QuizAttempt> findByQuizIdAndStudentId(Long quizId, Long studentId);
}
