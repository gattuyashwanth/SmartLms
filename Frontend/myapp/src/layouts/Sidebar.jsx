import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/student/courses', label: 'My Courses', icon: 'book' },
    { to: '/student/assignments', label: 'Assignments', icon: 'fileText' },
    { to: '/student/quizzes', label: 'Quizzes', icon: 'helpCircle' },
    { to: '/student/attendance', label: 'Attendance', icon: 'checkCircle' },
    { to: '/student/grades', label: 'Grades', icon: 'award' },
    { to: '/student/schedule', label: 'Schedule', icon: 'clock' },
    { to: '/student/calendar', label: 'Calendar', icon: 'calendar' },
    { to: '/student/notices', label: 'Notices', icon: 'bell' },
    { to: '/student/notifications', label: 'Notifications', icon: 'activity' },
    { to: '/student/profile', label: 'Profile', icon: 'user' },
    { to: '/student/settings', label: 'Settings', icon: 'settings' },
  ];

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/teacher/courses', label: 'My Courses', icon: 'book' },
    { to: '/teacher/students', label: 'Students', icon: 'users' },
    { to: '/teacher/attendance', label: 'Attendance', icon: 'checkCircle' },
    { to: '/teacher/assignments', label: 'Assignments', icon: 'fileText' },
    { to: '/teacher/quizzes', label: 'Quizzes', icon: 'helpCircle' },
    { to: '/teacher/grades', label: 'Grades', icon: 'award' },
    { to: '/teacher/schedule', label: 'Schedule', icon: 'clock' },
    { to: '/teacher/notices', label: 'Notices', icon: 'bell' },
    { to: '/teacher/notifications', label: 'Notifications', icon: 'activity' },
    { to: '/teacher/profile', label: 'Profile', icon: 'user' },
    { to: '/teacher/settings', label: 'Settings', icon: 'settings' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin/users', label: 'Users', icon: 'users' },
    { to: '/admin/students', label: 'Students', icon: 'user' },
    { to: '/admin/teachers', label: 'Teachers', icon: 'graduationCap' },
    { to: '/admin/courses', label: 'Courses', icon: 'book' },
    { to: '/admin/departments', label: 'Departments', icon: 'shield' },
    { to: '/admin/categories', label: 'Categories', icon: 'fileText' },
    { to: '/admin/enrollments', label: 'Enrollments', icon: 'activity' },
    { to: '/admin/attendance', label: 'Attendance', icon: 'checkCircle' },
    { to: '/admin/assignments', label: 'Assignments', icon: 'fileText' },
    { to: '/admin/quizzes', label: 'Quizzes', icon: 'helpCircle' },
    { to: '/admin/grades', label: 'Grades', icon: 'award' },
    { to: '/admin/notices', label: 'Notices', icon: 'bell' },
    { to: '/admin/schedules', label: 'Schedules', icon: 'clock' },
    { to: '/admin/analytics', label: 'Analytics', icon: 'barChart' },
    { to: '/admin/notifications', label: 'Notifications', icon: 'activity' },
    { to: '/admin/profile', label: 'Profile', icon: 'user' },
    { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  ];

  const normRole = (role ? role.toString().replace(/^ROLE_/, '').toUpperCase() : '');
  const links = normRole === 'ADMIN' ? adminLinks : normRole === 'TEACHER' ? teacherLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 998,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          height: '100vh',
          backgroundColor: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          transform: isOpen || window.innerWidth > 900 ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-normal)',
          boxShadow: isOpen ? 'var(--shadow-lg)' : 'none',
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}>
              <Icon name="graduationCap" size={22} color="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-dark)', letterSpacing: '0.04em' }}>
                SMART LMS
              </span>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {role === 'ROLE_ADMIN' ? 'Admin Portal' : role === 'ROLE_TEACHER' ? 'Faculty Portal' : 'Student Portal'}
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: window.innerWidth > 900 ? 'none' : 'block',
              }}
            >
              <Icon name="close" size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'all var(--transition-fast)',
                })}
              >
                <Icon name={link.icon} size={18} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer with Logout */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--danger)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
          >
            <Icon name="logout" size={18} color="var(--danger)" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
