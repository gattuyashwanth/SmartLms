import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const TeacherNotices = () => {
  const { showToast } = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'NORMAL',
    audience: 'STUDENTS',
    expiryDate: ''
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data?.data || []);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('warning', 'Please provide title and announcement details');
      return;
    }

    setCreating(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        audience: formData.audience,
        expiryDate: formData.expiryDate || null
      };

      await api.post('/notices', payload);
      showToast('success', 'Announcement published successfully!');
      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        priority: 'NORMAL',
        audience: 'STUDENTS',
        expiryDate: ''
      });
      fetchNotices();
    } catch (err) {
      console.error(err);
      showToast('error', err.response?.data?.message || 'Failed to publish notice');
    } finally {
      setCreating(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger">URGENT</Badge>;
      case 'HIGH':
        return <Badge variant="warning">HIGH</Badge>;
      case 'NORMAL':
        return <Badge variant="primary">NORMAL</Badge>;
      default:
        return <Badge variant="default">INFO</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Announcements & Notices</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Broadcast academic circulars and course notifications to students
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          icon="plus"
        >
          Publish Announcement
        </Button>
      </div>

      {loading ? (
        <Loader text="Loading department notices..." />
      ) : notices.length === 0 ? (
        <Card>
          <EmptyState
            title="No notices found"
            description="There are currently no circulars or announcements posted."
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
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="bell" size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                      {n.title}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      Posted by {n.creatorName || 'Faculty / Administration'} • {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {getPriorityBadge(n.priority)}
                  <Badge variant="default">Audience: {n.audience || 'ALL'}</Badge>
                </div>
              </div>

              <div style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {n.content}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Creating Notice */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Publish Academic Announcement"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Notice Title *"
            placeholder="e.g. End-Semester Lab Exam Schedule Announcement"
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
                <option value="STUDENTS">Students Only</option>
                <option value="ALL">Entire University (All)</option>
                <option value="TEACHERS">Faculty Only</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Notice Body / Details *
            </label>
            <textarea
              rows={5}
              placeholder="Enter comprehensive announcement content, key dates, deadlines, room numbers..."
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
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={creating} icon="check">
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default TeacherNotices;
