import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const TeacherGrades = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);

  // Edit Grade Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assignmentMarks, setAssignmentMarks] = useState(0);
  const [quizMarks, setQuizMarks] = useState(0);
  const [examMarks, setExamMarks] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/teacher');
      const cList = res.data?.data || [];
      setCourses(cList);
      if (cList.length > 0) {
        setSelectedCourseId(cList[0].id.toString());
        loadCourseGrades(cList[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch courses');
      setLoading(false);
    }
  };

  const loadCourseGrades = async (courseId) => {
    setLoading(true);
    try {
      const [studentsRes, gradesRes] = await Promise.all([
        api.get(`/enrollments/course/${courseId}`),
        api.get(`/grades/course/${courseId}`)
      ]);

      const stuList = studentsRes.data?.data || [];
      setStudents(stuList);

      const gradeMap = {};
      (gradesRes.data?.data || []).forEach(g => {
        gradeMap[g.studentId] = g;
      });
      setGrades(gradeMap);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load grades for course');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    setSelectedCourseId(cid);
    loadCourseGrades(cid);
  };

  const handleOpenGradeModal = (student) => {
    setSelectedStudent(student);
    const existing = grades[student.id];
    if (existing) {
      setAssignmentMarks(existing.assignmentMarks || 0);
      setQuizMarks(existing.quizMarks || 0);
      setExamMarks(existing.examMarks || 0);
      setRemarks(existing.remarks || '');
    } else {
      setAssignmentMarks(0);
      setQuizMarks(0);
      setExamMarks(0);
      setRemarks('');
    }
  };

  const totalCalculated = (parseFloat(assignmentMarks) || 0) + (parseFloat(quizMarks) || 0) + (parseFloat(examMarks) || 0);

  const getEstimatedGrade = (total) => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B+';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 40) return 'P';
    return 'F';
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    setSavingGrade(true);
    try {
      const payload = {
        studentId: selectedStudent.id,
        courseId: parseInt(selectedCourseId),
        assignmentMarks: parseFloat(assignmentMarks) || 0,
        quizMarks: parseFloat(quizMarks) || 0,
        examMarks: parseFloat(examMarks) || 0,
        remarks
      };

      const res = await api.post('/grades', payload);
      showToast('success', 'Grade record updated successfully!');
      if (res.data?.data) {
        setGrades(prev => ({
          ...prev,
          [selectedStudent.id]: res.data.data
        }));
      }
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      showToast('error', err.response?.data?.message || 'Failed to save grade');
    } finally {
      setSavingGrade(false);
    }
  };

  const columns = [
    {
      header: 'Student',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{row.fullName}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.rollNumber || row.email}</div>
        </div>
      )
    },
    {
      header: 'Assignments (25)',
      render: (row) => {
        const g = grades[row.id];
        return <span style={{ fontWeight: 500 }}>{g ? g.assignmentMarks : '-'}</span>;
      }
    },
    {
      header: 'Quizzes (25)',
      render: (row) => {
        const g = grades[row.id];
        return <span style={{ fontWeight: 500 }}>{g ? g.quizMarks : '-'}</span>;
      }
    },
    {
      header: 'Exam (50)',
      render: (row) => {
        const g = grades[row.id];
        return <span style={{ fontWeight: 500 }}>{g ? g.examMarks : '-'}</span>;
      }
    },
    {
      header: 'Total (100)',
      render: (row) => {
        const g = grades[row.id];
        return (
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>
            {g ? `${g.totalMarks || (g.assignmentMarks + g.quizMarks + g.examMarks)}` : '-'}
          </span>
        );
      }
    },
    {
      header: 'Grade',
      render: (row) => {
        const g = grades[row.id];
        if (!g || !g.letterGrade) return <Badge variant="default">Ungraded</Badge>;
        const isPass = g.letterGrade !== 'F';
        return (
          <Badge variant={isPass ? 'success' : 'danger'}>
            {g.letterGrade}
          </Badge>
        );
      }
    },
    {
      header: 'Action',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenGradeModal(row)}
          icon="edit"
        >
          {grades[row.id] ? 'Edit Marks' : 'Enter Marks'}
        </Button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Academic Gradebook</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Consolidated marks entry for continuous assessments, quizzes, and university final exams
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Course:</span>
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

      {/* Grade Table Card */}
      <Card>
        {loading ? (
          <Loader text="Loading grade records..." />
        ) : students.length === 0 ? (
          <EmptyState
            title="No enrolled students in this course"
            description="Students must be enrolled in this course to enter grades."
            icon="award"
          />
        ) : (
          <Table columns={columns} data={students} />
        )}
      </Card>

      {/* Edit Marks Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={`Enter Grade: ${selectedStudent?.fullName || ''}`}
        maxWidth="500px"
      >
        <form onSubmit={handleSaveGrade} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            background: '#FFF5F5',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Calculated Total
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {totalCalculated.toFixed(1)} / 100
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Letter Grade
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: totalCalculated >= 40 ? '#16A34A' : '#DC2626' }}>
                {getEstimatedGrade(totalCalculated)}
              </div>
            </div>
          </div>

          <Input
            label="Continuous Assignments (Max: 25) *"
            type="number"
            step="0.5"
            min="0"
            max="25"
            value={assignmentMarks}
            onChange={(e) => setAssignmentMarks(e.target.value)}
            required
          />

          <Input
            label="Quizzes & Tests (Max: 25) *"
            type="number"
            step="0.5"
            min="0"
            max="25"
            value={quizMarks}
            onChange={(e) => setQuizMarks(e.target.value)}
            required
          />

          <Input
            label="Semester End Exam (Max: 50) *"
            type="number"
            step="0.5"
            min="0"
            max="50"
            value={examMarks}
            onChange={(e) => setExamMarks(e.target.value)}
            required
          />

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Remarks / Faculty Feedback
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Excellent conceptual grasp, active participation."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                color: 'var(--text)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setSelectedStudent(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={savingGrade} icon="check">
              Save Academic Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default TeacherGrades;
