package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private String role;
    private String userName;

    // Common and Role-specific numeric metrics
    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private long totalDepartments;
    private long totalEnrollments;
    private double averageAttendance;
    private long activeUsers;
    private long pendingSubmissions;
    private long pendingAssignments;
    private String averageGrade;

    // Additional data for charts and dashboard cards (strictly red/white compatible)
    private Map<String, Object> chartData;
    private List<NoticeDto> recentNotices;
    private List<ScheduleDto> todaySchedule;
    private List<AssignmentDto> upcomingAssignments;
    private List<QuizDto> upcomingQuizzes;
    private List<CourseDto> courses;

    public DashboardStatsDto() {}

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalTeachers() { return totalTeachers; }
    public void setTotalTeachers(long totalTeachers) { this.totalTeachers = totalTeachers; }

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public long getTotalEnrollments() { return totalEnrollments; }
    public void setTotalEnrollments(long totalEnrollments) { this.totalEnrollments = totalEnrollments; }

    public double getAverageAttendance() { return averageAttendance; }
    public void setAverageAttendance(double averageAttendance) { this.averageAttendance = averageAttendance; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public long getPendingSubmissions() { return pendingSubmissions; }
    public void setPendingSubmissions(long pendingSubmissions) { this.pendingSubmissions = pendingSubmissions; }

    public long getPendingAssignments() { return pendingAssignments; }
    public void setPendingAssignments(long pendingAssignments) { this.pendingAssignments = pendingAssignments; }

    public String getAverageGrade() { return averageGrade; }
    public void setAverageGrade(String averageGrade) { this.averageGrade = averageGrade; }

    public Map<String, Object> getChartData() { return chartData; }
    public void setChartData(Map<String, Object> chartData) { this.chartData = chartData; }

    public List<NoticeDto> getRecentNotices() { return recentNotices; }
    public void setRecentNotices(List<NoticeDto> recentNotices) { this.recentNotices = recentNotices; }

    public List<ScheduleDto> getTodaySchedule() { return todaySchedule; }
    public void setTodaySchedule(List<ScheduleDto> todaySchedule) { this.todaySchedule = todaySchedule; }

    public List<AssignmentDto> getUpcomingAssignments() { return upcomingAssignments; }
    public void setUpcomingAssignments(List<AssignmentDto> upcomingAssignments) { this.upcomingAssignments = upcomingAssignments; }

    public List<QuizDto> getUpcomingQuizzes() { return upcomingQuizzes; }
    public void setUpcomingQuizzes(List<QuizDto> upcomingQuizzes) { this.upcomingQuizzes = upcomingQuizzes; }

    public List<CourseDto> getCourses() { return courses; }
    public void setCourses(List<CourseDto> courses) { this.courses = courses; }
}
