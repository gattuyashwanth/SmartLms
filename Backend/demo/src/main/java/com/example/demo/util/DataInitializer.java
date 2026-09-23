package com.example.demo.util;

import com.example.demo.entity.*;
import com.example.demo.entity.enums.*;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final ResourceRepository resourceRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizOptionRepository optionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final AttendanceRepository attendanceRepository;
    private final GradeRepository gradeRepository;
    private final NoticeRepository noticeRepository;
    private final ScheduleRepository scheduleRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            CategoryRepository categoryRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            LessonRepository lessonRepository,
            LessonProgressRepository lessonProgressRepository,
            ResourceRepository resourceRepository,
            AssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            QuizOptionRepository optionRepository,
            QuizAttemptRepository attemptRepository,
            AttendanceRepository attendanceRepository,
            GradeRepository gradeRepository,
            NoticeRepository noticeRepository,
            ScheduleRepository scheduleRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.resourceRepository = resourceRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.attemptRepository = attemptRepository;
        this.attendanceRepository = attendanceRepository;
        this.gradeRepository = gradeRepository;
        this.noticeRepository = noticeRepository;
        this.scheduleRepository = scheduleRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println(">>> SEEDING SMART LMS DATABASE WITH UNIVERSITY DATA...");

        // 1. Departments
        Department cse = departmentRepository.save(new Department("Computer Science & Engineering", "CSE", "Department of Computer Science and Systems"));
        Department it = departmentRepository.save(new Department("Information Technology", "IT", "Department of Software and Information Technology"));
        Department ece = departmentRepository.save(new Department("Electronics & Communication", "ECE", "Department of Electronics and Embedded Systems"));
        Department me = departmentRepository.save(new Department("Mechanical Engineering", "ME", "Department of Mechanical Systems & Automation"));
        Department ce = departmentRepository.save(new Department("Civil Engineering", "CE", "Department of Civil & Structural Engineering"));

        // 2. Categories
        Category catProg = categoryRepository.save(new Category("Programming", "Object-oriented and functional software programming"));
        Category catDb = categoryRepository.save(new Category("Database", "Relational database systems and schema design"));
        Category catAi = categoryRepository.save(new Category("Artificial Intelligence", "Foundations of AI and machine reasoning"));
        Category catMl = categoryRepository.save(new Category("Machine Learning", "Statistical learning and neural networks"));
        Category catWeb = categoryRepository.save(new Category("Web Development", "Modern full-stack web engineering"));
        Category catCloud = categoryRepository.save(new Category("Cloud Computing", "Distributed systems and cloud architecture"));
        Category catSec = categoryRepository.save(new Category("Cyber Security", "Network defense and information security"));
        Category catDs = categoryRepository.save(new Category("Data Science", "Big data analysis, pipelines, and statistics"));

        // 3. Users (Admin, Teachers, Students)
        String defaultPw = passwordEncoder.encode("Password@123");

        // Admin
        User admin = new User("Dr. S. K. Verma", "admin@smartlms.com", defaultPw, RoleType.ROLE_ADMIN, cse);
        admin.setPhone("+91 98765 43210");
        admin = userRepository.save(admin);

        // Teachers
        User teacherRajesh = new User("Prof. Rajesh Sharma", "rajesh.teacher@smartlms.com", defaultPw, RoleType.ROLE_TEACHER, cse);
        teacherRajesh.setPhone("+91 98111 22233");
        teacherRajesh = userRepository.save(teacherRajesh);

        User teacherPriya = new User("Dr. Priya Nair", "priya.teacher@smartlms.com", defaultPw, RoleType.ROLE_TEACHER, it);
        teacherPriya.setPhone("+91 98222 33344");
        teacherPriya = userRepository.save(teacherPriya);

        User teacherArjun = new User("Prof. Arjun Mehta", "arjun.teacher@smartlms.com", defaultPw, RoleType.ROLE_TEACHER, cse);
        teacherArjun.setPhone("+91 98333 44455");
        teacherArjun = userRepository.save(teacherArjun);

        // Students
        User student1 = new User("Aarav Patel", "student1@smartlms.com", defaultPw, RoleType.ROLE_STUDENT, cse);
        student1.setRollNumber("24CSE001");
        student1.setPhone("+91 97111 55566");
        student1 = userRepository.save(student1);

        User student2 = new User("Ananya Iyer", "student2@smartlms.com", defaultPw, RoleType.ROLE_STUDENT, cse);
        student2.setRollNumber("24CSE002");
        student2.setPhone("+91 97222 66677");
        student2 = userRepository.save(student2);

        User student3 = new User("Rohan Deshmukh", "student3@smartlms.com", defaultPw, RoleType.ROLE_STUDENT, it);
        student3.setRollNumber("24IT001");
        student3.setPhone("+91 97333 77788");
        student3 = userRepository.save(student3);

        // 4. Courses
        Course course1 = new Course("Java Full Stack Development", "CS301", "Comprehensive enterprise Java architecture with Spring Boot REST services, JPA persistence, and modern React user interfaces.", teacherRajesh, cse, catProg);
        course1.setThumbnail("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80");
        course1 = courseRepository.save(course1);

        Course course2 = new Course("Database Management Systems", "CS202", "Relational database concepts, normalization (1NF-BCNF), SQL queries, indexing, transactions, and ACID principles.", teacherPriya, it, catDb);
        course2.setThumbnail("https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80");
        course2 = courseRepository.save(course2);

        Course course3 = new Course("Machine Learning", "CS401", "Supervised and unsupervised learning, regression, classification, decision trees, support vector machines, and model evaluation.", teacherArjun, cse, catMl);
        course3.setThumbnail("https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80");
        course3 = courseRepository.save(course3);

        Course course4 = new Course("Data Structures and Algorithms", "CS201", "Analysis of algorithms, asymptotic notation, linear and non-linear data structures, graph traversals, and dynamic programming.", teacherRajesh, cse, catProg);
        course4.setThumbnail("https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80");
        course4 = courseRepository.save(course4);

        Course course5 = new Course("Web Technologies", "IT302", "Modern web fundamentals including HTML5, CSS3, JavaScript ES6+, asynchronous programming, and RESTful client integration.", teacherPriya, it, catWeb);
        course5.setThumbnail("https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80");
        course5 = courseRepository.save(course5);

        Course course6 = new Course("Computer Networks", "CS303", "OSI and TCP/IP protocol stacks, network layer routing, transport layer TCP/UDP flow control, and application protocols.", teacherRajesh, cse, catSec);
        course6.setThumbnail("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80");
        course6 = courseRepository.save(course6);

        Course course7 = new Course("Operating Systems", "CS204", "Process scheduling, thread management, memory paging, synchronization primitives, deadlocks, and file systems.", teacherPriya, it, catProg);
        course7.setThumbnail("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80");
        course7 = courseRepository.save(course7);

        Course course8 = new Course("Artificial Intelligence", "AI402", "Search algorithms, heuristic strategies, knowledge representation, inference engines, and introductory neural networks.", teacherArjun, cse, catAi);
        course8.setThumbnail("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80");
        course8 = courseRepository.save(course8);

        // 5. Enrollments
        enrollmentRepository.save(new Enrollment(student1, course1));
        enrollmentRepository.save(new Enrollment(student1, course2));
        enrollmentRepository.save(new Enrollment(student1, course3));
        enrollmentRepository.save(new Enrollment(student1, course4));

        enrollmentRepository.save(new Enrollment(student2, course1));
        enrollmentRepository.save(new Enrollment(student2, course2));
        enrollmentRepository.save(new Enrollment(student2, course5));

        enrollmentRepository.save(new Enrollment(student3, course2));
        enrollmentRepository.save(new Enrollment(student3, course5));
        enrollmentRepository.save(new Enrollment(student3, course7));

        // 6. Lessons for Course 1 (Java Full Stack)
        Lesson l1 = lessonRepository.save(new Lesson("1. Introduction to Spring Boot Architecture", "Overview of IoC container, Dependency Injection, and Spring Boot starters.", "In this lesson, we explore how Spring Boot streamlines enterprise Java development. We look into application contexts, @SpringBootApplication, and auto-configuration.", "https://www.youtube.com/embed/dQw4w9WgXcQ", 45, 1, course1));
        Lesson l2 = lessonRepository.save(new Lesson("2. Spring Data JPA & Hibernate", "Configuring MySQL entities, repository interfaces, and transactions.", "Learn how Hibernate maps Java objects to MySQL relational tables with entity lifecycles, annotations, and JPQL queries.", "https://www.youtube.com/embed/dQw4w9WgXcQ", 50, 2, course1));
        Lesson l3 = lessonRepository.save(new Lesson("3. Spring Security & JWT Implementation", "Configuring stateless security filter chain and token signing.", "Security architecture deep dive: UserDetailsService, PasswordEncoder, JJWT tokens, and role-based endpoint guards.", "https://www.youtube.com/embed/dQw4w9WgXcQ", 55, 3, course1));
        Lesson l4 = lessonRepository.save(new Lesson("4. Building React Client Interfaces", "Components, hooks, Axios interceptors, and state management.", "Connecting our Spring Boot backend with a React single-page frontend using Vite, React Router, and Axios.", "https://www.youtube.com/embed/dQw4w9WgXcQ", 60, 4, course1));

        // Lesson progress for student1
        lessonProgressRepository.save(new LessonProgress(student1, l1, true));
        lessonProgressRepository.save(new LessonProgress(student1, l2, true));
        lessonProgressRepository.save(new LessonProgress(student1, l3, false));

        // Lessons for Course 2 (DBMS)
        lessonRepository.save(new Lesson("1. Entity Relationship Modeling", "Designing ER diagrams, entities, attributes, and relationships.", "Understanding how to translate real-world college domain models into conceptual ER diagrams.", "https://www.youtube.com/embed/dQw4w9WgXcQ", 45, 1, course2));
        lessonRepository.save(new Lesson("2. Relational Schema Normalization", "1NF, 2NF, 3NF, and Boyce-Codd Normal Form.", "Eliminating data redundancies, update anomalies, and preserving functional dependencies.", "https://www.youtube.com/embed/dQw4w9WgXcQ", 50, 2, course2));

        // 7. Resources
        resourceRepository.save(new Resource("Spring Boot 3 & 4 Architectural Reference", "PDF", "https://spring.io/projects/spring-boot", course1));
        resourceRepository.save(new Resource("Java Collections Framework Cheat Sheet", "PDF", "https://docs.oracle.com/javase/tutorial/collections/", course1));
        resourceRepository.save(new Resource("Database Normalization Lecture Slides", "PPT", "https://smartlms.edu/resources/dbms_norm.pdf", course2));
        resourceRepository.save(new Resource("SQL Query Optimization Guidelines", "DOC", "https://smartlms.edu/resources/sql_opt.doc", course2));

        // 8. Assignments
        Assignment a1 = new Assignment(
                "Lab 1: Spring Boot REST API Implementation",
                "Implement a complete CRUD REST service with validation and exception handling for a university department portal.",
                LocalDateTime.now().plusDays(5),
                100.0,
                "Submit your source zip link or GitHub repository URL. Ensure all unit tests pass.",
                course1
        );
        a1 = assignmentRepository.save(a1);

        Assignment a2 = new Assignment(
                "Assignment 2: Database Schema & Normalization Design",
                "Design a normalized 3NF database schema for an automated student examination system.",
                LocalDateTime.now().plusDays(3),
                50.0,
                "Provide relational schema diagrams and explanation of all functional dependencies.",
                course2
        );
        a2 = assignmentRepository.save(a2);

        // Student 1 submitted Assignment 1
        AssignmentSubmission sub1 = new AssignmentSubmission(
                a1,
                student1,
                "Implemented all requested REST endpoints with global exception handling and Swagger documentation.",
                "https://github.com/smartlms-student/spring-boot-lab1",
                AssignmentStatus.GRADED
        );
        sub1.setMarksObtained(94.0);
        sub1.setFeedback("Excellent clean architecture! Clean DTO separation and proper HTTP response codes.");
        sub1.setGradedAt(LocalDateTime.now().minusDays(1));
        submissionRepository.save(sub1);

        // Student 2 submitted Assignment 1 (Pending grading)
        AssignmentSubmission sub2 = new AssignmentSubmission(
                a1,
                student2,
                "Completed the assignment following the standard controller-service-repository pattern.",
                "https://github.com/smartlms-student/assignment1",
                AssignmentStatus.SUBMITTED
        );
        submissionRepository.save(sub2);

        // 9. Quizzes
        Quiz q1 = new Quiz(
                "Java & Spring Framework Core Quiz",
                "Assesses your understanding of Java OOP, Spring IoC, and REST API conventions.",
                20,
                10.0,
                course1,
                LocalDateTime.now().minusDays(2),
                LocalDateTime.now().plusDays(7),
                true
        );
        q1 = quizRepository.save(q1);

        Question qn1 = questionRepository.save(new Question(q1, "Which Spring annotation is used to mark a class as a RESTful web service controller?", 2.0));
        optionRepository.save(new QuizOption(qn1, "@RestController", true));
        optionRepository.save(new QuizOption(qn1, "@Service", false));
        optionRepository.save(new QuizOption(qn1, "@Component", false));
        optionRepository.save(new QuizOption(qn1, "@Repository", false));

        Question qn2 = questionRepository.save(new Question(q1, "What HTTP status code is returned for successful resource creation in REST?", 2.0));
        optionRepository.save(new QuizOption(qn2, "201 Created", true));
        optionRepository.save(new QuizOption(qn2, "200 OK", false));
        optionRepository.save(new QuizOption(qn2, "204 No Content", false));
        optionRepository.save(new QuizOption(qn2, "400 Bad Request", false));

        Question qn3 = questionRepository.save(new Question(q1, "In Spring Security, which component is responsible for loading user-specific data?", 2.0));
        optionRepository.save(new QuizOption(qn3, "UserDetailsService", true));
        optionRepository.save(new QuizOption(qn3, "AuthenticationManager", false));
        optionRepository.save(new QuizOption(qn3, "SecurityFilterChain", false));
        optionRepository.save(new QuizOption(qn3, "PasswordEncoder", false));

        Question qn4 = questionRepository.save(new Question(q1, "Which JPA cascade type ensures that child entities are deleted when parent is removed?", 2.0));
        optionRepository.save(new QuizOption(qn4, "CascadeType.REMOVE or CascadeType.ALL", true));
        optionRepository.save(new QuizOption(qn4, "CascadeType.PERSIST", false));
        optionRepository.save(new QuizOption(qn4, "CascadeType.REFRESH", false));
        optionRepository.save(new QuizOption(qn4, "CascadeType.MERGE", false));

        Question qn5 = questionRepository.save(new Question(q1, "What is the primary function of the @Transactional annotation in Spring?", 2.0));
        optionRepository.save(new QuizOption(qn5, "Manages database transaction boundaries automatically (commit/rollback)", true));
        optionRepository.save(new QuizOption(qn5, "Encrypts database communication", false));
        optionRepository.save(new QuizOption(qn5, "Caches HTTP responses in browser memory", false));
        optionRepository.save(new QuizOption(qn5, "Converts Java objects to JSON format", false));

        // Student 1 completed Quiz 1
        QuizAttempt attempt1 = new QuizAttempt(q1, student1);
        attempt1.setCompleted(true);
        attempt1.setScore(10.0);
        attempt1.setTotalQuestions(5);
        attempt1.setCorrectAnswers(5);
        attempt1.setSubmitTime(LocalDateTime.now().minusDays(1));
        attemptRepository.save(attempt1);

        // 10. Attendance Records for realistic analytics
        LocalDate today = LocalDate.now();
        attendanceRepository.save(new Attendance(student1, course1, teacherRajesh, today.minusDays(4), AttendanceStatus.PRESENT, "Active participation"));
        attendanceRepository.save(new Attendance(student1, course1, teacherRajesh, today.minusDays(3), AttendanceStatus.PRESENT, ""));
        attendanceRepository.save(new Attendance(student1, course1, teacherRajesh, today.minusDays(2), AttendanceStatus.LATE, "Arrived 10 mins late"));
        attendanceRepository.save(new Attendance(student1, course1, teacherRajesh, today.minusDays(1), AttendanceStatus.PRESENT, ""));

        attendanceRepository.save(new Attendance(student2, course1, teacherRajesh, today.minusDays(4), AttendanceStatus.PRESENT, ""));
        attendanceRepository.save(new Attendance(student2, course1, teacherRajesh, today.minusDays(3), AttendanceStatus.ABSENT, "Medical leave"));
        attendanceRepository.save(new Attendance(student2, course1, teacherRajesh, today.minusDays(2), AttendanceStatus.PRESENT, ""));
        attendanceRepository.save(new Attendance(student2, course1, teacherRajesh, today.minusDays(1), AttendanceStatus.PRESENT, ""));

        attendanceRepository.save(new Attendance(student1, course2, teacherPriya, today.minusDays(3), AttendanceStatus.PRESENT, ""));
        attendanceRepository.save(new Attendance(student1, course2, teacherPriya, today.minusDays(1), AttendanceStatus.PRESENT, ""));

        // 11. Grades
        gradeRepository.save(new Grade(student1, course1, 38.0, 18.0, 38.0, "Consistent top performance in lab assessments and theoretical concepts."));
        gradeRepository.save(new Grade(student1, course2, 35.0, 16.0, 36.0, "Strong understanding of SQL queries and normalization."));
        gradeRepository.save(new Grade(student2, course1, 32.0, 14.0, 34.0, "Good grasp of Spring Boot fundamentals."));

        // 12. University Notices
        noticeRepository.save(new Notice(
                "Mid-Semester Examination Schedule Announced",
                "The mid-semester examinations for the academic session 2026 will commence from next month. All students are advised to check their respective course timetable.",
                NoticePriority.IMPORTANT,
                NoticeAudience.ALL,
                admin,
                today.plusDays(30)
        ));

        noticeRepository.save(new Notice(
                "Faculty Meeting: Curriculum & Laboratory Review",
                "All department heads and teaching faculty are requested to assemble in the Central Seminar Hall on Friday at 3:30 PM for the quarterly curriculum review.",
                NoticePriority.NORMAL,
                NoticeAudience.TEACHERS,
                admin,
                today.plusDays(10)
        ));

        noticeRepository.save(new Notice(
                "Smart LMS Maintenance Window Notice",
                "Routine cloud backup and infrastructure optimization will take place on Sunday between 02:00 AM and 04:00 AM IST. Portal services may experience brief latency.",
                NoticePriority.NORMAL,
                NoticeAudience.ALL,
                admin,
                today.plusDays(7)
        ));

        // 13. Timetable Schedules
        scheduleRepository.save(new Schedule(course1, teacherRajesh, "Monday", "09:00", "10:30", "Lecture Hall 101", ScheduleType.LECTURE));
        scheduleRepository.save(new Schedule(course1, teacherRajesh, "Wednesday", "11:00", "12:30", "Software Lab 2", ScheduleType.LAB));
        scheduleRepository.save(new Schedule(course2, teacherPriya, "Tuesday", "10:00", "11:30", "Lecture Hall 104", ScheduleType.LECTURE));
        scheduleRepository.save(new Schedule(course2, teacherPriya, "Thursday", "14:00", "16:00", "Database Lab 1", ScheduleType.LAB));
        scheduleRepository.save(new Schedule(course3, teacherArjun, "Wednesday", "14:00", "15:30", "Seminar Room A", ScheduleType.LECTURE));
        scheduleRepository.save(new Schedule(course4, teacherRajesh, "Friday", "09:00", "10:30", "Lecture Hall 102", ScheduleType.LECTURE));

        // 14. Notifications
        notificationRepository.save(new Notification(student1, "Welcome to Smart LMS", "Your student portal is fully active. Check your enrolled courses and class schedule.", "/student/dashboard"));
        notificationRepository.save(new Notification(student1, "New Assignment Assigned", "Prof. Rajesh Sharma assigned Lab 1: Spring Boot REST API Implementation.", "/student/assignments"));
        notificationRepository.save(new Notification(student1, "Assignment Graded", "Your submission for Lab 1 has been graded: 94/100 (Grade: A+).", "/student/grades"));
        notificationRepository.save(new Notification(teacherRajesh, "New Assignment Submission", "Student Ananya Iyer submitted Lab 1 for evaluation.", "/teacher/assignments"));

        System.out.println(">>> SMART LMS SEED DATA INITIALIZATION COMPLETED SUCCESSFULLY!");
    }
}
