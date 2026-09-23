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
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminCourses = () => {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    teacherId: '',
    departmentId: '',
    categoryId: '',
    active: true
  });

  // Edit Modal
  const [editingCourse, setEditingCourse] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState(null);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [cRes, tRes, dRes, catRes] = await Promise.all([
        api.get('/courses'),
        api.get('/users/teachers'),
        api.get('/departments'),
        api.get('/categories')
      ]);

      setCourses(cRes.data?.data || []);
      const tList = tRes.data?.data || [];
      const dList = dRes.data?.data || [];
      const catList = catRes.data?.data || [];

      setTeachers(tList);
      setDepartments(dList);
      setCategories(catList);

      setFormData(prev => ({
        ...prev,
        teacherId: tList[0]?.id?.toString() || '',
        departmentId: dList[0]?.id?.toString() || '',
        categoryId: catList[0]?.id?.toString() || ''
      }));
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to load course information');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim() || !formData.teacherId || !formData.departmentId || !formData.categoryId) {
      notify('warning', 'Please fill in all mandatory course fields');
      return;
    }

    setCreating(true);
    try {
      const payload = {
        title: formData.title,
        code: formData.code,
        description: formData.description,
        teacherId: parseInt(formData.teacherId),
        departmentId: parseInt(formData.departmentId),
        categoryId: parseInt(formData.categoryId),
        active: true
      };

      await api.post('/courses', payload);
      notify('success', 'New course catalog entry added successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        code: '',
        description: '',
        teacherId: teachers[0]?.id?.toString() || '',
        departmentId: departments[0]?.id?.toString() || '',
        categoryId: categories[0]?.id?.toString() || '',
        active: true
      });
      const res = await api.get('/courses');
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      code: course.code,
      description: course.description || '',
      teacherId: course.teacherId ? course.teacherId.toString() : (teachers[0]?.id?.toString() || ''),
      departmentId: course.departmentId ? course.departmentId.toString() : (departments[0]?.id?.toString() || ''),
      categoryId: course.categoryId ? course.categoryId.toString() : (categories[0]?.id?.toString() || ''),
      active: course.active !== false
    });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const payload = {
        title: formData.title,
        code: formData.code,
        description: formData.description,
        teacherId: parseInt(formData.teacherId),
        departmentId: parseInt(formData.departmentId),
        categoryId: parseInt(formData.categoryId),
        active: formData.active
      };

      await api.put(`/courses/${editingCourse.id}`, payload);
      notify('success', 'Course updated successfully!');
      setEditingCourse(null);
      const res = await api.get('/courses');
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to update course');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/courses/${deleteTarget.id}`);
      notify('success', 'Course deleted successfully');
      setCourses(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(c =>
    (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
    (c.code && c.code.toLowerCase().includes(search.toLowerCase())) ||
    (c.departmentName && c.departmentName.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    {
      header: 'Course Code & Title',
      render: (row) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
              {row.code}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>
              {row.title}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
            {row.categoryName || 'Core Curriculum'}
          </div>
        </div>
      )
    },
    {
      header: 'Faculty In-Charge',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>
          {row.teacherName || 'Faculty Member'}
        </span>
      )
    },
    {
      header: 'Department',
      render: (row) => <span>{row.departmentName || 'Computer Science & Engineering'}</span>
    },
    {
      header: 'Students',
      render: (row) => (
        <Badge variant="primary">{row.studentCount || 0} Enrolled</Badge>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'default'}>
          {row.active ? 'Active' : 'Archived'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            icon="edit"
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteTarget(row)}
            icon="trash"
          />
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Course Catalog</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Create academic courses, assign faculty chairs, and define department affiliations
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon="plus"
        >
          Add New Course
        </Button>
      </div>

      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>
            All University Courses ({filteredCourses.length})
          </div>
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <Input
              placeholder="Search course code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="search"
            />
          </div>
        </div>

        {loading ? (
          <Loader text="Loading courses..." />
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            title="No courses found"
            description="Create your first university course using the button above."
            icon="bookOpen"
          />
        ) : (
          <Table columns={columns} data={filteredCourses} />
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!editingCourse}
        onClose={() => { setShowCreateModal(false); setEditingCourse(null); }}
        title={editingCourse ? `Edit Course: ${editingCourse.code}` : "Add New Academic Course"}
        maxWidth="650px"
      >
        <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Input
              label="Course Title *"
              placeholder="e.g. Advanced Operating Systems"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Course Code *"
              placeholder="e.g. CS401"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Assign Faculty In-Charge *
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
                <option key={t.id} value={t.id}>{t.fullName} ({t.email})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Department *
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
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
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Course Syllabus / Description
            </label>
            <textarea
              rows={3}
              placeholder="Course overview, credits, learning objectives..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <Button
              variant="outline"
              type="button"
              onClick={() => { setShowCreateModal(false); setEditingCourse(null); }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={creating || updating}
              icon="check"
            >
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Course?"
        message={`Are you sure you want to permanently delete course "${deleteTarget?.title}" (${deleteTarget?.code})?`}
        confirmText="Delete Course"
        confirmVariant="danger"
        onConfirm={handleDeleteCourse}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default AdminCourses;
