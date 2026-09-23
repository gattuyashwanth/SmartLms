import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../services/api';

export const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users/teachers')
      .then((res) => {
        setTeachers(res.data?.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTeachers = teachers.filter(t =>
    (t.fullName && t.fullName.toLowerCase().includes(search.toLowerCase())) ||
    (t.email && t.email.toLowerCase().includes(search.toLowerCase())) ||
    (t.rollNumber && t.rollNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    {
      header: 'Faculty Member',
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
            {row.fullName ? row.fullName.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{row.fullName}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Staff ID',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text)' }}>
          {row.rollNumber || 'FAC-101'}
        </span>
      )
    },
    {
      header: 'Department',
      render: (row) => <span>{row.departmentName || 'Computer Science & Engineering'}</span>
    },
    {
      header: 'Phone',
      render: (row) => <span>{row.phone || '+91 98765 43210'}</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'default'}>
          {row.active ? 'Active Faculty' : 'On Leave'}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Faculty Directory</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Professors, associate professors, and department lecturers
          </p>
        </div>
        <div style={{ maxWidth: '300px', width: '100%' }}>
          <Input
            placeholder="Search faculty name, ID, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <Loader text="Loading faculty members..." />
        ) : filteredTeachers.length === 0 ? (
          <EmptyState
            title="No faculty members found"
            description="There are currently no faculty members matching your search query."
            icon="award"
          />
        ) : (
          <Table columns={columns} data={filteredTeachers} />
        )}
      </Card>
    </div>
  );
};
export default AdminTeachers;
