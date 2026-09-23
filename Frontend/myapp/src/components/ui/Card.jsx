import React from 'react';

export const Card = ({ children, className = '', title, subtitle, action, style = {} }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
    >
      {(title || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.75rem',
        }}>
          <div>
            {title && <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)' }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
