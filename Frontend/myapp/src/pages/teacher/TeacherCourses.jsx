import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/teacher/my-courses')
      .then((res) => {
        if (res.data && res.data.data) {
          setCourses(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader text="Loading faculty courses..." size="lg" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>My Teaching Courses</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage your assigned syllabus curriculums and classroom materials</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon="book"
          title="No courses assigned"
          description="You are not currently assigned as lead instructor for any active courses."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {courses.map((course) => (
            <Card key={course.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{course.code}</span>
                  <Badge variant="primary">{course.categoryName || 'Core'}</Badge>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {course.description ? course.description.slice(0, 110) + '...' : 'Course syllabus overview.'}
                </p>

                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-around',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-light)',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Students</span>
                    <strong>{course.enrolledCount || 0}</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Lessons</span>
                    <strong>{course.lessonsCount || 0}</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Status</span>
                    <strong style={{ color: 'var(--success)' }}>Active</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/teacher/attendance?courseId=${course.id}`)}
                >
                  Attendance
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                >
                  Edit Syllabus →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
