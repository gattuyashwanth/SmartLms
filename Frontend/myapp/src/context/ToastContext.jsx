import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from '../components/common/Icons';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 9999,
        maxWidth: '400px',
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface)',
              border: `1px solid ${
                t.type === 'success' ? '#A5D6A7' :
                t.type === 'error' ? '#EF9A9A' :
                t.type === 'warning' ? '#FFE082' : 'var(--border)'
              }`,
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text)',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Icon
                name={
                  t.type === 'success' ? 'checkCircle' :
                  t.type === 'error' ? 'xCircle' :
                  t.type === 'warning' ? 'alertCircle' : 'bell'
                }
                size={18}
                color={
                  t.type === 'success' ? 'var(--success)' :
                  t.type === 'error' ? 'var(--danger)' :
                  t.type === 'warning' ? 'var(--warning)' : 'var(--primary)'
                }
              />
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '0.25rem',
              }}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
