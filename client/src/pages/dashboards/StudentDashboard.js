import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import {
  FiBook, FiCalendar, FiBell, FiFileText, FiAward, FiClock, FiUser, FiDollarSign, FiUsers
} from 'react-icons/fi';

const StudentDashboard = () => {
  const { user, changePassword, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [studentData, setStudentData] = useState(null);
  const [fees, setFees] = useState([]);
  const [fines, setFines] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [classTeacher, setClassTeacher] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    enrollmentNumber: '',
    name: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user?.role !== 'student') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    // Check if user has default password after data is loaded
    if (user?.isDefaultPassword && studentData) {
      setShowChangePassword(true);
      setPasswordForm({
        enrollmentNumber: studentData.enrollmentNumber || user?.studentId || '',
        name: studentData.studentName || user?.name || '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user, studentData]);

  useEffect(() => {
    if (studentData?.class) {
      fetchClassTeacher();
    }
  }, [studentData]);

  const fetchData = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) {
        console.error('User ID not found');
        return;
      }
      const [studentRes, feesRes, finesRes, eventsRes, notificationsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/students/${userId}`),
        axios.get(`${API_BASE_URL}/api/fees/student/${userId}`),
        axios.get(`${API_BASE_URL}/api/fines/student/${userId}`).catch(() => ({ data: [] })),
        axios.get('${API_BASE_URL}/api/events'),
        axios.get('${API_BASE_URL}/api/notifications').catch(() => ({ data: [] }))
      ]);
      setStudentData(studentRes.data);
      setFees(feesRes.data);
      setFines(finesRes.data || []);
      setEvents(eventsRes.data.slice(0, 10));
      setNotifications(notificationsRes.data?.slice(0, 10) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchClassTeacher = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/classTeachers/class/${studentData.class}`);
      setClassTeacher(res.data);
    } catch (error) {
      console.error('Error fetching class teacher:', error);
      setClassTeacher(null);
    }
  };

  const handlePayFee = async (feeId, paymentData) => {
    try {
      await axios.put(`${API_BASE_URL}/api/fees/${feeId}/pay`, paymentData);
      fetchData();
      alert('Fee payment submitted successfully!');
    } catch (error) {
      console.error('Error paying fee:', error);
      alert('Error submitting payment');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    try {
      // For default password, pass null as currentPassword (backend will skip validation)
      const currentPassword = user?.isDefaultPassword ? null : passwordForm.enrollmentNumber;
      const userId = user?._id || user?.id;
      const result = await changePassword(userId, currentPassword, passwordForm.newPassword);
      if (result.success) {
        alert('Password changed successfully! Please login again with your new password.');
        setShowChangePassword(false);
        setPasswordForm({
          enrollmentNumber: '',
          name: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Refresh user data
        await fetchUser();
      } else {
        alert(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'fee', label: 'Fee Submission', icon: FiDollarSign },
    { id: 'classTeacher', label: 'Class Teacher', icon: FiUsers },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'events', label: 'Events', icon: FiCalendar }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-3 mb-6">My Profile</h2>
            
            {/* Change Password Modal/Form - Show if default password */}
            {showChangePassword && user?.isDefaultPassword && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-400 text-xl">⚠️</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                      Change Your Default Password
                    </h3>
                    <p className="text-sm text-yellow-700 mb-4">
                      You are using the default password. Please change it to secure your account.
                    </p>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-yellow-800 mb-1">Enrollment Number</label>
                          <input
                            type="text"
                            value={passwordForm.enrollmentNumber}
                            disabled
                            className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-yellow-50 text-yellow-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-yellow-800 mb-1">Name</label>
                          <input
                            type="text"
                            value={passwordForm.name}
                            disabled
                            className="w-full px-4 py-2 border border-yellow-300 rounded-lg bg-yellow-50 text-yellow-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-yellow-800 mb-1">New Password <span className="text-red-500">*</span></label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            required
                            minLength={6}
                            className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                            placeholder="Enter new password (min 6 characters)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-yellow-800 mb-1">Re-enter New Password <span className="text-red-500">*</span></label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            required
                            minLength={6}
                            className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                            placeholder="Re-enter new password"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 font-semibold"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            
            {studentData ? (
              <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-neutral-3/70 text-sm">Student Name</label>
                    <p className="text-neutral-3 font-semibold">{studentData.studentName}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Class</label>
                    <p className="text-neutral-3 font-semibold">{studentData.class}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Roll Number</label>
                    <p className="text-neutral-3 font-semibold">{studentData.rollNumber}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Enrollment Number</label>
                    <p className="text-neutral-3 font-semibold">{studentData.enrollmentNumber}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Father's Name</label>
                    <p className="text-neutral-3 font-semibold">{studentData.fathersName}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Mother's Name</label>
                    <p className="text-neutral-3 font-semibold">{studentData.mothersName}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Mobile Number</label>
                    <p className="text-neutral-3 font-semibold">{studentData.mobileNumber}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Email</label>
                    <p className="text-neutral-3 font-semibold">
                      {user?.email && !user.email.includes('@school.com') ? user.email : 'Not Set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Student Type</label>
                    <p className="text-neutral-3 font-semibold capitalize">
                      {studentData.studentType === 'dayScholar' ? 'Day Scholar' : 'Hosteler'}
                      {studentData.studentType === 'dayScholar' && studentData.busRoute && ` (${studentData.busRoute})`}
                    </p>
                  </div>
                  {classTeacher && (
                    <div className="md:col-span-2">
                      <label className="text-neutral-3/70 text-sm">Class Teacher</label>
                      <p className="text-neutral-3 font-semibold">
                        {classTeacher.teacherId?.name || 'N/A'}
                        {classTeacher.teacherId?.email && ` (${classTeacher.teacherId.email})`}
                      </p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="text-neutral-3/70 text-sm">Address</label>
                    <p className="text-neutral-3 font-semibold">{studentData.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-2 rounded-lg shadow-md p-6 text-center">
                <p className="text-neutral-3/70">Loading profile data...</p>
              </div>
            )}
          </div>
        );

      case 'fee':
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-3 mb-6">Fee Submission</h2>
            <div className="space-y-4">
              {fees.length === 0 ? (
                <div className="bg-neutral-2 rounded-lg shadow-md p-6 text-center">
                  <p className="text-neutral-3/70">No fee records found</p>
                </div>
              ) : (
                <>
                  {fees.filter(f => f.feeCategory !== 'transport').map((fee) => (
                    <div key={fee._id} className="bg-neutral-2 rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-3">Fee Payment - {fee.feesType || 'monthly'}</h3>
                          <p className="text-sm text-neutral-3/70">Amount: ₹{fee.amount}</p>
                          <p className="text-sm text-neutral-3/70">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                          {fee.month && <p className="text-sm text-neutral-3/70">Month: {fee.month}</p>}
                          {fee.installmentNumber && <p className="text-sm text-neutral-3/70">Installment: {fee.installmentNumber}</p>}
                          {fee.remarks && <p className="text-sm text-neutral-3/70 mt-1">Remarks: {fee.remarks}</p>}
                        </div>
                        <span className={`px-3 py-1 rounded text-sm ${
                          fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                          fee.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {fee.status.toUpperCase()}
                        </span>
                      </div>
                      {fee.status === 'paid' && (
                        <div className="mt-4 p-3 bg-green-50 rounded">
                          <p className="text-sm text-green-700">Paid on: {new Date(fee.paidDate).toLocaleDateString()}</p>
                          {fee.paymentMethod && <p className="text-sm text-green-700">Payment Method: {fee.paymentMethod}</p>}
                          {fee.transactionId && <p className="text-sm text-green-700">Transaction ID: {fee.transactionId}</p>}
                        </div>
                      )}
                      {fee.status === 'pending' && (
                        <button
                          onClick={() => {
                            const paymentMethod = prompt('Enter payment method (e.g., Online, Cash, Cheque):');
                            const transactionId = prompt('Enter transaction ID (if applicable):');
                            if (paymentMethod) {
                              handlePayFee(fee._id, { paymentMethod, transactionId: transactionId || '' });
                            }
                          }}
                          className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  ))}
                  {fees.filter(f => f.feeCategory === 'transport').length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-neutral-3 mb-4">Transport Fees</h3>
                      {fees.filter(f => f.feeCategory === 'transport').map((fee) => (
                        <div key={fee._id} className="bg-neutral-2 rounded-lg shadow-md p-6 mb-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-3">Transport Fee - {fee.feesType || 'monthly'}</h3>
                              <p className="text-sm text-neutral-3/70">Amount: ₹{fee.amount}</p>
                              <p className="text-sm text-neutral-3/70">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                              {fee.month && <p className="text-sm text-neutral-3/70">Month: {fee.month}</p>}
                            </div>
                            <span className={`px-3 py-1 rounded text-sm ${
                              fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                              fee.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {fee.status.toUpperCase()}
                            </span>
                          </div>
                          {fee.status === 'paid' && (
                            <div className="mt-4 p-3 bg-green-50 rounded">
                              <p className="text-sm text-green-700">Paid on: {new Date(fee.paidDate).toLocaleDateString()}</p>
                              {fee.paymentMethod && <p className="text-sm text-green-700">Payment Method: {fee.paymentMethod}</p>}
                            </div>
                          )}
                          {fee.status === 'pending' && (
                            <button
                              onClick={() => {
                                const paymentMethod = prompt('Enter payment method (e.g., Online, Cash, Cheque):');
                                const transactionId = prompt('Enter transaction ID (if applicable):');
                                if (paymentMethod) {
                                  handlePayFee(fee._id, { paymentMethod, transactionId: transactionId || '' });
                                }
                              }}
                              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {fines.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-neutral-3 mb-4">Fines</h3>
                      {fines.map((fine) => (
                        <div key={fine._id} className={`bg-neutral-2 rounded-lg shadow-md p-6 mb-4 border-l-4 ${fine.fineType === 'late' ? 'border-red-500' : 'border-orange-500'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-neutral-3">Fine</h3>
                                {fine.fineType === 'late' && (
                                  <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">Late Fine</span>
                                )}
                              </div>
                              <p className="text-sm text-neutral-3/70">Amount: ₹{fine.amount}</p>
                              <p className="text-sm text-neutral-3/70">Reason: {fine.reason}</p>
                              <p className="text-sm text-neutral-3/70">Due Date: {new Date(fine.dueDate).toLocaleDateString()}</p>
                              {fine.remarks && <p className="text-sm text-neutral-3/70 mt-1">Remarks: {fine.remarks}</p>}
                            </div>
                            <span className={`px-3 py-1 rounded text-sm ${
                              fine.status === 'paid' ? 'bg-green-100 text-green-800' :
                              fine.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {fine.status.toUpperCase()}
                            </span>
                          </div>
                          {fine.status === 'paid' && (
                            <div className="mt-4 p-3 bg-green-50 rounded">
                              <p className="text-sm text-green-700">Paid on: {new Date(fine.paidDate).toLocaleDateString()}</p>
                              {fine.paymentMethod && <p className="text-sm text-green-700">Payment Method: {fine.paymentMethod}</p>}
                            </div>
                          )}
                          {fine.status === 'pending' && (
                            <button
                              onClick={async () => {
                                const paymentMethod = prompt('Enter payment method (e.g., Online, Cash, Cheque):');
                                const transactionId = prompt('Enter transaction ID (if applicable):');
                                if (paymentMethod) {
                                  try {
                                    await axios.put(`${API_BASE_URL}/api/fines/${fine._id}/pay`, { paymentMethod, transactionId: transactionId || '' });
                                    fetchData();
                                    alert('Fine payment submitted successfully!');
                                  } catch (error) {
                                    console.error('Error paying fine:', error);
                                    alert('Error submitting payment');
                                  }
                                }
                              }}
                              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-3 mb-6">Notifications</h2>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="bg-neutral-2 rounded-lg shadow-md p-6 text-center">
                  <p className="text-neutral-3/70">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification._id} className="bg-neutral-2 rounded-lg shadow-md p-6 border-l-4 border-secondary">
                    <h3 className="font-semibold text-neutral-3 mb-2">{notification.title}</h3>
                    <p className="text-sm text-neutral-3/70 mb-2">{notification.message}</p>
                    <p className="text-xs text-neutral-3/50">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'classTeacher':
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-3 mb-6">Class Teacher</h2>
            {classTeacher ? (
              <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-neutral-3/70 text-sm">Teacher Name</label>
                    <p className="text-neutral-3 font-semibold text-lg">{classTeacher.teacherId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Email</label>
                    <p className="text-neutral-3 font-semibold">{classTeacher.teacherId?.email || 'Not Set'}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Contact Number</label>
                    <p className="text-neutral-3 font-semibold">{classTeacher.teacherId?.phone || 'Not Set'}</p>
                  </div>
                  <div>
                    <label className="text-neutral-3/70 text-sm">Class</label>
                    <p className="text-neutral-3 font-semibold">{classTeacher.className} {classTeacher.section ? `- ${classTeacher.section}` : ''}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-2 rounded-lg shadow-md p-6 text-center">
                <p className="text-neutral-3/70">No class teacher assigned</p>
              </div>
            )}
          </div>
        );

      case 'events':
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-3 mb-6">Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.length === 0 ? (
                <div className="bg-neutral-2 rounded-lg shadow-md p-6 text-center md:col-span-2">
                  <p className="text-neutral-3/70">No upcoming events</p>
                </div>
              ) : (
                events.map((event) => (
                  <div key={event._id} className="bg-neutral-2 rounded-lg shadow-md p-6 border-l-4 border-secondary">
                    <h3 className="font-semibold text-neutral-3 mb-2">{event.title}</h3>
                    <p className="text-sm text-neutral-3/70 mb-2">{event.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-3/50">
                        <FiCalendar className="inline mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      {event.location && (
                        <p className="text-xs text-neutral-3/50">
                          <FiClock className="inline mr-1" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-1">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-3 mb-2">Student Dashboard</h1>
            <p className="text-neutral-3/70">Welcome back, {user?.name}</p>
          </div>

          {/* Tabs */}
          <div className="bg-neutral-2 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap border-b border-neutral-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-semibold transition ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-neutral-3/70 hover:text-primary'
                    }`}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
