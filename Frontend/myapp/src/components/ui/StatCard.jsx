import React from 'react';
import { Icon } from '../common/Icons';

export const StatCard = ({ title, value, description, icon, trend, trendPositive = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{title}</span>
        {icon && (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name={icon} size={20} color="var(--primary)" />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {trend && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: trendPositive ? 'var(--success)' : 'var(--danger)',
            backgroundColor: trendPositive ? 'var(--success-light)' : 'var(--danger-light)',
            padding: '0.125rem 0.375rem',
            borderRadius: 'var(--radius-sm)',
          }}>
            {trend}
          </span>
        )}
      </div>

      {description && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{description}</span>
      )}
    </div>
  );
};
