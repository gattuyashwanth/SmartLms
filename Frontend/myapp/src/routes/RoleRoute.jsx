import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/ui/Loader';

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader text="Verifying role permissions..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize roles: compare without "ROLE_" prefix so both "STUDENT" and "ROLE_STUDENT" match
  const normalize = (r) => (r ? r.toString().replace(/^ROLE_/, '').toUpperCase() : '');
  const userRoleNormalized = normalize(role);
  const hasAccess = allowedRoles.some((allowed) => normalize(allowed) === userRoleNormalized);

  if (!hasAccess) {
    // Redirect to the user's proper role dashboard
    if (userRoleNormalized === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRoleNormalized === 'TEACHER') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export default RoleRoute;
