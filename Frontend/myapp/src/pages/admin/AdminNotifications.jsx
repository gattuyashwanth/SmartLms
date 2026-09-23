import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminNotifications = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

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
      notify('success', 'All system notifications marked as read.');
    } catch (err) {
      notify('error', 'Failed to update notifications');
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>System Notification Center</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Administrative notifications, system audit logs, and critical platform alerts
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
          Mark All as Read
        </Button>
      </div>

      {loading ? (
        <Loader text="Loading system notifications..." size="lg" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="activity"
          title="No alerts pending"
          description="System operations are running smoothly with no pending alerts."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && handleMarkSingleRead(n.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: n.read ? 'var(--surface)' : '#FFF5F5',
                border: `1px solid ${n.read ? 'var(--border)' : 'var(--primary-light)'}`,
                borderLeft: !n.read ? '4px solid var(--primary)' : '1px solid var(--border)',
                cursor: n.read ? 'default' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: n.read ? 'var(--surface-alt)' : 'var(--primary-light)',
                color: n.read ? 'var(--text-secondary)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name="bell" size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontWeight: n.read ? 600 : 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminNotifications;
