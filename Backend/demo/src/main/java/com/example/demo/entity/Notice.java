package com.example.demo.entity;

import com.example.demo.entity.enums.NoticeAudience;
import com.example.demo.entity.enums.NoticePriority;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NoticePriority priority = NoticePriority.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NoticeAudience audience = NoticeAudience.ALL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private User author;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    public Notice() {}

    public Notice(String title, String content, NoticePriority priority, NoticeAudience audience, User author, LocalDate expiryDate) {
        this.title = title;
        this.content = content;
        this.priority = priority;
        this.audience = audience;
        this.author = author;
        this.expiryDate = expiryDate;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public NoticePriority getPriority() { return priority; }
    public void setPriority(NoticePriority priority) { this.priority = priority; }

    public NoticeAudience getAudience() { return audience; }
    public void setAudience(NoticeAudience audience) { this.audience = audience; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
