import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

export const StudentSettings = () => {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Security settings updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Account Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Security settings, notification preferences, and system appearance</p>
      </div>

      {/* Security Card */}
      <Card title="Change Account Password" subtitle="Ensure your account uses a strong password">
        <form onSubmit={handlePasswordChange}>
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Notification Preferences */}
      <Card title="Notification Preferences" subtitle="Control when you receive academic updates">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>Email Announcements</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Receive important campus circulars in your inbox</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>Assignment Deadline Reminders</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Alerts 24 hours prior to submission deadlines</div>
            </div>
            <input
              type="checkbox"
              checked={assignmentAlerts}
              onChange={(e) => setAssignmentAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
          </label>
        </div>
      </Card>

      {/* System Theme Card */}
      <Card title="System Theme & Appearance">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            border: '2px solid #FFFFFF',
            boxShadow: '0 0 0 2px var(--primary)',
          }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>Light Red & Academic White</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Official institutional theme conforming to university brand standards</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentSettings;
