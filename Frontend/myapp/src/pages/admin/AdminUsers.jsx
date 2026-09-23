import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Icon } from '../../components/common/Icons';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: 'Password@123',
    role: 'ROLE_STUDENT',
    rollNumber: '',
    phone: '',
    departmentId: ''
  });

  // Edit User Modal
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phone: '',
    rollNumber: ''
  });
  const [updating, setUpdating] = useState(false);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState(null);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userRes, deptRes] = await Promise.all([
        api.get('/users'),
        api.get('/departments')
      ]);
      setUsers(userRes.data?.data || []);
      const dList = deptRes.data?.data || [];
      setDepartments(dList);
      if (dList.length > 0) {
        setFormData(prev => ({ ...prev, departmentId: dList[0].id.toString() }));
      }
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      notify('warning', 'Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        rollNumber: formData.rollNumber,
        phone: formData.phone,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        active: true
      };

      const res = await api.post('/users', payload);
      notify('success', 'User account created successfully!');
      setShowCreateModal(false);
      setFormData({
        fullName: '',
        email: '',
        password: 'Password@123',
        role: 'ROLE_STUDENT',
        rollNumber: '',
        phone: '',
        departmentId: departments[0]?.id?.toString() || ''
      });
      // Refresh
      const uRes = await api.get('/users');
      setUsers(uRes.data?.data || []);
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      phone: user.phone || '',
      rollNumber: user.rollNumber || ''
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/users/${editingUser.id}`, {
        fullName: editFormData.fullName,
        phone: editFormData.phone,
        rollNumber: editFormData.rollNumber
      });
      notify('success', 'User updated successfully');
      setEditingUser(null);
      const uRes = await api.get('/users');
      setUsers(uRes.data?.data || []);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/users/${user.id}/status`);
      notify('success', `User marked as ${user.active ? 'Inactive' : 'Active'}`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to change status');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      notify('success', 'User account deleted successfully');
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (roleFilter !== 'ALL') {
      return u.role === roleFilter;
    }
    return true;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <Badge variant="danger">Admin</Badge>;
      case 'ROLE_TEACHER':
        return <Badge variant="primary">Teacher</Badge>;
      case 'ROLE_STUDENT':
        return <Badge variant="default">Student</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  const columns = [
    {
      header: 'User',
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
            {row.fullName ? row.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{row.fullName}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      render: (row) => getRoleBadge(row.role)
    },
    {
      header: 'ID / Roll No',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text)' }}>
          {row.rollNumber || 'N/A'}
        </span>
      )
    },
    {
      header: 'Department',
      render: (row) => (
        <span>{row.departmentName || 'General'}</span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'default'}>
          {row.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            icon="edit"
          />
          <Button
            variant={row.active ? 'outline' : 'primary'}
            size="sm"
            onClick={() => handleToggleStatus(row)}
          >
            {row.active ? 'Disable' : 'Enable'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteTarget(row)}
            icon="trash"
          />
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>User Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Comprehensive directory of students, faculty members, and campus administrators
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon="plus"
        >
          Create User Account
        </Button>
      </div>

      {/* Main Table Card */}
      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_ADMIN'].map((r) => (
              <Button
                key={r}
                variant={roleFilter === r ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter(r)}
              >
                {r === 'ALL' ? 'All Users' : r === 'ROLE_STUDENT' ? 'Students' : r === 'ROLE_TEACHER' ? 'Teachers' : 'Admins'}
              </Button>
            ))}
          </div>

          <div style={{ maxWidth: '300px', width: '100%' }}>
            <Input
              placeholder="Search user name, email, roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon="search"
            />
          </div>
        </div>

        {loading ? (
          <Loader text="Loading university directory..." />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            description="No users match your active filter criteria."
            icon="users"
          />
        ) : (
          <Table columns={columns} data={filteredUsers} />
        )}
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New University Account"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Full Name *"
            placeholder="e.g. Ramesh Kumar"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Institutional Email *"
              type="email"
              placeholder="e.g. ramesh@smartlms.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password *"
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Account Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: '#FFFFFF',
                  color: 'var(--text)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_TEACHER">Teacher</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>
                Department
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: '#FFFFFF',
                  color: 'var(--text)',
                  fontSize: '0.875rem'
                }}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Roll Number / Faculty ID"
              placeholder="e.g. CS2026-042 or FAC-102"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            />

            <Input
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={creating} icon="check">
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={`Edit User: ${editingUser?.fullName || ''}`}
        maxWidth="500px"
      >
        <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Full Name *"
            value={editFormData.fullName}
            onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
            required
          />

          <Input
            label="Roll Number / Faculty ID"
            value={editFormData.rollNumber}
            onChange={(e) => setEditFormData({ ...editFormData, rollNumber: e.target.value })}
          />

          <Input
            label="Phone Number"
            value={editFormData.phone}
            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={updating} icon="check">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User Account?"
        message={`Are you sure you want to delete "${deleteTarget?.fullName}"? All associated student/teacher records will be affected.`}
        confirmText="Delete User"
        confirmVariant="danger"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default AdminUsers;
