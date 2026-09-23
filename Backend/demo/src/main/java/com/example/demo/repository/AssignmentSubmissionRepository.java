package com.example.demo.repository;

import com.example.demo.entity.AssignmentSubmission;
import com.example.demo.entity.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    List<AssignmentSubmission> findByStudentId(Long studentId);
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    List<AssignmentSubmission> findByAssignmentCourseTeacherId(Long teacherId);
    long countByAssignmentCourseTeacherIdAndStatus(Long teacherId, AssignmentStatus status);
    long countByStudentIdAndStatus(Long studentId, AssignmentStatus status);
}
