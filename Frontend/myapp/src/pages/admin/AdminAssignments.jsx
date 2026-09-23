import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';

export const AdminAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => {
        const cList = res.data?.data || [];
        setCourses(cList);
        if (cList.length > 0) {
          setSelectedCourseId(cList[0].id.toString());
          loadAssignments(cList[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const loadAssignments = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/assignments/course/${courseId}`);
      setAssignments(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    setSelectedCourseId(cid);
    loadAssignments(cid);
  };

  const columns = [
    {
      header: 'Assignment Title',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{row.title}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.courseCode} - {row.courseTitle}</div>
        </div>
      )
    },
    {
      header: 'Due Date',
      render: (row) => (
        <span>{row.dueDate ? new Date(row.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date'}</span>
      )
    },
    {
      header: 'Marks Policy',
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{row.maxMarks} Marks (Pass: {row.passingMarks || 40})</span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.submissionCount > 0 ? 'success' : 'default'}>
          {row.submissionCount || 0} Submissions
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>University Assignments Overview</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Academic assignments and problem sets across all department curriculum
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
          <Loader text="Loading course assignments..." />
        ) : assignments.length === 0 ? (
          <EmptyState
            title="No assignments found"
            description="Faculty has not published any assignments for this course yet."
            icon="fileText"
          />
        ) : (
          <Table columns={columns} data={assignments} />
        )}
      </Card>
    </div>
  );
};
export default AdminAssignments;
