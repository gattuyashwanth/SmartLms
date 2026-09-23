import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const StudentGrades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.get(`/grades/student/${user.id}`)
        .then((res) => {
          if (res.data && res.data.data) {
            setGrades(res.data.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const columns = [
    { key: 'courseCode', header: 'Course Code', render: (r) => <strong>{r.courseCode}</strong> },
    { key: 'courseTitle', header: 'Course Title', render: (r) => r.courseTitle },
    { key: 'assignmentMarks', header: 'Assignments (40)', render: (r) => `${r.assignmentMarks} / 40` },
    { key: 'quizMarks', header: 'Quizzes (20)', render: (r) => `${r.quizMarks} / 20` },
    { key: 'examMarks', header: 'Mid/End Exam (40)', render: (r) => `${r.examMarks} / 40` },
    { key: 'totalMarks', header: 'Total (100)', render: (r) => <strong>{r.totalMarks}</strong> },
    {
      key: 'letterGrade',
      header: 'Letter Grade',
      render: (r) => (
        <Badge variant={
          r.letterGrade.startsWith('A') ? 'success' :
          r.letterGrade.startsWith('B') ? 'primary' :
          r.letterGrade === 'C' ? 'warning' : 'danger'
        }>
          {r.letterGrade}
        </Badge>
      ),
    },
    { key: 'remarks', header: 'Faculty Remarks', render: (r) => r.remarks || '—' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Academic Transcript & Grades</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Official cumulative evaluation report by course instructors</p>
      </div>

      {loading ? (
        <Loader text="Loading your grades transcript..." size="lg" />
      ) : (
        <Card title="Semester Grade Summary">
          <Table
            columns={columns}
            data={grades}
            emptyMessage="No official grades have been posted yet for this semester."
          />
        </Card>
      )}
    </div>
  );
};

export default StudentGrades;
