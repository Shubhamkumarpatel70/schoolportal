import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUserPlus, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { API_BASE_URL } from '../utils/api';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Call initial admin registration endpoint
      await axios.post(`${API_BASE_URL}/api/auth/register-admin-initial`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Log in as the new admin using email/password
      const result = await login(formData.email, formData.password, 'email');
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ui-shell">
      <Header />

      <div className="flex-grow py-12 sm:py-16">
        <div className="ui-container">
          <div className="mx-auto max-w-lg ui-card p-6 sm:p-8">
            <div className="mb-8 text-center">
              <FiUserPlus className="mx-auto mb-4 text-5xl text-secondary" />
              <h2 className="text-3xl font-bold text-slate-900">Admin Registration</h2>
              <p className="mt-2 text-sm text-slate-600">
                This page is only for creating the <span className="font-semibold">first admin</span>.
                After an admin exists, please log in using the normal login page.
              </p>
            </div>

            {error && (
              <div className="ui-status-error mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="ui-label">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="ui-input pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="ui-label">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="ui-input pl-10"
                    placeholder="Enter admin email"
                  />
                </div>
              </div>

              <div>
                <label className="ui-label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="ui-input pl-10"
                    placeholder="Enter a strong password"
                  />
                </div>
              </div>

              <div>
                <label className="ui-label">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="ui-input pl-10"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ui-btn-primary w-full"
              >
                {loading ? 'Registering...' : 'Register Admin'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-secondary hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminRegister;


