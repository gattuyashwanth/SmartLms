package com.example.demo.dto;

import java.util.Map;

public class QuizSubmitRequest {
    // Map of questionId -> selectedOptionId
    private Map<Long, Long> answers;

    public QuizSubmitRequest() {}

    public QuizSubmitRequest(Map<Long, Long> answers) {
        this.answers = answers;
    }

    public Map<Long, Long> getAnswers() { return answers; }
    public void setAnswers(Map<Long, Long> answers) { this.answers = answers; }
}
