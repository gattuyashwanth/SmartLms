package com.example.demo.entity;

import com.example.demo.entity.enums.AssignmentStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "assignment_submissions",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"assignment_id", "student_id"})
    }
)
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "file_url")
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssignmentStatus status = AssignmentStatus.SUBMITTED;

    @Column(name = "marks_obtained")
    private Double marksObtained;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    public AssignmentSubmission() {}

    public AssignmentSubmission(Assignment assignment, User student, String content, String fileUrl, AssignmentStatus status) {
        this.assignment = assignment;
        this.student = student;
        this.content = content;
        this.fileUrl = fileUrl;
        this.status = status;
        this.submissionDate = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.submissionDate == null) {
            this.submissionDate = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public AssignmentStatus getStatus() { return status; }
    public void setStatus(AssignmentStatus status) { this.status = status; }

    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getGradedAt() { return gradedAt; }
    public void setGradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; }
}
