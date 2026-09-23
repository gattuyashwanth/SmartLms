import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

export const TeacherSettings = () => {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submissionAlerts, setSubmissionAlerts] = useState(true);
  const [attendanceReminders, setAttendanceReminders] = useState(true);

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
    notify('success', 'Security credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Faculty Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Manage your password, teaching notification alerts, and session preferences
        </p>
      </div>

      <Card title="Change Password" subtitle="Keep your faculty portal secure with a strong password">
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Current Password *"
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
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Faculty Notifications" subtitle="Configure email and in-app teaching alerts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>Student Submission Alerts</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Notify when students turn in assignment solutions or submit quizzes
              </div>
            </div>
            <input
              type="checkbox"
              checked={submissionAlerts}
              onChange={(e) => setSubmissionAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>Daily Attendance Reminders</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Receive a prompt 15 minutes before scheduled lectures to mark student attendance
              </div>
            </div>
            <input
              type="checkbox"
              checked={attendanceReminders}
              onChange={(e) => setAttendanceReminders(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
export default TeacherSettings;
