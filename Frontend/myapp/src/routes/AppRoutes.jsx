import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { AppLayout } from '../layouts/AppLayout';

// Public / Auth Pages
import LandingPage from '../pages/common/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentCourses from '../pages/student/StudentCourses';
import StudentCourseDetail from '../pages/student/StudentCourseDetail';
import StudentAssignments from '../pages/student/StudentAssignments';
import StudentQuizzes from '../pages/student/StudentQuizzes';
import QuizTake from '../pages/student/QuizTake';
import StudentAttendance from '../pages/student/StudentAttendance';
import StudentGrades from '../pages/student/StudentGrades';
import StudentSchedule from '../pages/student/StudentSchedule';
import StudentCalendar from '../pages/student/StudentCalendar';
import StudentNotices from '../pages/student/StudentNotices';
import StudentNotifications from '../pages/student/StudentNotifications';
import StudentProfile from '../pages/student/StudentProfile';
import StudentSettings from '../pages/student/StudentSettings';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherCourses from '../pages/teacher/TeacherCourses';
import TeacherCourseManage from '../pages/teacher/TeacherCourseManage';
import TeacherStudents from '../pages/teacher/TeacherStudents';
import TeacherAttendance from '../pages/teacher/TeacherAttendance';
import TeacherAssignments from '../pages/teacher/TeacherAssignments';
import TeacherQuizzes from '../pages/teacher/TeacherQuizzes';
import TeacherGrades from '../pages/teacher/TeacherGrades';
import TeacherSchedule from '../pages/teacher/TeacherSchedule';
import TeacherNotices from '../pages/teacher/TeacherNotices';
import TeacherNotifications from '../pages/teacher/TeacherNotifications';
import TeacherProfile from '../pages/teacher/TeacherProfile';
import TeacherSettings from '../pages/teacher/TeacherSettings';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminStudents from '../pages/admin/AdminStudents';
import AdminTeachers from '../pages/admin/AdminTeachers';
import AdminCourses from '../pages/admin/AdminCourses';
import AdminDepartments from '../pages/admin/AdminDepartments';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminEnrollments from '../pages/admin/AdminEnrollments';
import AdminAttendance from '../pages/admin/AdminAttendance';
import AdminAssignments from '../pages/admin/AdminAssignments';
import AdminQuizzes from '../pages/admin/AdminQuizzes';
import AdminGrades from '../pages/admin/AdminGrades';
import AdminNotices from '../pages/admin/AdminNotices';
import AdminSchedules from '../pages/admin/AdminSchedules';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminNotifications from '../pages/admin/AdminNotifications';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminSettings from '../pages/admin/AdminSettings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <RoleRoute allowedRoles={['ROLE_STUDENT']}>
            <AppLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="courses/:id" element={<StudentCourseDetail />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="quizzes" element={<StudentQuizzes />} />
        <Route path="quizzes/:id/take" element={<QuizTake />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="calendar" element={<StudentCalendar />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Teacher Protected Routes */}
      <Route
        path="/teacher"
        element={
          <RoleRoute allowedRoles={['ROLE_TEACHER']}>
            <AppLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="courses" element={<TeacherCourses />} />
        <Route path="courses/:id" element={<TeacherCourseManage />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="quizzes" element={<TeacherQuizzes />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="schedule" element={<TeacherSchedule />} />
        <Route path="notices" element={<TeacherNotices />} />
        <Route path="notifications" element={<TeacherNotifications />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={['ROLE_ADMIN']}>
            <AppLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="enrollments" element={<AdminEnrollments />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="assignments" element={<AdminAssignments />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="grades" element={<AdminGrades />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="schedules" element={<AdminSchedules />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
