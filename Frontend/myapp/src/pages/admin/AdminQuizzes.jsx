import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';

export const AdminQuizzes = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => {
        const cList = res.data?.data || [];
        setCourses(cList);
        if (cList.length > 0) {
          setSelectedCourseId(cList[0].id.toString());
          loadQuizzes(cList[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const loadQuizzes = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/quizzes/course/${courseId}`);
      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    setSelectedCourseId(cid);
    loadQuizzes(cid);
  };

  const columns = [
    {
      header: 'Assessment Title',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{row.title}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.courseCode} - {row.courseTitle}</div>
        </div>
      )
    },
    {
      header: 'Duration',
      render: (row) => <span>{row.durationMinutes || 30} mins</span>
    },
    {
      header: 'Total Marks',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.totalMarks} Marks</span>
    },
    {
      header: 'Questions',
      render: (row) => <Badge variant="default">{row.questionCount || 0} Questions</Badge>
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.published ? 'success' : 'warning'}>
          {row.published ? 'Published' : 'Draft'}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Online Quizzes & Assessments</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Interactive assessments and multiple-choice tests across courses
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

      <Card>
        {loading ? (
          <Loader text="Loading course quizzes..." />
        ) : quizzes.length === 0 ? (
          <EmptyState
            title="No quizzes found"
            description="Faculty has not created any quizzes for this course yet."
            icon="helpCircle"
          />
        ) : (
          <Table columns={columns} data={quizzes} />
        )}
      </Card>
    </div>
  );
};
export default AdminQuizzes;
