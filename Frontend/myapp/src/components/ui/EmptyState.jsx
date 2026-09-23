import React from 'react';
import { Icon } from '../common/Icons';
import { Button } from './Button';

export const EmptyState = ({
  icon = 'book',
  title = 'No items found',
  description = 'There are currently no records to display.',
  actionText,
  onAction,
}) => {
  return (
    <div style={{
      padding: '3rem 1.5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface)',
      border: '1px dashed var(--border)',
      borderRadius: 'var(--radius-md)',
      margin: '1rem 0',
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}>
        <Icon name={icon} size={26} color="var(--primary)" />
      </div>
      <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '360px', marginBottom: actionText ? '1.25rem' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
