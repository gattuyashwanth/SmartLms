import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const StudentNotifications = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    api.get('/notifications')
      .then((res) => {
        if (res.data && res.data.data) {
          setNotifications(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Notification Center</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>System alerts, graded submission updates, and course reminders</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
          Mark All as Read
        </Button>
      </div>

      {loading ? (
        <Loader text="Loading notifications..." size="lg" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="activity"
          title="No notifications"
          description="You are completely caught up!"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <Card
              key={n.id}
              style={{
                backgroundColor: n.read ? 'var(--surface)' : 'var(--primary-light)',
                border: `1px solid ${n.read ? 'var(--border-light)' : '#FFCDD2'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: n.read ? 'var(--surface-alt)' : 'var(--primary)',
                  color: n.read ? 'var(--text-secondary)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon name="bell" size={18} color={n.read ? 'var(--text-secondary)' : '#FFFFFF'} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)' }}>
                    {n.title}
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.read && (
                <Button variant="outline" size="sm" onClick={() => handleMarkSingleRead(n.id)}>
                  Mark Read
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
