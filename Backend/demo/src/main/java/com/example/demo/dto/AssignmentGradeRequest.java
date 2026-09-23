package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public class AssignmentGradeRequest {

    @NotNull(message = "Marks obtained is required")
    private Double marksObtained;

    private String feedback;

    public AssignmentGradeRequest() {}

    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
