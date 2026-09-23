package com.example.demo.dto;

import java.time.LocalDate;
import java.util.List;

public class AttendanceSummaryDto {
    private long totalClasses;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private double overallPercentage;
    private List<CourseAttendanceDto> courseBreakdown;
    private List<AttendanceLogDto> recentLogs;

    public AttendanceSummaryDto() {}

    public static class CourseAttendanceDto {
        private Long courseId;
        private String courseTitle;
        private String courseCode;
        private long totalClasses;
        private long attendedClasses;
        private double percentage;

        public CourseAttendanceDto() {}

        public CourseAttendanceDto(Long courseId, String courseTitle, String courseCode, long totalClasses, long attendedClasses, double percentage) {
            this.courseId = courseId;
            this.courseTitle = courseTitle;
            this.courseCode = courseCode;
            this.totalClasses = totalClasses;
            this.attendedClasses = attendedClasses;
            this.percentage = percentage;
        }

        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }

        public String getCourseTitle() { return courseTitle; }
        public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

        public String getCourseCode() { return courseCode; }
        public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

        public long getTotalClasses() { return totalClasses; }
        public void setTotalClasses(long totalClasses) { this.totalClasses = totalClasses; }

        public long getAttendedClasses() { return attendedClasses; }
        public void setAttendedClasses(long attendedClasses) { this.attendedClasses = attendedClasses; }

        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    public static class AttendanceLogDto {
        private Long id;
        private Long courseId;
        private String courseTitle;
        private LocalDate date;
        private String status;
        private String remarks;

        public AttendanceLogDto() {}

        public AttendanceLogDto(Long id, Long courseId, String courseTitle, LocalDate date, String status, String remarks) {
            this.id = id;
            this.courseId = courseId;
            this.courseTitle = courseTitle;
            this.date = date;
            this.status = status;
            this.remarks = remarks;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }

        public String getCourseTitle() { return courseTitle; }
        public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }

    public long getTotalClasses() { return totalClasses; }
    public void setTotalClasses(long totalClasses) { this.totalClasses = totalClasses; }

    public long getPresentCount() { return presentCount; }
    public void setPresentCount(long presentCount) { this.presentCount = presentCount; }

    public long getAbsentCount() { return absentCount; }
    public void setAbsentCount(long absentCount) { this.absentCount = absentCount; }

    public long getLateCount() { return lateCount; }
    public void setLateCount(long lateCount) { this.lateCount = lateCount; }

    public double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(double overallPercentage) { this.overallPercentage = overallPercentage; }

    public List<CourseAttendanceDto> getCourseBreakdown() { return courseBreakdown; }
    public void setCourseBreakdown(List<CourseAttendanceDto> courseBreakdown) { this.courseBreakdown = courseBreakdown; }

    public List<AttendanceLogDto> getRecentLogs() { return recentLogs; }
    public void setRecentLogs(List<AttendanceLogDto> recentLogs) { this.recentLogs = recentLogs; }
}
