package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.exception.AccessDeniedException;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizOptionRepository optionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public QuizService(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            QuizOptionRepository optionRepository,
            QuizAttemptRepository attemptRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.attemptRepository = attemptRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<QuizDto> getQuizzesForTeacher(Long teacherId) {
        return quizRepository.findByCourseTeacherId(teacherId).stream()
                .map(q -> toDto(q, null))
                .collect(Collectors.toList());
    }

    public List<QuizDto> getQuizzesForStudent(Long studentId) {
        List<Long> courseIds = enrollmentRepository.findByStudentId(studentId).stream()
                .map(e -> e.getCourse().getId())
                .collect(Collectors.toList());

        return quizRepository.findByCourseIdIn(courseIds).stream()
                .filter(Quiz::isPublished)
                .map(q -> toDto(q, studentId))
                .collect(Collectors.toList());
    }

    public List<QuizDto> getQuizzesByCourse(Long courseId, Long studentId) {
        return quizRepository.findByCourseId(courseId).stream()
                .map(q -> toDto(q, studentId))
                .collect(Collectors.toList());
    }

    public QuizDto getQuizById(Long quizId, Long studentId) {
        Quiz q = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        return toDto(q, studentId);
    }

    // For Student: Questions without answers revealed
    public List<QuizQuestionDto> getQuestionsForStudent(Long quizId) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        return questions.stream().map(q -> {
            QuizQuestionDto qDto = new QuizQuestionDto();
            qDto.setId(q.getId());
            qDto.setQuestionText(q.getQuestionText());
            qDto.setMarks(q.getMarks());

            List<QuizOptionDto> options = optionRepository.findByQuestionId(q.getId()).stream().map(o -> {
                // Do NOT reveal isCorrect to student!
                return new QuizOptionDto(o.getId(), o.getOptionText(), false);
            }).collect(Collectors.toList());

            qDto.setOptions(options);
            return qDto;
        }).collect(Collectors.toList());
    }

    // For Teacher: Full questions with correct answers
    public List<QuizQuestionDto> getQuestionsForTeacher(Long quizId, Long teacherId, String role) {
        Quiz q = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        if ("ROLE_TEACHER".equals(role) && !q.getCourse().getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("Access denied");
        }

        List<Question> questions = questionRepository.findByQuizId(quizId);
        return questions.stream().map(question -> {
            QuizQuestionDto qDto = new QuizQuestionDto();
            qDto.setId(question.getId());
            qDto.setQuestionText(question.getQuestionText());
            qDto.setMarks(question.getMarks());

            List<QuizOptionDto> options = optionRepository.findByQuestionId(question.getId()).stream()
                    .map(o -> new QuizOptionDto(o.getId(), o.getOptionText(), o.isCorrect()))
                    .collect(Collectors.toList());

            qDto.setOptions(options);
            return qDto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public QuizDto createQuiz(QuizRequest request, Long teacherId, String role) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if ("ROLE_TEACHER".equals(role) && !course.getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("You can only create quizzes for your assigned courses");
        }

        Quiz quiz = new Quiz(
                request.getTitle(),
                request.getDescription(),
                request.getDurationMinutes(),
                request.getTotalMarks(),
                course,
                request.getAvailableDate(),
                request.getDeadline(),
                request.isPublished()
        );

        Quiz savedQuiz = quizRepository.save(quiz);

        // Add questions if provided
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            for (QuizQuestionDto qDto : request.getQuestions()) {
                Question question = new Question(savedQuiz, qDto.getQuestionText(), qDto.getMarks());
                Question savedQuestion = questionRepository.save(question);

                if (qDto.getOptions() != null) {
                    for (QuizOptionDto optDto : qDto.getOptions()) {
                        QuizOption opt = new QuizOption(savedQuestion, optDto.getOptionText(), optDto.isCorrect());
                        optionRepository.save(opt);
                    }
                }
            }
        }

        return toDto(savedQuiz, null);
    }

    @Transactional
    public QuizResultDto submitQuiz(Long quizId, Long studentId, QuizSubmitRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Check if student already attempted
        Optional<QuizAttempt> existing = attemptRepository.findByQuizIdAndStudentId(quizId, studentId);
        if (existing.isPresent() && existing.get().isCompleted()) {
            throw new BadRequestException("You have already completed this quiz.");
        }

        List<Question> questions = questionRepository.findByQuizId(quizId);
        double totalScore = 0.0;
        int correctCount = 0;

        Map<Long, Long> userAnswers = request.getAnswers() != null ? request.getAnswers() : new HashMap<>();

        for (Question q : questions) {
            Long selectedOptionId = userAnswers.get(q.getId());
            if (selectedOptionId != null) {
                Optional<QuizOption> opt = optionRepository.findById(selectedOptionId);
                if (opt.isPresent() && opt.get().isCorrect() && opt.get().getQuestion().getId().equals(q.getId())) {
                    totalScore += q.getMarks();
                    correctCount++;
                }
            }
        }

        QuizAttempt attempt = existing.orElse(new QuizAttempt(quiz, student));
        attempt.setCompleted(true);
        attempt.setSubmitTime(LocalDateTime.now());
        attempt.setScore(totalScore);
        attempt.setTotalQuestions(questions.size());
        attempt.setCorrectAnswers(correctCount);

        QuizAttempt savedAttempt = attemptRepository.save(attempt);

        QuizResultDto result = new QuizResultDto();
        result.setAttemptId(savedAttempt.getId());
        result.setQuizId(quiz.getId());
        result.setQuizTitle(quiz.getTitle());
        result.setScore(totalScore);
        result.setTotalMarks(quiz.getTotalMarks());
        result.setTotalQuestions(questions.size());
        result.setCorrectAnswers(correctCount);
        double pct = (quiz.getTotalMarks() > 0) ? Math.round((totalScore / quiz.getTotalMarks()) * 100.0) : 0.0;
        result.setPercentage(pct);
        result.setPassed(pct >= 50.0);
        result.setSubmitTime(savedAttempt.getSubmitTime());

        return result;
    }

    public List<QuizResultDto> getQuizAttempts(Long quizId, Long teacherId, String role) {
        Quiz q = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        if ("ROLE_TEACHER".equals(role) && !q.getCourse().getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("Access denied");
        }

        return attemptRepository.findByQuizId(quizId).stream().map(a -> {
            QuizResultDto dto = new QuizResultDto();
            dto.setAttemptId(a.getId());
            dto.setQuizId(q.getId());
            dto.setQuizTitle(q.getTitle());
            dto.setScore(a.getScore());
            dto.setTotalMarks(q.getTotalMarks());
            dto.setTotalQuestions(a.getTotalQuestions());
            dto.setCorrectAnswers(a.getCorrectAnswers());
            double pct = (q.getTotalMarks() > 0) ? Math.round((a.getScore() / q.getTotalMarks()) * 100.0) : 0.0;
            dto.setPercentage(pct);
            dto.setPassed(pct >= 50.0);
            dto.setSubmitTime(a.getSubmitTime());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void deleteQuiz(Long id, Long teacherId, String role) {
        Quiz q = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        if ("ROLE_TEACHER".equals(role) && !q.getCourse().getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("Access denied");
        }

        quizRepository.delete(q);
    }

    private QuizDto toDto(Quiz q, Long studentId) {
        QuizDto dto = new QuizDto();
        dto.setId(q.getId());
        dto.setTitle(q.getTitle());
        dto.setDescription(q.getDescription());
        dto.setDurationMinutes(q.getDurationMinutes());
        dto.setTotalMarks(q.getTotalMarks());
        dto.setCourseId(q.getCourse().getId());
        dto.setCourseTitle(q.getCourse().getTitle());
        dto.setCourseCode(q.getCourse().getCode());
        dto.setAvailableDate(q.getAvailableDate());
        dto.setDeadline(q.getDeadline());
        dto.setPublished(q.isPublished());

        long count = questionRepository.findByQuizId(q.getId()).size();
        dto.setQuestionsCount(count);

        if (studentId != null) {
            Optional<QuizAttempt> att = attemptRepository.findByQuizIdAndStudentId(q.getId(), studentId);
            if (att.isPresent() && att.get().isCompleted()) {
                dto.setAttempted(true);
                dto.setScore(att.get().getScore());
                dto.setAttemptId(att.get().getId());
            } else {
                dto.setAttempted(false);
            }
        }

        return dto;
    }
}
