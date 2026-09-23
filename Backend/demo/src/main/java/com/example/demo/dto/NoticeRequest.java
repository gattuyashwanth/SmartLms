package com.example.demo.dto;

import com.example.demo.entity.enums.NoticeAudience;
import com.example.demo.entity.enums.NoticePriority;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class NoticeRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private NoticePriority priority = NoticePriority.NORMAL;
    private NoticeAudience audience = NoticeAudience.ALL;
    private LocalDate expiryDate;

    public NoticeRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public NoticePriority getPriority() { return priority; }
    public void setPriority(NoticePriority priority) { this.priority = priority; }

    public NoticeAudience getAudience() { return audience; }
    public void setAudience(NoticeAudience audience) { this.audience = audience; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
