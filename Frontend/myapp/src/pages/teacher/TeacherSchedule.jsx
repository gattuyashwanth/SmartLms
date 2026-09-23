import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const TeacherSchedule = () => {
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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader text="Loading your teaching timetable..." size="lg" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Faculty Teaching Timetable</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Weekly lecture and laboratory schedule across your assigned academic courses
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {days.map((day) => {
          const daySessions = schedules.filter((s) => s.dayOfWeek && s.dayOfWeek.toLowerCase() === day.toLowerCase());
          return (
            <Card
              key={day}
              title={day}
              subtitle={daySessions.length > 0 ? `${daySessions.length} teaching session${daySessions.length > 1 ? 's' : ''}` : 'No teaching sessions'}
            >
              {daySessions.length === 0 ? (
                <div style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  No classes scheduled.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {daySessions.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.875rem',
                        backgroundColor: '#FFF5F5',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: '4px solid var(--primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.375rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
                          {item.courseCode ? `${item.courseCode} - ${item.courseTitle}` : item.courseTitle}
                        </span>
                        <Badge variant="primary">
                          {item.type || 'Lecture'}
                        </Badge>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <Icon name="clock" size={14} />
                        <span>{item.startTime} - {item.endTime}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <Icon name="mapPin" size={14} />
                        <span>Room: {item.roomNumber || 'LH-101'}</span>
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
export default TeacherSchedule;
