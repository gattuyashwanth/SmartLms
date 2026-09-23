import React from 'react';
import { Icon } from '../common/Icons';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md', // sm, md, lg
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
}) => {
  const sizeStyles = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.75rem' },
    md: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: '#FFFFFF',
      border: '1px solid var(--primary)',
    },
    secondary: {
      backgroundColor: 'var(--surface)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)',
    },
    danger: {
      backgroundColor: 'var(--danger)',
      color: '#FFFFFF',
      border: '1px solid var(--danger)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.65 : 1,
        transition: 'all var(--transition-fast)',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          if (variant === 'outline') e.currentTarget.style.backgroundColor = 'var(--primary-light)';
          if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--primary)';
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--surface)';
          if (variant === 'outline') e.currentTarget.style.backgroundColor = 'transparent';
          if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
          {children}
          {icon && iconPosition === 'right' && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
        </>
      )}
    </button>
  );
};
