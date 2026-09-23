package com.example.demo.service;

import com.example.demo.dto.ScheduleDto;
import com.example.demo.dto.ScheduleRequest;
import com.example.demo.entity.Course;
import com.example.demo.entity.Enrollment;
import com.example.demo.entity.Schedule;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.ScheduleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ScheduleService(
            ScheduleRepository scheduleRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.scheduleRepository = scheduleRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<ScheduleDto> getAllSchedules() {
        return scheduleRepository.findAllByOrderByDayOfWeekAscStartTimeAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ScheduleDto> getSchedulesForTeacher(Long teacherId) {
        return scheduleRepository.findByTeacherId(teacherId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ScheduleDto> getSchedulesForStudent(Long studentId) {
        List<Long> courseIds = enrollmentRepository.findByStudentId(studentId).stream()
                .map(Enrollment::getCourse)
                .map(Course::getId)
                .collect(Collectors.toList());

        return scheduleRepository.findByCourseIdIn(courseIds).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScheduleDto createSchedule(ScheduleRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Schedule schedule = new Schedule(
                course,
                teacher,
                request.getDayOfWeek(),
                request.getStartTime(),
                request.getEndTime(),
                request.getRoom(),
                request.getType()
        );

        Schedule saved = scheduleRepository.save(schedule);
        return toDto(saved);
    }

    @Transactional
    public ScheduleDto updateSchedule(Long id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        schedule.setCourse(course);
        schedule.setTeacher(teacher);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setRoom(request.getRoom());
        schedule.setType(request.getType());

        Schedule saved = scheduleRepository.save(schedule);
        return toDto(saved);
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with ID: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    private ScheduleDto toDto(Schedule s) {
        ScheduleDto dto = new ScheduleDto();
        dto.setId(s.getId());
        dto.setCourseId(s.getCourse().getId());
        dto.setCourseTitle(s.getCourse().getTitle());
        dto.setCourseCode(s.getCourse().getCode());
        dto.setTeacherId(s.getTeacher().getId());
        dto.setTeacherName(s.getTeacher().getFullName());
        dto.setDayOfWeek(s.getDayOfWeek());
        dto.setStartTime(s.getStartTime());
        dto.setEndTime(s.getEndTime());
        dto.setRoom(s.getRoom());
        dto.setType(s.getType());
        return dto;
    }
}
