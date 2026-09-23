import React from 'react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  helperText,
  icon,
  className = '',
  style = {},
}) => {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', ...style }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="form-control"
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            fontSize: '0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            backgroundColor: disabled ? 'var(--surface-alt)' : 'var(--surface)',
            color: 'var(--text)',
            outline: 'none',
          }}
        />
      </div>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.125rem' }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{helperText}</span>}
    </div>
  );
};
