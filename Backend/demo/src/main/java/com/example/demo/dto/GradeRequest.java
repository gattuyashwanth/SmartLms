package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public class GradeRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private Double assignmentMarks = 0.0;
    private Double quizMarks = 0.0;
    private Double examMarks = 0.0;
    private String remarks;

    public GradeRequest() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Double getAssignmentMarks() { return assignmentMarks; }
    public void setAssignmentMarks(Double assignmentMarks) { this.assignmentMarks = assignmentMarks; }

    public Double getQuizMarks() { return quizMarks; }
    public void setQuizMarks(Double quizMarks) { this.quizMarks = quizMarks; }

    public Double getExamMarks() { return examMarks; }
    public void setExamMarks(Double examMarks) { this.examMarks = examMarks; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
