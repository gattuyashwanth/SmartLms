import React from 'react';

export const Loader = ({ text = 'Loading...', size = 'md' }) => {
  const dim = size === 'sm' ? 24 : size === 'lg' ? 48 : 32;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      padding: '2rem',
    }}>
      <div
        style={{
          width: `${dim}px`,
          height: `${dim}px`,
          border: '3px solid var(--primary-light)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{text}</span>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
