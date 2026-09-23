import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/common/Icons';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      padding: '2rem 1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--surface)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}>
          <Icon name="helpCircle" size={24} color="var(--primary)" />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
          Password Assistance
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Enter your registered institutional email. We will send you verification instructions.
        </p>

        {submitted ? (
          <div style={{
            padding: '1.25rem',
            backgroundColor: 'var(--success-light)',
            border: '1px solid #A5D6A7',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--success)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}>
            If an account exists for <strong>{email}</strong>, a password reset link has been dispatched to your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <Input
              label="University Email"
              type="email"
              placeholder="e.g. student@smartlms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" size="md" style={{ width: '100%', padding: '0.75rem' }}>
              Send Reset Instructions
            </Button>
          </form>
        )}

        <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
          <Link to="/login" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
