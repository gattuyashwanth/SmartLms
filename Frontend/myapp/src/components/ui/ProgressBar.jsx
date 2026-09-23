import React from 'react';

export const ProgressBar = ({ progress = 0, height = 8, showLabel = false, color = 'var(--primary)' }) => {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>Progress</span>
          <span style={{ fontWeight: 600 }}>{safeProgress}%</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'var(--primary-light)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${safeProgress}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.4s ease-in-out',
        }} />
      </div>
    </div>
  );
};
