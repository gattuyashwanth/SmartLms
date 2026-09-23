import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const styles = {
    primary: { backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', border: '1px solid #F8BBD0' },
    success: { backgroundColor: 'var(--success-light)', color: 'var(--success)', border: '1px solid #C8E6C9' },
    warning: { backgroundColor: 'var(--warning-light)', color: 'var(--warning)', border: '1px solid #FFE082' },
    danger: { backgroundColor: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid #FFCDD2' },
    neutral: { backgroundColor: '#F3F4F6', color: 'var(--text-secondary)', border: '1px solid #E5E7EB' },
  };

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2rem 0.55rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.2,
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
};
