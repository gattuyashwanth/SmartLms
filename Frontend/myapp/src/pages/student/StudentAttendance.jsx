import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Table } from '../../components/ui/Table';
import { Loader } from '../../components/ui/Loader';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const StudentAttendance = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/my-summary')
      .then((res) => {
        if (res.data && res.data.data) {
          setSummary(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader text="Loading your attendance records..." size="lg" />;
  }

  const columns = [
    { key: 'date', header: 'Date', render: (r) => <strong>{r.date}</strong> },
    { key: 'courseTitle', header: 'Course', render: (r) => r.courseTitle },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge variant={
          r.status === 'PRESENT' ? 'success' :
          r.status === 'LATE' ? 'warning' : 'danger'
        }>
          {r.status}
        </Badge>
      ),
    },
    { key: 'remarks', header: 'Remarks', render: (r) => r.remarks || '—' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>My Attendance Record</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Official institutional attendance records and course-by-course analytics (Minimum 75% required for exam eligibility)
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
      }}>
        <StatCard
          title="Overall Attendance"
          value={`${summary?.overallPercentage || 94}%`}
          description={summary?.overallPercentage >= 75 ? "Satisfies 75% criterion" : "Warning: Below 75% requirement"}
          trend={summary?.overallPercentage >= 75 ? "Eligible for Exams" : "Attendance Shortage"}
          trendPositive={summary?.overallPercentage >= 75}
          icon="checkCircle"
        />
        <StatCard
          title="Total Conducted Classes"
          value={summary?.totalClasses || 0}
          description="Academic semester sessions"
          icon="clock"
        />
        <StatCard
          title="Sessions Attended"
          value={summary?.presentCount || 0}
          description="Marked Present"
          icon="check"
        />
        <StatCard
          title="Late / Absent"
          value={`${summary?.lateCount || 0} Late / ${summary?.absentCount || 0} Absent`}
          description="Recorded absences"
          icon="alertCircle"
        />
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <Card title="Subject & Course-Wise Attendance" subtitle="Detailed attendance percentage per enrolled course">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {summary?.courseBreakdown && summary.courseBreakdown.map((cb) => (
            <div
              key={cb.courseId}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--surface-alt)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{cb.courseCode}</span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: cb.percentage >= 75 ? 'var(--success)' : 'var(--danger)',
                }}>
                  {cb.percentage}%
                </span>
              </div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>
                {cb.courseTitle}
              </h4>
              <div style={{ marginBottom: '0.5rem' }}>
                <ProgressBar
                  progress={cb.percentage}
                  color={cb.percentage >= 75 ? 'var(--primary)' : 'var(--danger)'}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {cb.attendedClasses} attended out of {cb.totalClasses} classes
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Attendance Activity Logs */}
      <Card title="Recent Attendance Logs" subtitle="Chronological history of recorded sessions">
        <Table
          columns={columns}
          data={summary?.recentLogs || []}
          emptyMessage="No attendance records recorded yet."
        />
      </Card>
    </div>
  );
};

export default StudentAttendance;
