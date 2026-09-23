package com.example.demo.service;

import com.example.demo.dto.CourseDto;
import com.example.demo.dto.CourseRequest;
import com.example.demo.entity.Category;
import com.example.demo.entity.Course;
import com.example.demo.entity.Department;
import com.example.demo.entity.User;
import com.example.demo.exception.AccessDeniedException;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public CourseService(
            CourseRepository courseRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            CategoryRepository categoryRepository,
            EnrollmentRepository enrollmentRepository,
            LessonRepository lessonRepository,
            LessonProgressRepository lessonProgressRepository
    ) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(c -> toDto(c, null))
                .collect(Collectors.toList());
    }

    public List<CourseDto> getPublicCourses() {
        return courseRepository.findByActiveTrue().stream()
                .map(c -> toDto(c, null))
                .collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream()
                .map(c -> toDto(c, null))
                .collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(e -> toDto(e.getCourse(), studentId))
                .collect(Collectors.toList());
    }

    public CourseDto getCourseById(Long id, Long currentUserId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + id));
        return toDto(course, currentUserId);
    }

    @Transactional
    public CourseDto createCourse(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode().trim())) {
            throw new BadRequestException("Course code already exists: " + request.getCode());
        }

        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with ID: " + request.getTeacherId()));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Course course = new Course(
                request.getTitle().trim(),
                request.getCode().trim(),
                request.getDescription(),
                teacher,
                department,
                category
        );
        course.setThumbnail(request.getThumbnail());
        course.setActive(request.isActive());

        Course saved = courseRepository.save(course);
        return toDto(saved, null);
    }

    @Transactional
    public CourseDto updateCourse(Long id, CourseRequest request, Long currentUserId, String role) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + id));

        // Enforce ownership: Teacher can only update own assigned course
        if ("ROLE_TEACHER".equals(role) && !course.getTeacher().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You do not have permission to modify this course");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        if (request.getThumbnail() != null) {
            course.setThumbnail(request.getThumbnail());
        }

        if ("ROLE_ADMIN".equals(role)) {
            if (request.getTeacherId() != null) {
                User teacher = userRepository.findById(request.getTeacherId())
                        .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
                course.setTeacher(teacher);
            }
            if (request.getDepartmentId() != null) {
                Department dept = departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
                course.setDepartment(dept);
            }
            if (request.getCategoryId() != null) {
                Category cat = categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                course.setCategory(cat);
            }
            course.setActive(request.isActive());
        }

        Course saved = courseRepository.save(course);
        return toDto(saved, currentUserId);
    }

    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with ID: " + id);
        }
        courseRepository.deleteById(id);
    }

    public CourseDto toDto(Course course, Long currentUserId) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setCode(course.getCode());
        dto.setDescription(course.getDescription());
        dto.setThumbnail(course.getThumbnail());
        dto.setActive(course.isActive());

        if (course.getTeacher() != null) {
            dto.setTeacherId(course.getTeacher().getId());
            dto.setTeacherName(course.getTeacher().getFullName());
        }

        if (course.getDepartment() != null) {
            dto.setDepartmentId(course.getDepartment().getId());
            dto.setDepartmentName(course.getDepartment().getName());
        }

        if (course.getCategory() != null) {
            dto.setCategoryId(course.getCategory().getId());
            dto.setCategoryName(course.getCategory().getName());
        }

        long enrolledCount = enrollmentRepository.countByCourseId(course.getId());
        dto.setEnrolledCount(enrolledCount);

        long lessonsCount = lessonRepository.countByCourseId(course.getId());
        dto.setLessonsCount(lessonsCount);

        if (currentUserId != null && lessonsCount > 0) {
            long completedLessons = lessonProgressRepository.countByStudentIdAndLessonCourseIdAndCompletedTrue(currentUserId, course.getId());
            dto.setCompletedLessonsCount(completedLessons);
            double progress = Math.round(((double) completedLessons / lessonsCount) * 100.0);
            dto.setProgress(progress);
        } else {
            dto.setCompletedLessonsCount(0);
            dto.setProgress(0.0);
        }

        return dto;
    }
}
