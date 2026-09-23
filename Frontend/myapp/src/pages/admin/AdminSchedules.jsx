import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminSchedules = () => {
  const toast = useToast();
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    teacherId: '',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    room: 'LH-101',
    type: 'LECTURE'
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes, tRes] = await Promise.all([
        api.get('/schedules'),
        api.get('/courses'),
        api.get('/users/teachers')
      ]);

      setSchedules(sRes.data?.data || []);
      const cList = cRes.data?.data || [];
      const tList = tRes.data?.data || [];
      setCourses(cList);
      setTeachers(tList);

      if (cList.length > 0) {
        setFormData(prev => ({
          ...prev,
          courseId: cList[0].id.toString(),
          teacherId: cList[0].teacherId ? cList[0].teacherId.toString() : (tList[0]?.id?.toString() || '')
        }));
      }
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to load timetables');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    const foundCourse = courses.find(c => c.id.toString() === cid);
    setFormData(prev => ({
      ...prev,
      courseId: cid,
      teacherId: foundCourse?.teacherId ? foundCourse.teacherId.toString() : prev.teacherId
    }));
  };

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setFormData({
      courseId: courses[0]?.id?.toString() || '',
      teacherId: courses[0]?.teacherId?.toString() || teachers[0]?.id?.toString() || '',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      room: 'LH-101',
      type: 'LECTURE'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSchedule(s);
    setFormData({
      courseId: s.courseId?.toString() || (courses[0]?.id?.toString() || ''),
      teacherId: s.teacherId?.toString() || (teachers[0]?.id?.toString() || ''),
      dayOfWeek: s.dayOfWeek || 'Monday',
      startTime: s.startTime || '09:00',
      endTime: s.endTime || '10:00',
      room: s.roomNumber || s.room || 'LH-101',
      type: s.type || 'LECTURE'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.teacherId || !formData.startTime || !formData.endTime || !formData.room) {
      notify('warning', 'Please fill in all timetable fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        courseId: parseInt(formData.courseId),
        teacherId: parseInt(formData.teacherId),
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        type: formData.type
      };

      if (editingSchedule) {
        await api.put(`/schedules/${editingSchedule.id}`, payload);
        notify('success', 'Timetable slot updated successfully!');
      } else {
        await api.post('/schedules', payload);
        notify('success', 'Timetable slot created successfully!');
      }

      setShowModal(false);
      const res = await api.get('/schedules');
      setSchedules(res.data?.data || []);
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to save timetable slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/schedules/${deleteTarget.id}`);
      notify('success', 'Timetable slot removed');
      setSchedules(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to delete schedule slot');
    }
  };

  const columns = [
    {
      header: 'Day',
      render: (row) => (
        <Badge variant="primary">{row.dayOfWeek}</Badge>
      )
    },
    {
      header: 'Time Slot',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>
          {row.startTime} - {row.endTime}
        </span>
      )
    },
    {
      header: 'Course',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text)' }}>
            {row.courseCode ? `${row.courseCode} - ${row.courseTitle}` : row.courseTitle}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Faculty: {row.teacherName || 'Assigned Professor'}
          </div>
        </div>
      )
    },
    {
      header: 'Hall / Lab',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text)' }}>
          {row.roomNumber || row.room || 'LH-101'}
        </span>
      )
    },
    {
      header: 'Session Type',
      render: (row) => (
        <Badge variant={row.type === 'LAB' ? 'warning' : 'default'}>
          {row.type || 'LECTURE'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)} icon="edit" />
          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row)} icon="trash" />
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>University Timetable Master</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Coordinate lecture halls, laboratories, weekly teaching slots, and academic periods
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} icon="plus">
          Add Schedule Slot
        </Button>
      </div>

      <Card>
        {loading ? (
          <Loader text="Loading timetable schedules..." />
        ) : schedules.length === 0 ? (
          <EmptyState
            title="No scheduled time slots"
            description="Add timetable slots to organize weekly lectures and labs."
            icon="calendar"
          />
        ) : (
          <Table columns={columns} data={schedules} />
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSchedule ? 'Edit Schedule Slot' : 'Add Timetable Slot'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Academic Course *
            </label>
            <select
              value={formData.courseId}
              onChange={handleCourseChange}
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

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Faculty Member *
            </label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
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
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.fullName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Day of the Week *
              </label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
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
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                <option value="LECTURE">Lecture</option>
                <option value="LAB">Laboratory</option>
                <option value="TUTORIAL">Tutorial</option>
                <option value="SEMINAR">Seminar</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <Input
              label="Start Time *"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time *"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
            <Input
              label="Room / Hall *"
              placeholder="e.g. LH-101 or Lab 4"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting} icon="check">
              {editingSchedule ? 'Save Changes' : 'Create Slot'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Schedule Entry?"
        message={`Are you sure you want to remove the ${deleteTarget?.dayOfWeek} (${deleteTarget?.startTime} - ${deleteTarget?.endTime}) session?`}
        confirmText="Delete Slot"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default AdminSchedules;
