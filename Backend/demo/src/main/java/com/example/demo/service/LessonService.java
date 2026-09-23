package com.example.demo.service;

import com.example.demo.dto.LessonDto;
import com.example.demo.dto.LessonRequest;
import com.example.demo.entity.Course;
import com.example.demo.entity.Lesson;
import com.example.demo.entity.LessonProgress;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LessonProgressRepository;
import com.example.demo.repository.LessonRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final UserRepository userRepository;

    public LessonService(
            LessonRepository lessonRepository,
            CourseRepository courseRepository,
            LessonProgressRepository lessonProgressRepository,
            UserRepository userRepository
    ) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.userRepository = userRepository;
    }

    public List<LessonDto> getLessonsByCourse(Long courseId, Long currentStudentId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySortOrderAsc(courseId);
        return lessons.stream().map(l -> {
            LessonDto dto = new LessonDto();
            dto.setId(l.getId());
            dto.setTitle(l.getTitle());
            dto.setDescription(l.getDescription());
            dto.setContent(l.getContent());
            dto.setVideoUrl(l.getVideoUrl());
            dto.setDurationMinutes(l.getDurationMinutes());
            dto.setSortOrder(l.getSortOrder());
            dto.setCourseId(courseId);

            if (currentStudentId != null) {
                Optional<LessonProgress> lp = lessonProgressRepository.findByStudentIdAndLessonId(currentStudentId, l.getId());
                dto.setCompleted(lp.isPresent() && lp.get().isCompleted());
            } else {
                dto.setCompleted(false);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public LessonDto createLesson(LessonRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + request.getCourseId()));

        Lesson lesson = new Lesson(
                request.getTitle(),
                request.getDescription(),
                request.getContent(),
                request.getVideoUrl(),
                request.getDurationMinutes(),
                request.getSortOrder(),
                course
        );

        Lesson saved = lessonRepository.save(lesson);
        LessonDto dto = new LessonDto();
        dto.setId(saved.getId());
        dto.setTitle(saved.getTitle());
        dto.setDescription(saved.getDescription());
        dto.setContent(saved.getContent());
        dto.setVideoUrl(saved.getVideoUrl());
        dto.setDurationMinutes(saved.getDurationMinutes());
        dto.setSortOrder(saved.getSortOrder());
        dto.setCourseId(course.getId());
        dto.setCompleted(false);
        return dto;
    }

    @Transactional
    public LessonDto updateLesson(Long id, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with ID: " + id));

        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setContent(request.getContent());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setDurationMinutes(request.getDurationMinutes());
        lesson.setSortOrder(request.getSortOrder());

        Lesson saved = lessonRepository.save(lesson);
        LessonDto dto = new LessonDto();
        dto.setId(saved.getId());
        dto.setTitle(saved.getTitle());
        dto.setDescription(saved.getDescription());
        dto.setContent(saved.getContent());
        dto.setVideoUrl(saved.getVideoUrl());
        dto.setDurationMinutes(saved.getDurationMinutes());
        dto.setSortOrder(saved.getSortOrder());
        dto.setCourseId(saved.getCourse().getId());
        return dto;
    }

    @Transactional
    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lesson not found with ID: " + id);
        }
        lessonRepository.deleteById(id);
    }

    @Transactional
    public boolean toggleCompleteLesson(Long lessonId, Long studentId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Optional<LessonProgress> optLp = lessonProgressRepository.findByStudentIdAndLessonId(studentId, lessonId);
        if (optLp.isPresent()) {
            LessonProgress lp = optLp.get();
            lp.setCompleted(!lp.isCompleted());
            lessonProgressRepository.save(lp);
            return lp.isCompleted();
        } else {
            LessonProgress lp = new LessonProgress(student, lesson, true);
            lessonProgressRepository.save(lp);
            return true;
        }
    }
}
