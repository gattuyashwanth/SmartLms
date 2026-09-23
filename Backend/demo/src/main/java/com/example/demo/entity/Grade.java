package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "grades",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "course_id"})
    }
)
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "assignment_marks")
    private Double assignmentMarks = 0.0;

    @Column(name = "quiz_marks")
    private Double quizMarks = 0.0;

    @Column(name = "exam_marks")
    private Double examMarks = 0.0;

    @Column(name = "total_marks")
    private Double totalMarks = 0.0;

    private Double percentage = 0.0;

    @Column(name = "letter_grade", length = 10)
    private String letterGrade = "N/A";

    private String remarks;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Grade() {}

    public Grade(User student, Course course, Double assignmentMarks, Double quizMarks, Double examMarks, String remarks) {
        this.student = student;
        this.course = course;
        this.assignmentMarks = assignmentMarks != null ? assignmentMarks : 0.0;
        this.quizMarks = quizMarks != null ? quizMarks : 0.0;
        this.examMarks = examMarks != null ? examMarks : 0.0;
        this.remarks = remarks;
        calculateGrade();
    }

    @PrePersist
    @PreUpdate
    public void calculateGrade() {
        double a = this.assignmentMarks != null ? this.assignmentMarks : 0.0;
        double q = this.quizMarks != null ? this.quizMarks : 0.0;
        double e = this.examMarks != null ? this.examMarks : 0.0;
        this.totalMarks = a + q + e;
        // Total possible assumed out of 100
        this.percentage = Math.min(100.0, Math.max(0.0, this.totalMarks));
        if (this.percentage >= 90) this.letterGrade = "A+";
        else if (this.percentage >= 80) this.letterGrade = "A";
        else if (this.percentage >= 70) this.letterGrade = "B+";
        else if (this.percentage >= 60) this.letterGrade = "B";
        else if (this.percentage >= 50) this.letterGrade = "C";
        else if (this.percentage >= 40) this.letterGrade = "D";
        else this.letterGrade = "F";
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Double getAssignmentMarks() { return assignmentMarks; }
    public void setAssignmentMarks(Double assignmentMarks) { this.assignmentMarks = assignmentMarks; }

    public Double getQuizMarks() { return quizMarks; }
    public void setQuizMarks(Double quizMarks) { this.quizMarks = quizMarks; }

    public Double getExamMarks() { return examMarks; }
    public void setExamMarks(Double examMarks) { this.examMarks = examMarks; }

    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
