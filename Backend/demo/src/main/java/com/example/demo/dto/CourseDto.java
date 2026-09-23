package com.example.demo.dto;

public class CourseDto {
    private Long id;
    private String title;
    private String code;
    private String description;
    private String thumbnail;
    private Long teacherId;
    private String teacherName;
    private Long departmentId;
    private String departmentName;
    private Long categoryId;
    private String categoryName;
    private boolean active;
    private long enrolledCount;
    private long lessonsCount;
    private double progress; // percentage for student
    private long completedLessonsCount;

    public CourseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public long getEnrolledCount() { return enrolledCount; }
    public void setEnrolledCount(long enrolledCount) { this.enrolledCount = enrolledCount; }

    public long getLessonsCount() { return lessonsCount; }
    public void setLessonsCount(long lessonsCount) { this.lessonsCount = lessonsCount; }

    public double getProgress() { return progress; }
    public void setProgress(double progress) { this.progress = progress; }

    public long getCompletedLessonsCount() { return completedLessonsCount; }
    public void setCompletedLessonsCount(long completedLessonsCount) { this.completedLessonsCount = completedLessonsCount; }
}
