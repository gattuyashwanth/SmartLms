import React from 'react';
import { Loader } from './Loader';
import { EmptyState } from './EmptyState';

export const Table = ({
  columns = [], // [{ key, header, render: (row) => ... }]
  data = [],
  loading = false,
  emptyMessage = 'No records found',
  onRowClick,
}) => {
  if (loading) {
    return (
      <div style={{ padding: '3rem 0', display: 'flex', justifyContent: 'center' }}>
        <Loader text="Loading data..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className="table-container" style={{
      width: '100%',
      overflowX: 'auto',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
      boxShadow: 'var(--shadow-card)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: 'var(--primary-subtle)', borderBottom: '1px solid var(--border)' }}>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  padding: '0.875rem 1rem',
                  fontWeight: 600,
                  color: 'var(--primary-dark)',
                  letterSpacing: '0.02em',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: '1px solid var(--border-light)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {columns.map((col, colIdx) => (
                <td key={col.key || colIdx} style={{ padding: '0.875rem 1rem', color: 'var(--text)' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
