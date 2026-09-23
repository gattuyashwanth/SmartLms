package com.example.demo.entity;

import com.example.demo.entity.enums.ScheduleType;
import jakarta.persistence.*;

@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek; // Monday, Tuesday, etc.

    @Column(name = "start_time", nullable = false, length = 10)
    private String startTime; // 09:00

    @Column(name = "end_time", nullable = false, length = 10)
    private String endTime; // 10:30

    @Column(nullable = false, length = 50)
    private String room; // Hall 101, Lab 3

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ScheduleType type = ScheduleType.LECTURE;

    public Schedule() {}

    public Schedule(Course course, User teacher, String dayOfWeek, String startTime, String endTime, String room, ScheduleType type) {
        this.course = course;
        this.teacher = teacher;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public User getTeacher() { return teacher; }
    public void setTeacher(User teacher) { this.teacher = teacher; }

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
