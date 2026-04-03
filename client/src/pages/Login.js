import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiClock, FiEye, FiEyeOff, FiLogIn, FiMail, FiShield, FiUser } from 'react-icons/fi';

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
  const [showPassword, setShowPassword] = useState(false);
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

    const loginValue = loginType === 'student' ? formData.enrollmentNumber : formData.email;

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
    <div className="ui-shell">
      <Header />

      <div className="flex-grow py-12 sm:py-16">
        <div className="ui-container">
          <div className="mx-auto max-w-5xl overflow-hidden ui-card">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <aside className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-600 to-secondary p-8 text-white sm:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
                <div className="relative">
                  <p className="ui-badge border-white/40 bg-white/15 text-white">Secure Portal</p>
                  <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">Access your academic workspace</h2>
                  <p className="mt-4 text-sm leading-7 text-white/90 sm:text-base">
                    Sign in to view results, notices, fees, events, and role-specific dashboard tools.
                  </p>
                  <ul className="mt-8 space-y-4 text-sm text-white/90">
                    <li className="flex items-center gap-2">
                      <FiShield />
                      <span>Role-based secure access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FiClock />
                      <span>Instant academic updates</span>
                    </li>
                  </ul>
                </div>
              </aside>

              <div className="p-6 sm:p-8">
                <div className="mb-8 text-center">
                  <FiLogIn className="mx-auto mb-4 text-5xl text-secondary" />
                  <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
                  <p className="mt-2 text-sm text-slate-600">Welcome back. Please log in to continue.</p>
                </div>

                {error && <div className="ui-status-error mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setLoginType('email')}
                      className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                        loginType === 'email' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Administration
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginType('student')}
                      className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                        loginType === 'student' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Student Login
                    </button>
                  </div>

                  {loginType === 'email' ? (
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
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="ui-label">Enrollment Number</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          name="enrollmentNumber"
                          value={formData.enrollmentNumber}
                          onChange={handleChange}
                          required
                          className="ui-input pl-10"
                          placeholder="Enter your enrollment number"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="ui-label">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="ui-input pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="ui-btn-primary w-full">
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-secondary hover:underline">
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
