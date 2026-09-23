import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('smartlms_token') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('smartlms_user');

    if (savedToken && savedUser) {
      try {
        const cleanToken = savedToken.startsWith('Bearer ') ? savedToken.substring(7).trim() : savedToken.trim();
        setToken(cleanToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;

        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Verify with /api/auth/me
        api.get('/auth/me')
          .then((res) => {
            if (res.data && res.data.data) {
              setUser(res.data.data);
              localStorage.setItem('smartlms_user', JSON.stringify(res.data.data));
            }
          })
          .catch(() => {
            // Token expired or invalid
            logout();
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const res = await api.post('/auth/login', { email, password, rememberMe });
    if (res.data && res.data.success && res.data.data) {
      const authData = res.data.data;
      const cleanToken = authData.token.startsWith('Bearer ') ? authData.token.substring(7).trim() : authData.token.trim();

      setToken(cleanToken);
      setUser(authData);

      localStorage.setItem('smartlms_token', cleanToken);
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('smartlms_user', JSON.stringify(authData));

      api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
      return authData;
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data && res.data.success && res.data.data) {
      const authData = res.data.data;
      const cleanToken = authData.token.startsWith('Bearer ') ? authData.token.substring(7).trim() : authData.token.trim();

      setToken(cleanToken);
      setUser(authData);

      localStorage.setItem('smartlms_token', cleanToken);
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('smartlms_user', JSON.stringify(authData));

      api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
      return authData;
    } else {
      throw new Error(res.data.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smartlms_token');
    localStorage.removeItem('token');
    localStorage.removeItem('smartlms_user');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('smartlms_user', JSON.stringify(merged));
      return merged;
    });
  };

  const rawRole = user ? user.role : null;
  const role = rawRole ? (rawRole.startsWith('ROLE_') ? rawRole : `ROLE_${rawRole}`) : null;
  const isStudent = role === 'ROLE_STUDENT';
  const isTeacher = role === 'ROLE_TEACHER';
  const isAdmin = role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated: !!token,
        isStudent,
        isTeacher,
        isAdmin,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
