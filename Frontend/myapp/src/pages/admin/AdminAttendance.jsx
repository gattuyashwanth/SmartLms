import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const AdminAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => {
        const cList = res.data?.data || [];
        setCourses(cList);
        if (cList.length > 0) {
          setSelectedCourseId(cList[0].id.toString());
          loadCourseAttendance(cList[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const loadCourseAttendance = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/summary/course/${courseId}`);
      setSummary(res.data?.data || null);
    } catch (err) {
      console.error(err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    setSelectedCourseId(cid);
    loadCourseAttendance(cid);
  };

  const logColumns = [
    {
      header: 'Session Date',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>
          {row.date ? new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
        </span>
      )
    },
    {
      header: 'Course',
      render: (row) => <span>{row.courseTitle || 'Core Course'}</span>
    },
    {
      header: 'Attendance Status',
      render: (row) => (
        <Badge variant={row.status === 'PRESENT' ? 'success' : row.status === 'LATE' ? 'warning' : 'danger'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Remarks',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          {row.remarks || 'Regular class attendance'}
        </span>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Campus Attendance Monitor</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Monitor university attendance records, compliance ratios, and daily faculty attendance logs
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Course:</span>
          <select
            value={selectedCourseId}
            onChange={handleCourseChange}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: '#FFFFFF',
              color: 'var(--text)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          background: 'var(--surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
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
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Total Classes Held</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>
              {summary?.totalClasses || 0}
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="checkCircle" size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Average Attendance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A' }}>
              {summary ? `${summary.overallPercentage.toFixed(1)}%` : '0%'}
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: '#FEF2F2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="alertCircle" size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Total Absences</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#DC2626' }}>
              {summary?.absentCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Logs */}
      <Card title="Recorded Attendance Sessions" subtitle="Recent institutional attendance marking logs">
        {loading ? (
          <Loader text="Loading session records..." />
        ) : !summary || !summary.recentLogs || summary.recentLogs.length === 0 ? (
          <EmptyState
            title="No attendance records found"
            description="Faculty has not yet submitted attendance rosters for this course."
            icon="calendar"
          />
        ) : (
          <Table columns={logColumns} data={summary.recentLogs} />
        )}
      </Card>
    </div>
  );
};
export default AdminAttendance;
