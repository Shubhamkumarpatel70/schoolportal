import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiLogIn, FiMail, FiLock, FiUser } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    mobileNumber: '',
    enrollmentNumber: '',
    password: ''
  });
  const [loginType, setLoginType] = useState('email'); // 'email' or 'student'
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
    setLoading(true);

    let loginValue;
    if (loginType === 'student') {
      loginValue = formData.enrollmentNumber;
    } else {
      loginValue = formData.email;
    }
    
    const result = await login(loginValue, formData.password, loginType === 'student' ? 'enrollment' : 'email');
    
    if (result.success) {
      const userRole = result.user?.role || 'student';
      navigate(`/${userRole}/dashboard`);
    } else {
      setError(result.message || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-neutral-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-neutral-2 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FiLogIn className="text-5xl text-secondary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2 text-neutral-3">Login</h2>
              <p className="text-neutral-3/70">Welcome back! Please login to your account.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login Type Toggle */}
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setLoginType('email')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition text-sm ${
                    loginType === 'email'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-1 text-neutral-3'
                  }`}
                >
                  Adminstration
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('student')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition text-sm ${
                    loginType === 'student'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-1 text-neutral-3'
                  }`}
                >
                  Student Login
                </button>
              </div>

              {loginType === 'email' ? (
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
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-neutral-3 font-semibold mb-2">
                    Enrollment Number
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-neutral-3/40" />
                    <input
                      type="text"
                      name="enrollmentNumber"
                      value={formData.enrollmentNumber}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                      placeholder="Enter your enrollment number"
                    />
                  </div>
                </div>
              )}

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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-neutral-3/70">
                Don't have an account?{' '}
                <Link to="/register" className="text-secondary font-semibold hover:underline">
                  Register here
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

export default Login;

