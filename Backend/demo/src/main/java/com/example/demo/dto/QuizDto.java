package com.example.demo.dto;

import java.time.LocalDateTime;

public class QuizDto {
    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Double totalMarks;
    private Long courseId;
    private String courseTitle;
    private String courseCode;
    private long questionsCount;
    private LocalDateTime availableDate;
    private LocalDateTime deadline;
    private boolean published;

    // Student attempt details if available
    private boolean attempted;
    private Double score;
    private Long attemptId;

    public QuizDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public long getQuestionsCount() { return questionsCount; }
    public void setQuestionsCount(long questionsCount) { this.questionsCount = questionsCount; }

    public LocalDateTime getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDateTime availableDate) { this.availableDate = availableDate; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public boolean isAttempted() { return attempted; }
    public void setAttempted(boolean attempted) { this.attempted = attempted; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
}
