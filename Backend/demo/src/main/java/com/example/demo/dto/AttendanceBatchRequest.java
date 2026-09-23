package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class AttendanceBatchRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Records list is required")
    private List<AttendanceRecordDto> records;

    public AttendanceBatchRequest() {}

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public List<AttendanceRecordDto> getRecords() { return records; }
    public void setRecords(List<AttendanceRecordDto> records) { this.records = records; }
}
