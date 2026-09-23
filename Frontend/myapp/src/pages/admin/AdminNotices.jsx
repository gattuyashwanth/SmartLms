import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminNotices = () => {
  const toast = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'NORMAL',
    audience: 'ALL',
    expiryDate: ''
  });

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
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data?.data || []);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      priority: 'NORMAL',
      audience: 'ALL',
      expiryDate: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (n) => {
    setEditingNotice(n);
    setFormData({
      title: n.title,
      content: n.content,
      priority: n.priority || 'NORMAL',
      audience: n.audience || 'ALL',
      expiryDate: n.expiryDate || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      notify('warning', 'Title and content are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        audience: formData.audience,
        expiryDate: formData.expiryDate || null
      };

      if (editingNotice) {
        await api.put(`/notices/${editingNotice.id}`, payload);
        notify('success', 'Announcement updated successfully!');
      } else {
        await api.post('/notices', payload);
        notify('success', 'Announcement published to campus!');
      }

      setShowModal(false);
      loadNotices();
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to save notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/notices/${deleteTarget.id}`);
      notify('success', 'Notice deleted successfully');
      setNotices(prev => prev.filter(n => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to delete notice');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>University Announcements</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Publish official academic circulars, exam notices, and campus notifications
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} icon="plus">
          Publish Notice
        </Button>
      </div>

      {loading ? (
        <Loader text="Loading notices..." />
      ) : notices.length === 0 ? (
        <Card>
          <EmptyState
            title="No notices found"
            description="Broadcast your first university notice to all students and faculty."
            icon="bell"
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notices.map((n) => (
            <Card key={n.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="bell" size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                      {n.title}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      Published by {n.creatorName || 'Administration'} • {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Badge variant={n.priority === 'URGENT' ? 'danger' : n.priority === 'HIGH' ? 'warning' : 'primary'}>
                    {n.priority || 'NORMAL'}
                  </Badge>
                  <Badge variant="default">Audience: {n.audience || 'ALL'}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(n)} icon="edit" />
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(n)} icon="trash" />
                </div>
              </div>

              <div style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {n.content}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingNotice ? 'Edit Notice' : 'Publish University Notice'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Notice Title *"
            placeholder="e.g. Annual Convocation and Degree Award Ceremony 2026"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Priority Level *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent / Critical</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Target Audience *
              </label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
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
                <option value="ALL">Entire Campus (ALL)</option>
                <option value="STUDENTS">Students Only</option>
                <option value="TEACHERS">Faculty Only</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Notice Content *
            </label>
            <textarea
              rows={5}
              placeholder="Enter comprehensive notice text..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                color: 'var(--text)',
                resize: 'vertical'
              }}
            />
          </div>

          <Input
            label="Expiry Date (Optional)"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting} icon="check">
              {editingNotice ? 'Save Changes' : 'Publish Announcement'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Announcement?"
        message={`Are you sure you want to permanently delete notice "${deleteTarget?.title}"?`}
        confirmText="Delete Notice"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default AdminNotices;
