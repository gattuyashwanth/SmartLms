import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const StudentSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    api.get('/schedules')
      .then((res) => {
        if (res.data && res.data.data) {
          setSchedules(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader text="Loading your class timetable..." size="lg" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Academic Timetable</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Weekly lecture, laboratory, and tutorial schedules</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {days.map((day) => {
          const dayClasses = schedules.filter((s) => s.dayOfWeek.toLowerCase() === day.toLowerCase());
          return (
            <Card
              key={day}
              title={day}
              subtitle={dayClasses.length > 0 ? `${dayClasses.length} sessions scheduled` : 'No sessions today'}
            >
              {dayClasses.length === 0 ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No classes scheduled.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {dayClasses.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.875rem',
                        backgroundColor: 'var(--surface-alt)',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: '3px solid var(--primary)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                          {item.startTime} - {item.endTime}
                        </span>
                        <Badge variant="primary">{item.type}</Badge>
                      </div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)' }}>
                        {item.courseTitle}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Room: <strong>{item.room}</strong> • {item.teacherName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentSchedule;
