package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignmentSubmissionRequest {

    @NotBlank(message = "Submission content or response is required")
    private String content;

    private String fileUrl;

    public AssignmentSubmissionRequest() {}

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
}
