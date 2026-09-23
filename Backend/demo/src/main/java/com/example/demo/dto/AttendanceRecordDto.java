package com.example.demo.dto;

import com.example.demo.entity.enums.AttendanceStatus;

public class AttendanceRecordDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private AttendanceStatus status;
    private String remarks;

    public AttendanceRecordDto() {}

    public AttendanceRecordDto(Long studentId, String studentName, String rollNumber, AttendanceStatus status, String remarks) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
