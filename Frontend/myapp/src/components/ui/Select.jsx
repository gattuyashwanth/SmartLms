import React from 'react';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
}) => {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
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
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
};
