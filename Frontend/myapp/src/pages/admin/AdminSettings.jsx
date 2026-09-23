import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Academic Settings
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [currentSemester, setCurrentSemester] = useState('Semester 5 (Odd)');
  const [minAttendance, setMinAttendance] = useState('75');
  const [allowRegistration, setAllowRegistration] = useState(true);

  const notify = (type, msg) => {
    if (toast && typeof toast[type] === 'function') {
      toast[type](msg);
    } else if (typeof toast === 'function') {
      toast(type, msg);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notify('error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      notify('warning', 'Password must be at least 6 characters long');
      return;
    }
    notify('success', 'Administrator security credentials updated.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveAcademicSettings = (e) => {
    e.preventDefault();
    notify('success', 'University academic configuration updated successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '750px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>System Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          University term configuration, global attendance rules, and administrator credentials
        </p>
      </div>

      {/* Academic Term Configuration */}
      <Card title="University Academic Configuration" subtitle="Global rules enforced across all campus courses">
        <form onSubmit={handleSaveAcademicSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Active Academic Session"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
            />
            <Input
              label="Current Active Semester"
              value={currentSemester}
              onChange={(e) => setCurrentSemester(e.target.value)}
              required
            />
          </div>

          <Input
            label="Mandatory Attendance Compliance Threshold (%)"
            type="number"
            min="50"
            max="100"
            value={minAttendance}
            onChange={(e) => setMinAttendance(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>Open Student Self-Registration</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Allow public student registration on the landing portal
              </div>
            </div>
            <input
              type="checkbox"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" icon="check">
              Save Academic Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Card */}
      <Card title="Change Administrator Password" subtitle="Protect your campus executive control panel">
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Current Administrator Password *"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="New Password *"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password *"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" icon="check">
              Update Administrator Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default AdminSettings;
