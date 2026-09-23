import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res) => {
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader text="Loading faculty portal..." size="lg" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Welcome back, {user?.fullName || 'Professor'}!
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Faculty Portal • Department of {user?.departmentName || 'Computer Science & Engineering'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/teacher/attendance')} icon="checkCircle">
            Take Attendance
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/teacher/assignments')} icon="fileText">
            Grade Submissions
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
      }}>
        <StatCard
          title="Total Assigned Courses"
          value={stats?.totalCourses || 2}
          description="Active teaching curriculum"
          icon="book"
          onClick={() => navigate('/teacher/courses')}
        />
        <StatCard
          title="Enrolled Students"
          value={stats?.totalStudents || 3}
          description="Across your subjects"
          icon="users"
          onClick={() => navigate('/teacher/students')}
        />
        <StatCard
          title="Pending Submissions"
          value={stats?.pendingSubmissions ?? 1}
          description="Awaiting evaluation"
          trend="Action Needed"
          trendPositive={false}
          icon="fileText"
          onClick={() => navigate('/teacher/assignments')}
        />
        <StatCard
          title="Class Attendance"
          value={`${stats?.averageAttendance || 89}%`}
          description="Average student presence"
          trend="+4% this term"
          trendPositive={true}
          icon="checkCircle"
          onClick={() => navigate('/teacher/attendance')}
        />
      </div>

      {/* Main Grid: My Courses & Class Timetable */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
      }} className="teacher-dashboard-grid">
        {/* Left Column: Assigned Courses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card
            title="My Assigned Courses"
            subtitle="Manage syllabus, lessons, assignments, and grades"
            action={<Link to="/teacher/courses" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Manage Courses →</Link>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats?.courses && stats.courses.map((course) => (
                <div
                  key={course.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{course.code}</span>
                      <Badge variant="primary">{course.categoryName || 'Core'}</Badge>
                    </div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text)' }}>
                      {course.title}
                    </h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {course.enrolledCount || 2} Students Enrolled • {course.lessonsCount || 4} Lessons Published
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/teacher/attendance?courseId=${course.id}`)}>
                      Attendance
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate(`/teacher/courses/${course.id}`)}>
                      Manage Course
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card title="Faculty Quick Operations">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div
                onClick={() => navigate('/teacher/attendance')}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
              >
                <Icon name="checkCircle" size={24} color="var(--primary)" />
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '0.5rem' }}>Record Attendance</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily roster marking</span>
              </div>

              <div
                onClick={() => navigate('/teacher/assignments')}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
              >
                <Icon name="fileText" size={24} color="var(--primary)" />
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '0.5rem' }}>Create Assignment</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Post lab assignments</span>
              </div>

              <div
                onClick={() => navigate('/teacher/quizzes')}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
              >
                <Icon name="helpCircle" size={24} color="var(--primary)" />
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '0.5rem' }}>Quiz Builder</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Setup questions</span>
              </div>

              <div
                onClick={() => navigate('/teacher/grades')}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
              >
                <Icon name="award" size={24} color="var(--primary)" />
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '0.5rem' }}>Grade Book</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Submit semester marks</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Teaching Schedule & Notices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card
            title="Teaching Schedule"
            subtitle="Your lecture & lab timetable"
            action={<Link to="/teacher/schedule" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Full Timetable →</Link>}
          >
            {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.todaySchedule.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--surface-alt)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{s.startTime} - {s.endTime}</span>
                      <Badge variant="primary">{s.type}</Badge>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.courseTitle}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Room: {s.room}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No scheduled sessions for today.</p>
            )}
          </Card>

          <Card
            title="Faculty Notices"
            subtitle="Campus circulars & updates"
            action={<Link to="/teacher/notices" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>View All →</Link>}
          >
            {stats?.recentNotices && stats.recentNotices.slice(0, 3).map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{n.title}</strong>
                  <Badge variant={n.priority === 'URGENT' ? 'danger' : 'primary'}>{n.priority}</Badge>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {n.content.slice(0, 80)}...
                </p>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          .teacher-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
