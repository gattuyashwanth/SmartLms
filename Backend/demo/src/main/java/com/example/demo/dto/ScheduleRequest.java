package com.example.demo.dto;

import com.example.demo.entity.enums.ScheduleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ScheduleRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Teacher ID is required")
    private Long teacherId;

    @NotBlank(message = "Day of week is required")
    private String dayOfWeek;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    @NotBlank(message = "Room is required")
    private String room;

    private ScheduleType type = ScheduleType.LECTURE;

    public ScheduleRequest() {}

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public ScheduleType getType() { return type; }
    public void setType(ScheduleType type) { this.type = type; }
}
