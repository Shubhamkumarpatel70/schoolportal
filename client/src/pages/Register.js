import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import {
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
  FiUserPlus
} from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    enrollmentNumber: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingEnrollment, setValidatingEnrollment] = useState(false);
  const [enrollmentValid, setEnrollmentValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEnrollmentNumber = async (enrollmentNumber) => {
    if (!enrollmentNumber) {
      setEnrollmentValid(false);
      return;
    }
    setValidatingEnrollment(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/enrollmentNumbers/check/${enrollmentNumber}`);
      if (res.data.valid) {
        setEnrollmentValid(true);
        if (res.data.name) {
          setFormData((prev) => (prev.name ? prev : { ...prev, name: res.data.name }));
        }
        setError('');
      }
    } catch (validationError) {
      setEnrollmentValid(false);
      setError(validationError.response?.data?.message || 'Invalid enrollment number');
    } finally {
      setValidatingEnrollment(false);
    }
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

    if (!formData.enrollmentNumber) {
      setError('Enrollment number is required');
      return;
    }

    if (!enrollmentValid) {
      setError('Please enter a valid enrollment number');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      const userRole = result.user?.role || 'student';
      navigate(`/${userRole}/dashboard`);
    } else {
      setError(result.message || 'Registration failed');
    }

    setLoading(false);
  };

  const passwordStrength = useMemo(() => {
    const value = formData.password || '';
    const score = [
      value.length >= 8,
      /[A-Z]/.test(value),
      /[a-z]/.test(value),
      /\d/.test(value),
      /[^A-Za-z0-9]/.test(value)
    ].filter(Boolean).length;

    if (value.length === 0) {
      return { label: 'Not set', color: 'bg-slate-200', width: 'w-0' };
    }
    if (score <= 2) {
      return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
    }
    if (score === 3 || score === 4) {
      return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' };
    }
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  }, [formData.password]);

  return (
    <div className="ui-shell">
      <Header />

      <div className="flex-grow py-12 sm:py-16">
        <div className="ui-container">
          <div className="mx-auto max-w-6xl overflow-hidden ui-card">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <aside className="relative overflow-hidden bg-gradient-to-br from-secondary to-primary p-8 text-white lg:col-span-2 sm:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%)]" />
                <div className="relative">
                  <p className="ui-badge border-white/40 bg-white/15 text-white">Admissions</p>
                  <h2 className="mt-5 text-3xl font-bold leading-tight">Start your student profile in minutes</h2>
                  <p className="mt-4 text-sm leading-7 text-white/90">
                    Complete registration with your enrollment number to unlock portal access, results, notices, and academic updates.
                  </p>
                  <ul className="mt-8 space-y-4 text-sm text-white/90">
                    <li className="flex items-center gap-2">
                      <FiShield />
                      <span>Verified enrollment onboarding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheckCircle />
                      <span>Role-based student account setup</span>
                    </li>
                  </ul>
                </div>
              </aside>

              <div className="p-6 sm:p-8 lg:col-span-3">
                <div className="mb-8 text-center">
                  <FiUserPlus className="mx-auto mb-4 text-5xl text-secondary" />
                  <h2 className="text-3xl font-bold text-slate-900">Student Registration</h2>
                  <p className="mt-2 text-sm text-slate-600">Create your account to access your school portal.</p>
                </div>

                {error && <div className="ui-status-error mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                          placeholder="Enter your name"
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
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="ui-label">Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="ui-input pl-10 pr-10"
                          placeholder="Enter password"
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
                      <div className="mt-3">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all`} />
                        </div>
                        <p className="mt-1 text-xs font-medium text-slate-500">Strength: {passwordStrength.label}</p>
                      </div>
                    </div>

                    <div>
                      <label className="ui-label">Confirm Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="ui-input pl-10 pr-10"
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="ui-label">
                        Enrollment Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="enrollmentNumber"
                          value={formData.enrollmentNumber}
                          onChange={(e) => {
                            handleChange(e);
                            validateEnrollmentNumber(e.target.value);
                          }}
                          required
                          className={`ui-input ${
                            enrollmentValid ? 'border-green-500' : formData.enrollmentNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter enrollment number"
                        />
                        {validatingEnrollment && (
                          <span className="absolute right-3 top-3.5 text-sm text-slate-500">Checking...</span>
                        )}
                        {enrollmentValid && !validatingEnrollment && (
                          <FiCheckCircle className="absolute right-3 top-3.5 text-green-500" />
                        )}
                      </div>
                      {enrollmentValid && <p className="mt-1 text-sm text-green-600">Valid enrollment number</p>}
                    </div>

                    <div>
                      <label className="ui-label">Phone</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="ui-input pl-10"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="ui-label">Address</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="ui-input pl-10"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="ui-btn-primary w-full">
                    {loading ? 'Registering...' : 'Register'}
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
