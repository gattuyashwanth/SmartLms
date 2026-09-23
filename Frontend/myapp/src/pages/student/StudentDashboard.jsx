import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const StudentDashboard = () => {
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return <Loader text="Loading your student dashboard..." size="lg" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Welcome Banner */}
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
            {getGreeting()}, {user?.fullName || 'Student'}!
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Roll No: <strong>{user?.rollNumber || '24CSE001'}</strong> • Department of {user?.departmentName || 'Computer Science & Engineering'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/student/schedule')} icon="clock">
            View Schedule
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/student/courses')} icon="book">
            My Courses
          </Button>
        </div>
      </div>

      {/* 2. Key Academic Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
      }}>
        <StatCard
          title="Enrolled Courses"
          value={stats?.totalEnrollments || 4}
          description="Active university curriculum"
          icon="book"
          onClick={() => navigate('/student/courses')}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.averageAttendance || 94}%`}
          description={stats?.averageAttendance >= 75 ? "Above 75% requirement" : "Attendance below required 75%"}
          trend={stats?.averageAttendance >= 75 ? "+2% this month" : "-3% this month"}
          trendPositive={stats?.averageAttendance >= 75}
          icon="checkCircle"
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard
          title="Pending Assignments"
          value={stats?.pendingAssignments ?? 2}
          description="Action required before deadline"
          icon="fileText"
          onClick={() => navigate('/student/assignments')}
        />
        <StatCard
          title="Average Grade"
          value={stats?.averageGrade || 'A'}
          description="Current semester GPA standing"
          trend="Top 10%"
          trendPositive={true}
          icon="award"
          onClick={() => navigate('/student/grades')}
        />
      </div>

      {/* 3. Main Grid: Courses & Side Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
      }} className="student-dashboard-grid">
        
        {/* Left Column: Courses & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section: My Courses & Progress */}
          <Card
            title="My Enrolled Courses & Progress"
            subtitle="Continue your syllabus learning"
            action={<Link to="/student/courses" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>View All →</Link>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats?.courses && stats.courses.length > 0 ? (
                stats.courses.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--surface-alt)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {c.code}
                        </span>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)' }}>
                          {c.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {c.teacherName}
                        </span>
                      </div>
                      <Button variant="primary" size="sm" onClick={() => navigate(`/student/courses/${c.id}`)}>
                        Open
                      </Button>
                    </div>
                    <div>
                      <ProgressBar progress={c.progress || 35} showLabel={true} />
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No courses enrolled yet.</p>
              )}
            </div>
          </Card>

          {/* Section: Today's Class Schedule */}
          <Card
            title="Today's Timetable Schedule"
            subtitle="Classes and lab sessions for today"
            action={<Link to="/student/schedule" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Full Timetable →</Link>}
          >
            {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.todaySchedule.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        padding: '0.5rem',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-dark)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}>
                        {s.startTime} - {s.endTime}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
                          {s.courseTitle}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Room: {s.room} • {s.teacherName}
                        </div>
                      </div>
                    </div>
                    <Badge variant="primary">{s.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No classes scheduled for today.</p>
            )}
          </Card>
        </div>

        {/* Right Column: Notices & Deadlines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section: Institutional Notices */}
          <Card
            title="University Notices"
            subtitle="Important administrative announcements"
            action={<Link to="/student/notices" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>All Notices →</Link>}
          >
            {stats?.recentNotices && stats.recentNotices.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.recentNotices.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: 'var(--surface-alt)',
                      borderLeft: `3px solid ${n.priority === 'URGENT' ? 'var(--danger)' : n.priority === 'IMPORTANT' ? 'var(--warning)' : 'var(--primary)'}`,
                      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>{n.title}</span>
                      <Badge variant={n.priority === 'URGENT' ? 'danger' : n.priority === 'IMPORTANT' ? 'warning' : 'primary'}>
                        {n.priority}
                      </Badge>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {n.content.slice(0, 90)}...
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No active notices.</p>
            )}
          </Card>

          {/* Quick Nav Shortcuts */}
          <Card title="Quick Academic Access">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Button variant="secondary" size="sm" onClick={() => navigate('/student/assignments')} icon="fileText">
                Assignments
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/student/quizzes')} icon="helpCircle">
                Quizzes
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/student/attendance')} icon="checkCircle">
                Attendance
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/student/grades')} icon="award">
                Transcript
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          .student-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
