package com.example.demo.repository;

import com.example.demo.entity.Attendance;
import com.example.demo.entity.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByCourseId(Long courseId);
    List<Attendance> findByCourseTeacherId(Long teacherId);
    List<Attendance> findByCourseIdAndDate(Long courseId, LocalDate date);
    List<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);
    Optional<Attendance> findByStudentIdAndCourseIdAndDate(Long studentId, Long courseId, LocalDate date);
    boolean existsByStudentIdAndCourseIdAndDate(Long studentId, Long courseId, LocalDate date);

    long countByStudentIdAndCourseId(Long studentId, Long courseId);
    long countByStudentIdAndCourseIdAndStatus(Long studentId, Long courseId, AttendanceStatus status);
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);
}
