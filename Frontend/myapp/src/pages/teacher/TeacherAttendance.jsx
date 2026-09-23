import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const TeacherAttendance = () => {
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get('courseId') || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch courses assigned to this teacher
    api.get('/courses/teacher/my-courses')
      .then((res) => {
        if (res.data && res.data.data) {
          const list = res.data.data;
          setCourses(list);
          if (!selectedCourseId && list.length > 0) {
            setSelectedCourseId(list[0].id.toString());
          }
        }
      })
      .catch(() => toast.error('Failed to load your assigned courses'))
      .finally(() => setLoadingCourses(false));
  }, []);

  useEffect(() => {
    if (selectedCourseId && selectedDate) {
      loadRoster();
    }
  }, [selectedCourseId, selectedDate]);

  const loadRoster = () => {
    setLoadingRoster(true);
    api.get(`/attendance/roster?courseId=${selectedCourseId}&date=${selectedDate}`)
      .then((res) => {
        if (res.data && res.data.data) {
          setRoster(res.data.data);
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Could not load class roster'))
      .finally(() => setLoadingRoster(false));
  };

  const handleStatusChange = (studentId, status) => {
    setRoster(prev => prev.map(r => r.studentId === studentId ? { ...r, status } : r));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setRoster(prev => prev.map(r => r.studentId === studentId ? { ...r, remarks } : r));
  };

  const handleMarkAll = (status) => {
    setRoster(prev => prev.map(r => ({ ...r, status })));
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourseId || !selectedDate) {
      toast.error('Please select both course and date');
      return;
    }

    setSaving(true);
    try {
      await api.post('/attendance/batch', {
        courseId: Number(selectedCourseId),
        date: selectedDate,
        records: roster,
      });
      toast.success('Attendance records saved successfully!');
      loadRoster();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loadingCourses) {
    return <Loader text="Loading faculty course assignments..." size="lg" />;
  }

  const courseOptions = courses.map(c => ({ value: c.id.toString(), label: `${c.code} - ${c.title}` }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Class Attendance Manager</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Record daily attendance, prevent duplicate records, and log student presence states
        </p>
      </div>

      {/* Course & Date Picker Header */}
      <Card>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          alignItems: 'flex-end',
        }}>
          <Select
            label="Select Assigned Course"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            options={courseOptions}
            placeholder="Choose course"
          />

          <Input
            label="Attendance Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '1rem' }}>
            <Button variant="secondary" size="md" onClick={() => handleMarkAll('PRESENT')}>
              Mark All Present
            </Button>
            <Button variant="secondary" size="md" onClick={() => handleMarkAll('ABSENT')}>
              Mark All Absent
            </Button>
          </div>
        </div>
      </Card>

      {/* Roster Table */}
      {loadingRoster ? (
        <Loader text="Loading enrolled student roster..." size="lg" />
      ) : roster.length === 0 ? (
        <EmptyState
          icon="users"
          title="No students enrolled"
          description="There are currently no students registered in this course."
        />
      ) : (
        <Card
          title={`Enrolled Students Roster (${roster.length})`}
          subtitle={`Marking attendance for ${selectedDate}`}
          action={
            <Button variant="primary" loading={saving} onClick={handleSaveAttendance} icon="check">
              Save Attendance Roster
            </Button>
          }
        >
          <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--primary-subtle)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Roll No</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Student Name</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'center' }}>Attendance Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((record) => (
                  <tr key={record.studentId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text)' }}>
                      {record.rollNumber || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text)' }}>
                      {record.studentName}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem', backgroundColor: 'var(--surface-alt)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(record.studentId, 'PRESENT')}
                          style={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: record.status === 'PRESENT' ? 'var(--success)' : 'transparent',
                            color: record.status === 'PRESENT' ? '#FFFFFF' : 'var(--text)',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          PRESENT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(record.studentId, 'LATE')}
                          style={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: record.status === 'LATE' ? 'var(--warning)' : 'transparent',
                            color: record.status === 'LATE' ? '#FFFFFF' : 'var(--text)',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          LATE
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(record.studentId, 'ABSENT')}
                          style={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: record.status === 'ABSENT' ? 'var(--danger)' : 'transparent',
                            color: record.status === 'ABSENT' ? '#FFFFFF' : 'var(--text)',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          ABSENT
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={record.remarks || ''}
                        onChange={(e) => handleRemarksChange(record.studentId, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.375rem 0.625rem',
                          fontSize: '0.8125rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--surface)',
                          color: 'var(--text)',
                          outline: 'none',
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" loading={saving} onClick={handleSaveAttendance}>
              Save Attendance Records
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeacherAttendance;
