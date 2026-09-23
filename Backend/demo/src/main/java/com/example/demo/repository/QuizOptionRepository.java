package com.example.demo.repository;

import com.example.demo.entity.QuizOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizOptionRepository extends JpaRepository<QuizOption, Long> {
    List<QuizOption> findByQuestionId(Long questionId);
    List<QuizOption> findByQuestionQuizId(Long quizId);
}
