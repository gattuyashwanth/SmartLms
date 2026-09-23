import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/common/Icons';
import api from '../../services/api';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users/students')
      .then((res) => {
        setStudents(res.data?.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(s =>
    (s.fullName && s.fullName.toLowerCase().includes(search.toLowerCase())) ||
    (s.rollNumber && s.rollNumber.toLowerCase().includes(search.toLowerCase())) ||
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    {
      header: 'Student',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            {row.fullName ? row.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{row.fullName}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Roll Number',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text)' }}>
          {row.rollNumber || 'CS2026-001'}
        </span>
      )
    },
    {
      header: 'Department',
      render: (row) => <span>{row.departmentName || 'Computer Science & Engineering'}</span>
    },
    {
      header: 'Contact',
      render: (row) => <span>{row.phone || '+91 98765 43210'}</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'default'}>
          {row.active ? 'Enrolled' : 'Inactive'}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Student Directory</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            All registered undergraduate and postgraduate students across faculties
          </p>
        </div>
        <div style={{ maxWidth: '300px', width: '100%' }}>
          <Input
            placeholder="Search student roll, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <Loader text="Loading student directory..." />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            title="No students found"
            description="There are currently no students matching your query."
            icon="users"
          />
        ) : (
          <Table columns={columns} data={filteredStudents} />
        )}
      </Card>
    </div>
  );
};
export default AdminStudents;
