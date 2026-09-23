import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/users/${user.id}`, {
        fullName,
        phone,
      });
      if (res.data && res.data.data) {
        if (updateUserProfile) updateUserProfile(res.data.data);
        notify('success', 'Administrator profile updated successfully.');
      }
    } catch (err) {
      notify('error', 'Failed to update administrator profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Administrator Profile</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          University superuser credentials and administrative contact details
        </p>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
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
          }}>
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              {user?.fullName || 'System Administrator'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0.5rem 0' }}>
              {user?.email}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Badge variant="danger">Campus Administrator</Badge>
              <Badge variant="primary">Root Privileges</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Full Name *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            icon="user"
          />

          <Input
            label="Institutional Email"
            value={user?.email || ''}
            disabled
            icon="mail"
          />

          <Input
            label="Contact Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            icon="phone"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              icon="check"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default AdminProfile;
