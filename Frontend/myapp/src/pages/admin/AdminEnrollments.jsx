import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminEnrollments = () => {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enroll Modal
  const [showModal, setShowModal] = useState(false);
  const [modalCourseId, setModalCourseId] = useState('');
  const [modalStudentId, setModalStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        api.get('/courses'),
        api.get('/users/students')
      ]);

      const cList = cRes.data?.data || [];
      const sList = sRes.data?.data || [];
      setCourses(cList);
      setStudents(sList);

      if (cList.length > 0) {
        setSelectedCourseId(cList[0].id.toString());
        setModalCourseId(cList[0].id.toString());
        loadEnrolled(cList[0].id);
      }
      if (sList.length > 0) {
        setModalStudentId(sList[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to load enrollment data');
    } finally {
      setLoading(false);
    }
  };

  const loadEnrolled = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/enrollments/course/${courseId}`);
      setEnrolledStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setEnrolledStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (e) => {
    const cid = e.target.value;
    setSelectedCourseId(cid);
    loadEnrolled(cid);
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!modalCourseId || !modalStudentId) {
      notify('warning', 'Please select both student and course');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/enrollments', {
        courseId: parseInt(modalCourseId),
        studentId: parseInt(modalStudentId)
      });
      notify('success', 'Student enrolled successfully!');
      setShowModal(false);
      if (modalCourseId === selectedCourseId) {
        loadEnrolled(selectedCourseId);
      }
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to enroll student');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Student',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            {row.fullName ? row.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{row.fullName}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Roll Number',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text)' }}>
          {row.rollNumber || 'CS2026-001'}
        </span>
      )
    },
    {
      header: 'Department',
      render: (row) => <span>{row.departmentName || 'Computer Science & Engineering'}</span>
    },
    {
      header: 'Enrollment Status',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'default'}>
          {row.active ? 'Active Enrolled' : 'Inactive'}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Course Enrollments</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Inspect course rosters and register students into academic courses
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={selectedCourseId}
            onChange={handleCourseSelect}
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
          <Button variant="primary" onClick={() => setShowModal(true)} icon="plus">
            Enroll Student
          </Button>
        </div>
      </div>

      <Card>
        {loading ? (
          <Loader text="Loading enrolled student roster..." />
        ) : enrolledStudents.length === 0 ? (
          <EmptyState
            title="No students currently enrolled"
            description="There are currently no students registered in this course."
            icon="users"
            action={
              <Button variant="primary" onClick={() => setShowModal(true)} icon="plus">
                Enroll Student
              </Button>
            }
          />
        ) : (
          <Table columns={columns} data={enrolledStudents} />
        )}
      </Card>

      {/* Enroll Student Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Enroll Student in Academic Course"
        maxWidth="500px"
      >
        <form onSubmit={handleEnrollStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Select Student *
            </label>
            <select
              value={modalStudentId}
              onChange={(e) => setModalStudentId(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: '#FFFFFF',
                color: 'var(--text)',
                fontSize: '0.875rem'
              }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.rollNumber || s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Select Target Course *
            </label>
            <select
              value={modalCourseId}
              onChange={(e) => setModalCourseId(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: '#FFFFFF',
                color: 'var(--text)',
                fontSize: '0.875rem'
              }}
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting} icon="check">
              Confirm Enrollment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminEnrollments;
