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
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow bg-neutral-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-neutral-2 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FiUserPlus className="text-5xl text-secondary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2 text-neutral-3">Admin Registration</h2>
              <p className="text-neutral-3/70">
                This page is only for creating the <span className="font-semibold">first admin</span>.
                After an admin exists, please log in using the normal login page.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-neutral-3 font-semibold mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-neutral-3/40" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-3 font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-neutral-3/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    placeholder="Enter admin email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-3 font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-neutral-3/40" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    placeholder="Enter a strong password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-3 font-semibold mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-neutral-3/40" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register Admin'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-neutral-3/70">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary font-semibold hover:underline">
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


