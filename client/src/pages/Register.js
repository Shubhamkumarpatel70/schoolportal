import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { FiUserPlus, FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi';

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
      const res = await axios.get(`http://localhost:5000/api/enrollmentNumbers/check/${enrollmentNumber}`);
      if (res.data.valid) {
        setEnrollmentValid(true);
        if (res.data.name && !formData.name) {
          setFormData({ ...formData, name: res.data.name });
        }
        setError('');
      }
    } catch (error) {
      setEnrollmentValid(false);
      setError(error.response?.data?.message || 'Invalid enrollment number');
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-neutral-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-neutral-2 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FiUserPlus className="text-5xl text-secondary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2 text-neutral-3">Register</h2>
              <p className="text-neutral-3/70">Create your account to get started.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="Enter your name"
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
                      placeholder="Enter your email"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                      placeholder="Enter password"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-3 font-semibold mb-2">
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2 ${
                        enrollmentValid ? 'border-green-500' : formData.enrollmentNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter enrollment number"
                    />
                    {validatingEnrollment && (
                      <span className="absolute right-3 top-3 text-neutral-3/50 text-sm">Checking...</span>
                    )}
                    {enrollmentValid && !validatingEnrollment && (
                      <FiCheckCircle className="absolute right-3 top-3 text-green-500" />
                    )}
                  </div>
                  {enrollmentValid && (
                    <p className="text-green-600 text-sm mt-1">✓ Valid enrollment number</p>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-3 font-semibold mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 text-neutral-3/40" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-3 font-semibold mb-2">
                  Address
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-neutral-3/40" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register'}
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

export default Register;

