import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`);
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (userId, currentPassword, newPassword) => {
    try {
      const payload = { newPassword };
      if (currentPassword !== null && currentPassword !== undefined) {
        payload.currentPassword = currentPassword;
      }
      await axios.put(`${API_BASE_URL}/api/users/${userId}/password`, payload);
      // Refresh user data
      await fetchUser();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed',
      };
    }
  };

  const login = async (emailOrMobileOrEnrollment, password, loginType = 'email') => {
    try {
      let loginData;
      if (loginType === 'enrollment') {
        loginData = { enrollmentNumber: emailOrMobileOrEnrollment, password };
      } else if (loginType === 'mobile') {
        loginData = { mobileNumber: emailOrMobileOrEnrollment, password };
      } else {
        loginData = { email: emailOrMobileOrEnrollment, password };
      }
      
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, changePassword, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

