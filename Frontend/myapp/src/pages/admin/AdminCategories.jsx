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

export const AdminCategories = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      notify('warning', 'Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        notify('success', 'Category updated successfully!');
      } else {
        await api.post('/categories', formData);
        notify('success', 'Category created successfully!');
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      notify('success', 'Category deleted successfully');
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to delete category');
    }
  };

  const columns = [
    {
      header: 'Category Name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{row.name}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.description || 'Curriculum stream'}</div>
        </div>
      )
    },
    {
      header: 'Courses Tagged',
      render: (row) => (
        <Badge variant="primary">{row.courseCount || 0} Courses</Badge>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Course Categories</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Academic subjects, professional specializations, and curriculum disciplines
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} icon="plus">
          Add Category
        </Button>
      </div>

      <Card>
        {loading ? (
          <Loader text="Loading categories..." />
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories defined"
            description="Create categories like Computer Science, Information Security, Artificial Intelligence."
            icon="folder"
          />
        ) : (
          <Table columns={columns} data={categories} />
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Edit Category' : 'Create Course Category'}
        maxWidth="500px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Category Name *"
            placeholder="e.g. Artificial Intelligence & Machine Learning"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Scope, discipline details, and related electives..."
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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Category?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete Category"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default AdminCategories;
