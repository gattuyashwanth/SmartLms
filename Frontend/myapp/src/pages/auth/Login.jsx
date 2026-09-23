import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/common/Icons';

export const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const authData = await login(email, password, rememberMe);
      toast.success(`Welcome back, ${authData.fullName}!`);

      // Role-based redirection
      const normRole = (authData.role ? authData.role.toString().replace(/^ROLE_/, '').toUpperCase() : '');
      if (normRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (normRole === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--background)',
    }}>
      {/* Left Banner: Branding & University Highlights */}
      <div
        className="auth-sidebar"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)',
          color: '#FFFFFF',
          padding: '4rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name="graduationCap" size={26} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.04em' }}>
              SMART LMS
            </span>
          </div>

          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1.25rem', color: '#FFFFFF' }}>
            Next-Generation Academic Management
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#FFCDD2', lineHeight: 1.6, maxWidth: '460px' }}>
            Access your course lectures, real-time attendance logs, automated quizzes, and university academic announcements.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '0.9375rem' }}>Role-based portals for Students, Teachers, and Admins</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '0.9375rem' }}>Real-time attendance & automated grade calculation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '0.9375rem' }}>Stateless JWT authentication with server-side validation</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8125rem', color: '#FFCDD2' }}>
          Smart LMS • Enterprise University System
        </div>
      </div>

      {/* Right Form: Login Card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--surface)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem' }}>
              Sign In
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Enter your university credentials to access your portal
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--danger-light)',
              border: '1px solid #FFCDD2',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <Icon name="alertCircle" size={16} color="var(--danger)" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. student1@smartlms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              fontSize: '0.8125rem',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Demo Accounts
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@smartlms.com', 'Password@123')}
                style={{
                  flex: 1,
                  padding: '0.375rem 0.5rem',
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  border: '1px solid #FFCDD2',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('rajesh.teacher@smartlms.com', 'Password@123')}
                style={{
                  flex: 1,
                  padding: '0.375rem 0.5rem',
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  border: '1px solid #FFCDD2',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('student1@smartlms.com', 'Password@123')}
                style={{
                  flex: 1,
                  padding: '0.375rem 0.5rem',
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  border: '1px solid #FFCDD2',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Student
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            New student?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .auth-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
