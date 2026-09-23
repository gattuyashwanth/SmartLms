import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const Topbar = ({ onMenuClick }) => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications/unread-count')
      .then((res) => {
        if (res.data && res.data.data) {
          setUnreadCount(res.data.data.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      api.get('/notifications')
        .then((res) => {
          if (res.data && res.data.data) {
            setNotifications(res.data.data.slice(0, 5));
          }
        })
        .catch(() => {});
    }
  };

  const getRoleDisplayName = () => {
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_TEACHER') return 'Teacher';
    return 'Student';
  };

  const getProfilePath = () => {
    if (role === 'ROLE_ADMIN') return '/admin/profile';
    if (role === 'ROLE_TEACHER') return '/teacher/profile';
    return '/student/profile';
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.375rem',
            color: 'var(--text)',
            borderRadius: 'var(--radius-sm)',
          }}
          className="mobile-menu-btn"
        >
          <Icon name="menu" size={22} />
        </button>

        <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)' }}>
          Smart LMS Portal
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notifications Icon with unread badge */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleOpenNotifications}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--text)',
              position: 'relative',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="bell" size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--surface)',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.75rem',
                zIndex: 1000,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-light)',
                marginBottom: '0.5rem',
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
                  Notifications
                </span>
                <span
                  onClick={() => {
                    api.put('/notifications/read-all').then(() => setUnreadCount(0));
                  }}
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
                >
                  Mark all read
                </span>
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid var(--border-light)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{n.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.125rem' }}>{n.message}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Profile Card in Topbar */}
        <div
          onClick={() => navigate(getProfilePath())}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.375rem 0.625rem',
            borderRadius: 'var(--radius-sm)',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              border: '1px solid #FFCDD2',
            }}
          >
            {user && user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
              {user ? user.fullName : 'Guest'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500, lineHeight: 1.2 }}>
              {getRoleDisplayName()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
