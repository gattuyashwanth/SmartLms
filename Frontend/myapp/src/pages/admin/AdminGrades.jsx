import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';

export const AdminGrades = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => {
        const cList = res.data?.data || [];
        setCourses(cList);
        if (cList.length > 0) {
          setSelectedCourseId(cList[0].id.toString());
          loadCourseGrades(cList[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const loadCourseGrades = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/grades/course/${courseId}`);
      setGrades(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    setSelectedCourseId(cid);
    loadCourseGrades(cid);
  };

  const columns = [
    {
      header: 'Student',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{row.studentName}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Roll: {row.rollNumber || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'Continuous (25)',
      render: (row) => <span>{row.assignmentMarks}</span>
    },
    {
      header: 'Quizzes (25)',
      render: (row) => <span>{row.quizMarks}</span>
    },
    {
      header: 'Semester Exam (50)',
      render: (row) => <span>{row.examMarks}</span>
    },
    {
      header: 'Total Score',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>
          {row.totalMarks || (row.assignmentMarks + row.quizMarks + row.examMarks)} / 100
        </span>
      )
    },
    {
      header: 'Final Letter Grade',
      render: (row) => (
        <Badge variant={row.letterGrade !== 'F' ? 'success' : 'danger'}>
          {row.letterGrade}
        </Badge>
      )
    },
    {
      header: 'Remarks',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          {row.remarks || 'Regular evaluation'}
        </span>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>University Grade Registry</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Consolidated academic results, student GPAs, and transcripts across courses
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
          <Loader text="Loading grades..." />
        ) : grades.length === 0 ? (
          <EmptyState
            title="No grades posted yet"
            description="Grades for this course have not been entered by faculty."
            icon="award"
          />
        ) : (
          <Table columns={columns} data={grades} />
        )}
      </Card>
    </div>
  );
};
export default AdminGrades;
