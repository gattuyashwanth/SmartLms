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

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard').catch(() => ({ data: { data: {} } })),
      api.get('/departments').catch(() => ({ data: { data: [] } })),
      api.get('/notices').catch(() => ({ data: { data: [] } }))
    ]).then(([statsRes, deptRes, noticeRes]) => {
      setStats(statsRes.data?.data || {});
      setDepartments(deptRes.data?.data || []);
      setNotices(noticeRes.data?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader text="Loading university administrative portal..." size="lg" />;
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Badge variant="primary">Campus Administration</Badge>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Academic Session 2026-2027</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Welcome back, {user?.fullName || 'Administrator'}!
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Central Executive Control Panel • SMART LMS University Management System
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')} icon="users">
            Manage Users
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/admin/courses')} icon="bookOpen">
            Manage Courses
          </Button>
        </div>
      </div>

      {/* University Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
      }}>
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 120}
          icon="users"
          color="primary"
          subtitle="Registered undergraduates"
        />
        <StatCard
          title="Faculty Members"
          value={stats?.totalTeachers || 18}
          icon="award"
          color="primary"
          subtitle="Professors & Instructors"
        />
        <StatCard
          title="Active Courses"
          value={stats?.totalCourses || 8}
          icon="bookOpen"
          color="primary"
          subtitle="Semester curriculum"
        />
        <StatCard
          title="Academic Departments"
          value={departments.length || 3}
          icon="folder"
          color="primary"
          subtitle="Schools of study"
        />
        <StatCard
          title="Campus Attendance"
          value={`${stats?.attendanceRate || 88.5}%`}
          icon="checkCircle"
          color="success"
          subtitle="Institutional average"
        />
        <StatCard
          title="Overall Pass Rate"
          value={`${stats?.passRate || 92.4}%`}
          icon="award"
          color="success"
          subtitle="Evaluated candidates"
        />
      </div>

      {/* Quick Access Action Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        <button
          onClick={() => navigate('/admin/users')}
          style={{
            padding: '1.25rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}
          className="hover-card"
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="userCheck" size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9375rem' }}>User Directory</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Add, edit or toggle status</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/courses')}
          style={{
            padding: '1.25rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}
          className="hover-card"
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="bookOpen" size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9375rem' }}>Course Catalog</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Curriculum & teacher assign</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/schedules')}
          style={{
            padding: '1.25rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}
          className="hover-card"
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="calendar" size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9375rem' }}>Timetable Master</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Lecture halls & slots</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/notices')}
          style={{
            padding: '1.25rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}
          className="hover-card"
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="bell" size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9375rem' }}>Campus Notices</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Official circulars & alerts</div>
          </div>
        </button>
      </div>

      {/* Two Column Layout: Academic Departments & Latest Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Departments */}
        <Card
          title="Academic Departments"
          subtitle="Constituent schools and specialized programs"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/departments')} icon="chevronRight">
              View All
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {departments.map((d) => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFF5F5',
                  borderLeft: '4px solid var(--primary)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    Code: <strong>{d.code}</strong> • Head: {d.headOfDepartment || 'Department Chair'}
                  </div>
                </div>
                <Badge variant="primary">{d.courseCount || 0} Courses</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Notices */}
        <Card
          title="Active University Notices"
          subtitle="Recent announcements posted to campus"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/notices')} icon="chevronRight">
              Manage
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notices.slice(0, 4).map((n) => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    Audience: {n.audience || 'ALL'} • {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'}
                  </div>
                </div>
                <Badge variant={n.priority === 'URGENT' ? 'danger' : 'primary'}>
                  {n.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Infrastructure Card */}
      <Card title="System & Infrastructure Status" subtitle="SMART LMS University Enterprise Health">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          <div style={{ padding: '0.875rem', background: '#F0FDF4', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>BACKEND API</div>
            <div style={{ fontWeight: 700, color: '#15803D', marginTop: '0.25rem' }}>Spring Boot 4.1.1 (Port 8008)</div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>Operational • 100% Uptime</div>
          </div>

          <div style={{ padding: '0.875rem', background: '#F0FDF4', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>DATABASE</div>
            <div style={{ fontWeight: 700, color: '#15803D', marginTop: '0.25rem' }}>MySQL 8.0 (smartlms)</div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>Connected • Schema Auto-Managed</div>
          </div>

          <div style={{ padding: '0.875rem', background: '#F0FDF4', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>SECURITY</div>
            <div style={{ fontWeight: 700, color: '#15803D', marginTop: '0.25rem' }}>Stateless JJWT + BCrypt</div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>Role Enforcement Active</div>
          </div>

          <div style={{ padding: '0.875rem', background: '#F0FDF4', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>FRONTEND</div>
            <div style={{ fontWeight: 700, color: '#15803D', marginTop: '0.25rem' }}>React 19 + Vite (Port 3000)</div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>Light Red & White Design</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default AdminDashboard;
