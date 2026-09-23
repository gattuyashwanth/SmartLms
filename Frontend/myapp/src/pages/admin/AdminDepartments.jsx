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

export const AdminDepartments = () => {
  const toast = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data?.data || []);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, code: dept.code, description: dept.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      notify('warning', 'Department name and code are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, formData);
        notify('success', 'Department updated successfully!');
      } else {
        await api.post('/departments', formData);
        notify('success', 'Department created successfully!');
      }
      setShowModal(false);
      loadDepartments();
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/departments/${deleteTarget.id}`);
      notify('success', 'Department deleted successfully');
      setDepartments(prev => prev.filter(d => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to delete department');
    }
  };

  const columns = [
    {
      header: 'Code',
      render: (row) => (
        <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
          {row.code}
        </span>
      )
    },
    {
      header: 'Department Name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{row.name}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.description || 'Academic division'}</div>
        </div>
      )
    },
    {
      header: 'Courses',
      render: (row) => (
        <Badge variant="primary">{row.courseCount || 0} Courses</Badge>
      )
    },
    {
      header: 'Affiliated Users',
      render: (row) => (
        <Badge variant="default">{row.userCount || 0} Members</Badge>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Academic Departments</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Schools, faculties, and academic departments across SMART LMS University
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} icon="plus">
          Add Department
        </Button>
      </div>

      <Card>
        {loading ? (
          <Loader text="Loading departments..." />
        ) : departments.length === 0 ? (
          <EmptyState
            title="No departments found"
            description="Create your first academic department to group courses and faculty."
            icon="folder"
          />
        ) : (
          <Table columns={columns} data={departments} />
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDept ? 'Edit Department' : 'Create Academic Department'}
        maxWidth="500px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Department Name *"
            placeholder="e.g. Computer Science & Engineering"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Department Code *"
            placeholder="e.g. CSE"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Scope of study, research laboratories, curriculum focus..."
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting} icon="check">
              {editingDept ? 'Save Changes' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Department?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Any linked courses may be unassigned.`}
        confirmText="Delete Department"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default AdminDepartments;
