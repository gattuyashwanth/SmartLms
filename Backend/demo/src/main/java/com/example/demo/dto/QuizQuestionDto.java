package com.example.demo.dto;

import java.util.ArrayList;
import java.util.List;

public class QuizQuestionDto {
    private Long id;
    private String questionText;
    private Double marks = 2.0;
    private List<QuizOptionDto> options = new ArrayList<>();

    public QuizQuestionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }

    public List<QuizOptionDto> getOptions() { return options; }
    public void setOptions(List<QuizOptionDto> options) { this.options = options; }
}
