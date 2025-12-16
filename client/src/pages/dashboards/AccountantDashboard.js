import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import {
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiBell,
  FiPlus,
  FiTrash2,
  FiEdit
} from 'react-icons/fi';

const AccountantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [fines, setFines] = useState([]);
  const [students, setStudents] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [notices, setNotices] = useState([]);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeForm, setNoticeForm] = useState({ title: '', message: '', tag: 'normal' });
  const [feeForm, setFeeForm] = useState({
    selectedClass: '', selectedStudent: '', studentName: '', amount: '', feesType: 'monthly',
    month: '', installmentNumber: '', dueDate: '', remarks: '', feeCategory: 'regular', transportAmount: ''
  });

  useEffect(() => {
    if (user?.role !== 'accountant') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate, activeTab]);

  const fetchData = async () => {
    try {
      const [eventsRes, notificationsRes, classesRes, feesRes, finesRes, studentsRes, noticesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/events`),
        axios.get(`${API_BASE_URL}/api/notifications`),
        axios.get(`${API_BASE_URL}/api/classes`),
        axios.get(`${API_BASE_URL}/api/fees`),
        axios.get(`${API_BASE_URL}/api/fines`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students`),
        axios.get(`${API_BASE_URL}/api/notices`)
      ]);
      setEvents(eventsRes.data.slice(0, 5));
      setNotifications(notificationsRes.data.slice(0, 5));
      setClasses(classesRes.data);
      setFees(feesRes.data);
      setFines(finesRes.data || []);
      setStudents(studentsRes.data || []);
      setNotices(noticesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchStudents = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error('Error searching students:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchStudents(studentSearchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [studentSearchQuery]);

  const fetchStudentsByClass = async (className) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/fees/class/${className}`);
      setClassStudents(res.data);
    } catch (error) {
      console.error('Error fetching students by class:', error);
      setClassStudents([]);
    }
  };

  const handleSubmitFee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/fees`, {
        studentId: feeForm.selectedStudent,
        amount: feeForm.amount,
        feesType: feeForm.feesType,
        month: feeForm.month,
        installmentNumber: feeForm.installmentNumber,
        dueDate: feeForm.dueDate,
        remarks: feeForm.remarks,
        feeCategory: feeForm.feeCategory
      });
      
      // If transport fee is provided and student opted for transport, create transport fee
      if (feeForm.feeCategory === 'regular' && feeForm.transportAmount) {
        const selectedStudent = students.find(s => s._id.toString() === feeForm.selectedStudent);
        if (selectedStudent && selectedStudent.studentType === 'dayScholar' && selectedStudent.transportOpted) {
          await axios.post(`${API_BASE_URL}/api/fees`, {
            studentId: feeForm.selectedStudent,
            amount: feeForm.transportAmount,
            feesType: feeForm.feesType,
            month: feeForm.month,
            installmentNumber: feeForm.installmentNumber,
            dueDate: feeForm.dueDate,
            remarks: 'Transport Fee',
            feeCategory: 'transport'
          });
        }
      }
      
      setShowFeeForm(false);
      setFeeForm({
        selectedClass: '', selectedStudent: '', studentName: '', amount: '', feesType: 'monthly',
        month: '', installmentNumber: '', dueDate: '', remarks: '', feeCategory: 'regular', transportAmount: ''
      });
      setClassStudents([]);
      setStudentSearchQuery('');
      setSearchResults([]);
      fetchData();
      alert('Fee added successfully!');
    } catch (error) {
      console.error('Error creating fee:', error);
      alert(error.response?.data?.message || 'Error creating fee');
    }
  };

  const handleDeleteFee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/fees/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting fee:', error);
    }
  };

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await axios.put(`${API_BASE_URL}/api/notices/${editingNotice._id}`, noticeForm);
        setEditingNotice(null);
        alert('Notice updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/notices`, noticeForm);
        alert('Notice added successfully!');
      }
      setShowNoticeForm(false);
      setNoticeForm({ title: '', message: '', tag: 'normal' });
      fetchData();
    } catch (error) {
      console.error('Error creating/updating notice:', error);
      alert(error.response?.data?.message || 'Error saving notice');
    }
  };

  const handleEditNotice = (notice) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      message: notice.message,
      tag: notice.tag || 'normal'
    });
    setShowNoticeForm(true);
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/notices/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting notice:', error);
      alert('Error deleting notice');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-1">
      <Header />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-3 mb-2">Accountant Dashboard</h1>
            <p className="text-neutral-3/70">Welcome back, {user?.name}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-3/70 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-neutral-3">
                    ₹{fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <FiDollarSign className="text-3xl text-green-600" />
              </div>
            </div>
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-3/70 text-sm">Paid Fees</p>
                  <p className="text-2xl font-bold text-neutral-3">
                    ₹{fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <FiCheckCircle className="text-3xl text-secondary" />
              </div>
            </div>
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-3/70 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-neutral-3">
                    ₹{fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + (f.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <FiAlertCircle className="text-3xl text-accent" />
              </div>
            </div>
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-3/70 text-sm">Students</p>
                  <p className="text-2xl font-bold text-neutral-3">{students.length}</p>
                </div>
                <FiUsers className="text-3xl text-secondary" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Events */}
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-3 flex items-center space-x-2">
                  <FiCalendar />
                  <span>Upcoming Events</span>
                </h2>
              </div>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-neutral-3/50 text-center py-4">No upcoming events</p>
                ) : (
                  events.map((event) => (
                    <div key={event._id} className="border-l-4 border-secondary pl-4 py-2">
                      <h3 className="font-semibold text-neutral-3">{event.title}</h3>
                      <p className="text-sm text-neutral-3/70">{new Date(event.date).toLocaleDateString()}</p>
                      {event.location && (
                        <p className="text-sm text-neutral-3/50">{event.location}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-3 flex items-center space-x-2">
                  <FiBell />
                  <span>Recent Notifications</span>
                </h2>
              </div>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-neutral-3/50 text-center py-4">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification._id} className="border-b border-neutral-1 pb-3 last:border-0">
                      <h3 className="font-semibold text-sm text-neutral-3">{notification.title}</h3>
                      <p className="text-xs text-neutral-3/70 mt-1">{notification.message}</p>
                      <p className="text-xs text-neutral-3/50 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-neutral-2 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap border-b border-neutral-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition ${
                  activeTab === 'dashboard'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-3/70 hover:text-primary'
                }`}
              >
                <FiTrendingUp />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('fees')}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition ${
                  activeTab === 'fees'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-3/70 hover:text-primary'
                }`}
              >
                <FiDollarSign />
                <span>Fees</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Upcoming Events */}
                <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-neutral-3 flex items-center space-x-2">
                      <FiCalendar />
                      <span>Upcoming Events</span>
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {events.length === 0 ? (
                      <p className="text-neutral-3/50 text-center py-4">No upcoming events</p>
                    ) : (
                      events.map((event) => (
                        <div key={event._id} className="border-l-4 border-secondary pl-4 py-2">
                          <h3 className="font-semibold text-neutral-3">{event.title}</h3>
                          <p className="text-sm text-neutral-3/70">{new Date(event.date).toLocaleDateString()}</p>
                          {event.location && (
                            <p className="text-sm text-neutral-3/50">{event.location}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-neutral-3 flex items-center space-x-2">
                      <FiBell />
                      <span>Recent Notifications</span>
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <p className="text-neutral-3/50 text-center py-4">No notifications</p>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification._id} className="border-b border-neutral-1 pb-3 last:border-0">
                          <h3 className="font-semibold text-sm text-neutral-3">{notification.title}</h3>
                          <p className="text-xs text-neutral-3/70 mt-1">{notification.message}</p>
                          <p className="text-xs text-neutral-3/50 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-neutral-3 mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-1">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-3">Student</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-3">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-3">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.slice(0, 10).map((fee) => (
                        <tr key={fee._id} className="border-b border-neutral-1">
                          <td className="py-3 px-4 text-sm text-neutral-3">{fee.studentId?.studentName || 'N/A'}</td>
                          <td className="py-3 px-4 text-sm text-neutral-3">₹{fee.amount}</td>
                          <td className="py-3 px-4 text-sm text-neutral-3">{new Date(fee.dueDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                              fee.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'fees' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-3">Fees Management</h2>
                <button onClick={() => setShowFeeForm(!showFeeForm)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                  <FiPlus />
                  <span>Add Fee</span>
                </button>
              </div>
              {showFeeForm && (
                <form onSubmit={handleSubmitFee} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-neutral-3/70 mb-1">Select Class</label>
                      <select
                        value={feeForm.selectedClass}
                        onChange={async (e) => {
                          setFeeForm({...feeForm, selectedClass: e.target.value, selectedStudent: '', studentName: ''});
                          if (e.target.value) {
                            await fetchStudentsByClass(e.target.value);
                          } else {
                            setClassStudents([]);
                          }
                        }}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">Select Class</option>
                        {classes.map((c) => (
                          <option key={c._id} value={c.className}>{c.className} {c.section ? `- ${c.section}` : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-neutral-3/70 mb-1">Select Student (Roll/Enrollment Number)</label>
                      <input
                        type="text"
                        placeholder="Search by name, roll number, enrollment number, or mobile"
                        value={studentSearchQuery}
                        onChange={(e) => {
                          setStudentSearchQuery(e.target.value);
                          if (!e.target.value) {
                            setSearchResults([]);
                            setFeeForm({...feeForm, selectedStudent: '', studentName: ''});
                          }
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      {(searchResults.length > 0 || (studentSearchQuery && searchResults.length === 0 && studentSearchQuery.length >= 2)) && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {searchResults.length > 0 ? (
                            searchResults.map((s) => (
                              <div
                                key={s._id}
                                onClick={() => {
                                  setFeeForm({...feeForm, selectedStudent: s._id, studentName: s.studentName});
                                  setStudentSearchQuery(`${s.rollNumber} / ${s.enrollmentNumber} - ${s.studentName}`);
                                  setSearchResults([]);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {s.rollNumber} / {s.enrollmentNumber} - {s.studentName} ({s.class})
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">No students found</div>
                          )}
                        </div>
                      )}
                      {!studentSearchQuery && (
                        <select
                          value={feeForm.selectedStudent}
                          onChange={(e) => {
                            const student = classStudents.find(s => s._id === e.target.value);
                            setFeeForm({...feeForm, selectedStudent: e.target.value, studentName: student ? student.studentName : ''});
                          }}
                          disabled={!feeForm.selectedClass || classStudents.length === 0}
                          className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100 mt-2"
                        >
                          <option value="">Or select from class</option>
                          {classStudents.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.rollNumber} / {s.enrollmentNumber} - {s.studentName}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {feeForm.studentName && (
                      <div className="md:col-span-2">
                        <label className="block text-sm text-neutral-3/70 mb-1">Student Name</label>
                        <input type="text" value={feeForm.studentName} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-neutral-3/70 mb-1">Fees Type</label>
                      <select
                        value={feeForm.feesType}
                        onChange={(e) => setFeeForm({...feeForm, feesType: e.target.value})}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="installment">Installment</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                    {feeForm.feesType === 'monthly' && (
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Month</label>
                        <input type="text" placeholder="e.g., January 2024" value={feeForm.month} onChange={(e) => setFeeForm({...feeForm, month: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                    )}
                    {feeForm.feesType === 'installment' && (
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Installment Number</label>
                        <input type="number" placeholder="e.g., 1, 2, 3" value={feeForm.installmentNumber} onChange={(e) => setFeeForm({...feeForm, installmentNumber: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-neutral-3/70 mb-1">Amount</label>
                      <input type="number" placeholder="Fee Amount" value={feeForm.amount} onChange={(e) => setFeeForm({...feeForm, amount: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    {feeForm.selectedStudent && (() => {
                      const selectedStudent = students.find(s => s._id === feeForm.selectedStudent) || classStudents.find(s => s._id === feeForm.selectedStudent);
                      if (selectedStudent && selectedStudent.studentType === 'dayScholar' && selectedStudent.transportOpted) {
                        return (
                          <div>
                            <label className="block text-sm text-neutral-3/70 mb-1">Transport Fee Amount (Optional)</label>
                            <input type="number" placeholder="Transport Fee" value={feeForm.transportAmount} onChange={(e) => setFeeForm({...feeForm, transportAmount: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            <p className="text-xs text-neutral-3/50 mt-1">Student has opted for transport</p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div>
                      <label className="block text-sm text-neutral-3/70 mb-1">Due Date</label>
                      <input type="date" value={feeForm.dueDate} onChange={(e) => setFeeForm({...feeForm, dueDate: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-neutral-3/70 mb-1">Remarks (Optional)</label>
                      <textarea value={feeForm.remarks} onChange={(e) => setFeeForm({...feeForm, remarks: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="2" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Submit Fee</button>
                    <button type="button" onClick={() => {
                      setShowFeeForm(false);
                      setFeeForm({
                        selectedClass: '', selectedStudent: '', studentName: '', amount: '', feesType: 'monthly',
                        month: '', installmentNumber: '', dueDate: '', remarks: '', feeCategory: 'regular', transportAmount: ''
                      });
                      setClassStudents([]);
                      setStudentSearchQuery('');
                      setSearchResults([]);
                    }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}
              <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Due Date</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f) => (
                      <tr key={f._id} className="border-b border-neutral-1">
                        <td className="px-4 py-3 text-neutral-3">{f.studentId?.studentName || 'N/A'}</td>
                        <td className="px-4 py-3 text-neutral-3">{f.feesType || 'monthly'}</td>
                        <td className="px-4 py-3 text-neutral-3 capitalize">{f.feeCategory || 'regular'}</td>
                        <td className="px-4 py-3 text-neutral-3">₹{f.amount}</td>
                        <td className="px-4 py-3 text-neutral-3">{new Date(f.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            f.status === 'paid' ? 'bg-green-100 text-green-800' :
                            f.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteFee(f._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-3">Notices</h2>
                <button
                  onClick={() => {
                    setShowNoticeForm(!showNoticeForm);
                    if (!showNoticeForm) {
                      setEditingNotice(null);
                      setNoticeForm({ title: '', message: '', tag: 'normal' });
                    }
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                >
                  <FiBell />
                  <span>Add Notice</span>
                </button>
              </div>
              {showNoticeForm && (
                <form onSubmit={handleSubmitNotice} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingNotice ? 'Edit Notice' : 'Add Notice'}</h3>
                  <input
                    type="text"
                    placeholder="Notice Title"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    placeholder="Notice Message"
                    value={noticeForm.message}
                    onChange={(e) => setNoticeForm({...noticeForm, message: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="4"
                  />
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-2">Tag</label>
                    <select
                      value={noticeForm.tag}
                      onChange={(e) => setNoticeForm({...noticeForm, tag: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="normal">Normal</option>
                      <option value="new">New</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">
                      {editingNotice ? 'Update' : 'Add'} Notice
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNoticeForm(false);
                        setEditingNotice(null);
                        setNoticeForm({ title: '', message: '', tag: 'normal' });
                      }}
                      className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              <div className="space-y-4">
                {notices.length === 0 ? (
                  <p className="text-neutral-3/70 text-center py-8">No notices added yet</p>
                ) : (
                  notices.map((notice) => (
                    <div
                      key={notice._id}
                      className={`bg-neutral-2 p-4 rounded-lg border-l-4 ${
                        notice.tag === 'urgent'
                          ? 'border-red-500'
                          : notice.tag === 'new'
                          ? 'border-green-500'
                          : 'border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-neutral-3 text-lg">{notice.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              notice.tag === 'urgent'
                                ? 'bg-red-100 text-red-800'
                                : notice.tag === 'new'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {notice.tag === 'urgent' ? 'Urgent' : notice.tag === 'new' ? 'New' : 'Normal'}
                          </span>
                          <button
                            onClick={() => handleEditNotice(notice)}
                            className="text-secondary hover:text-secondary-600"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(notice._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-3/70 mb-2">{notice.message}</p>
                      <p className="text-xs text-neutral-3/50">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountantDashboard;

