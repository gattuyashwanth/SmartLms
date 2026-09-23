import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const StudentCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/courses/student/my-courses')
      .then((res) => {
        if (res.data && res.data.data) {
          setCourses(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.categoryName && c.categoryName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>My Enrolled Courses</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track your progress and access syllabus learning materials</p>
        </div>
        <div style={{ width: '280px' }}>
          <Input
            placeholder="Search courses or codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
      </div>

      {loading ? (
        <Loader text="Loading your courses..." size="lg" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="book"
          title="No courses found"
          description="You are not enrolled in any matching courses."
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {filtered.map((course) => (
            <Card
              key={course.id}
              style={{
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/student/courses/${course.id}`)}
            >
              {/* Thumbnail Header */}
              <div style={{ height: '140px', backgroundColor: 'var(--primary-light)', position: 'relative' }}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="book" size={36} color="var(--primary)" />
                  </div>
                )}
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(198, 40, 40, 0.9)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  {course.code}
                </span>
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: 'var(--text)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  {course.categoryName || 'Core'}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {course.description ? course.description.slice(0, 90) + '...' : 'Comprehensive university syllabus course.'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <span>Faculty: <strong>{course.teacherName}</strong></span>
                    <span>{course.lessonsCount} lessons</span>
                  </div>

                  <ProgressBar progress={course.progress || 0} showLabel={true} />

                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/student/courses/${course.id}`); }}>
                      Continue Learning →
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
