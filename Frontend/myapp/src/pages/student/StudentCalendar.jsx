import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const StudentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState('September 2026');

  const events = [
    { date: '14 Sep', day: 'Mon', title: 'CS301: Spring Boot Lab 1 Submission Deadline', type: 'DEADLINE', badge: 'danger' },
    { date: '16 Sep', day: 'Wed', title: 'CS401: Machine Learning Practical Session', type: 'LAB', badge: 'primary' },
    { date: '20 Sep', day: 'Sun', title: 'System Maintenance Window (02:00 - 04:00 AM)', type: 'MAINTENANCE', badge: 'warning' },
    { date: '25 Sep', day: 'Fri', title: 'CS202: Database Management Mid-Sem Quiz', type: 'EXAM', badge: 'primary' },
    { date: '30 Sep', day: 'Wed', title: 'University Technical Symposium Submissions', type: 'EVENT', badge: 'success' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Academic Calendar</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Deadlines, scheduled evaluations, and institutional milestones</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm">← Previous</Button>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', padding: '0 0.5rem' }}>{currentMonth}</span>
          <Button variant="secondary" size="sm">Next →</Button>
        </div>
      </div>

      <Card title="Upcoming Key Dates & Deadlines">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map((ev, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-alt)',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  minWidth: '70px',
                }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>{ev.day}</span>
                  <strong style={{ fontSize: '0.9375rem' }}>{ev.date}</strong>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)' }}>
                    {ev.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Academic Session 2026</span>
                </div>
              </div>
              <Badge variant={ev.badge}>{ev.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StudentCalendar;
