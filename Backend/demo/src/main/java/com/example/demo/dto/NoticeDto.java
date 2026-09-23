package com.example.demo.dto;

import com.example.demo.entity.enums.NoticeAudience;
import com.example.demo.entity.enums.NoticePriority;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class NoticeDto {
    private Long id;
    private String title;
    private String content;
    private NoticePriority priority;
    private NoticeAudience audience;
    private Long authorId;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDate expiryDate;

    public NoticeDto() {}

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

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
