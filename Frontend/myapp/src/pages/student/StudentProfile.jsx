import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/common/Icons';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const StudentProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/users/${user.id}`, {
        fullName,
        phone,
      });
      if (res.data && res.data.data) {
        updateUserProfile(res.data.data);
        toast.success('Profile details updated successfully.');
      }
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Student Profile</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Institutional student information and contact details</p>
      </div>

      <Card>
        {/* Profile Avatar Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-card)',
          }}>
            {user?.fullName?.charAt(0).toUpperCase() || 'S'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                {user?.fullName}
              </h2>
              <Badge variant="success">Active Student</Badge>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Roll Number: <strong>{user?.rollNumber || '24CSE001'}</strong> • {user?.departmentName || 'Computer Science & Engineering'}
            </p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave}>
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Registered Institutional Email"
            value={user?.email || ''}
            disabled={true}
            helperText="Institutional email addresses are managed by the university administrator."
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Department"
              value={user?.departmentName || 'Computer Science'}
              disabled={true}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="submit" variant="primary" loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentProfile;
