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
  const [showFineForm, setShowFineForm] = useState(false);
  const [editingFine, setEditingFine] = useState(null);
  const [fineForm, setFineForm] = useState({
    selectedStudent: '', studentName: '', amount: '', reason: '', dueDate: '', remarks: '', fineType: 'other'
  });
  const [fineStudentSearchQuery, setFineStudentSearchQuery] = useState('');
  const [fineSearchResults, setFineSearchResults] = useState([]);
  const [fineFilters, setFineFilters] = useState({
    class: '', status: '', fineType: '', studentSearch: ''
  });
  const [feeFilters, setFeeFilters] = useState({
    class: '', status: '', feeCategory: '', feesType: '', studentSearch: ''
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

  const searchStudentsForFine = async (query) => {
    if (!query || query.length < 2) {
      setFineSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students/search?q=${encodeURIComponent(query)}`);
      setFineSearchResults(res.data);
    } catch (error) {
      console.error('Error searching students:', error);
      setFineSearchResults([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === 'fees') {
        searchStudents(studentSearchQuery);
      } else if (activeTab === 'fines') {
        searchStudentsForFine(fineStudentSearchQuery);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [studentSearchQuery, fineStudentSearchQuery, activeTab]);

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

  const handleSubmitFine = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!fineForm.selectedStudent) {
      alert('Please select a student');
      return;
    }
    if (!fineForm.amount || parseFloat(fineForm.amount) <= 0) {
      alert('Please enter a valid fine amount');
      return;
    }
    if (!fineForm.reason || fineForm.reason.trim() === '') {
      alert('Please enter a reason for the fine');
      return;
    }
    if (!fineForm.dueDate) {
      alert('Please select a due date');
      return;
    }

    try {
      // Prepare the data for the API - map selectedStudent to studentId
      const fineData = {
        studentId: fineForm.selectedStudent,
        amount: parseFloat(fineForm.amount),
        reason: fineForm.reason.trim(),
        dueDate: fineForm.dueDate,
        remarks: fineForm.remarks || '',
        fineType: fineForm.fineType || 'other'
      };

      if (editingFine) {
        await axios.put(`${API_BASE_URL}/api/fines/${editingFine._id}`, fineData);
        setEditingFine(null);
        alert('Fine updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/fines`, fineData);
        alert('Fine added successfully!');
      }
      setShowFineForm(false);
      setFineForm({
        selectedStudent: '', studentName: '', amount: '', reason: '', dueDate: '', remarks: '', fineType: 'other'
      });
      setFineStudentSearchQuery('');
      setFineSearchResults([]);
      fetchData();
    } catch (error) {
      console.error('Error creating/updating fine:', error);
      const errorMessage = error.response?.data?.message || 'Error saving fine';
      alert(errorMessage);
    }
  };

  const handleEditFine = (fine) => {
    setEditingFine(fine);
    const student = students.find(s => s._id.toString() === fine.studentId._id?.toString() || s._id.toString() === fine.studentId.toString());
    setFineForm({
      selectedStudent: student?._id || '',
      studentName: student?.studentName || fine.studentId?.studentName || '',
      amount: fine.amount,
      reason: fine.reason,
      fineType: fine.fineType || 'other',
      dueDate: fine.dueDate ? new Date(fine.dueDate).toISOString().split('T')[0] : '',
      remarks: fine.remarks || ''
    });
    if (student) {
      setFineStudentSearchQuery(`${student.rollNumber || 'N/A'} / ${student.enrollmentNumber} - ${student.studentName}`);
    }
    setShowFineForm(true);
  };

  const handleDeleteFine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fine?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/fines/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting fine:', error);
      alert('Error deleting fine');
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
              <button
                onClick={() => setActiveTab('fines')}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition ${
                  activeTab === 'fines'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-3/70 hover:text-primary'
                }`}
              >
                <FiDollarSign />
                <span>Fines</span>
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition ${
                  activeTab === 'notices'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-3/70 hover:text-primary'
                }`}
              >
                <FiBell />
                <span>Notices</span>
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
              
              {/* Filter Options */}
              <div className="bg-neutral-2 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">Filter Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-2">Filter by Class</label>
                    <select
                      value={feeFilters.class}
                      onChange={(e) => setFeeFilters({...feeFilters, class: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">All Classes</option>
                      {classes.map((c) => (
                        <option key={c._id} value={c.className}>
                          {c.className} {c.section ? `- ${c.section}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-2">Filter by Status</label>
                    <select
                      value={feeFilters.status}
                      onChange={(e) => setFeeFilters({...feeFilters, status: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-2">Filter by Category</label>
                    <select
                      value={feeFilters.feeCategory}
                      onChange={(e) => setFeeFilters({...feeFilters, feeCategory: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">All Categories</option>
                      <option value="regular">Regular</option>
                      <option value="transport">Transport</option>
                      <option value="fine">Fine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-2">Filter by Type</label>
                    <select
                      value={feeFilters.feesType}
                      onChange={(e) => setFeeFilters({...feeFilters, feesType: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">All Types</option>
                      <option value="monthly">Monthly</option>
                      <option value="installment">Installment</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-2">Search Student</label>
                    <input
                      type="text"
                      placeholder="Search by student name"
                      value={feeFilters.studentSearch}
                      onChange={(e) => setFeeFilters({...feeFilters, studentSearch: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setFeeFilters({ class: '', status: '', feeCategory: '', feesType: '', studentSearch: '' })}
                    className="px-4 py-2 bg-neutral-1 text-neutral-3 rounded-lg hover:bg-neutral-1/80 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-left">Class</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Due Date</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees
                      .filter((f) => {
                        // Filter by class
                        if (feeFilters.class) {
                          const student = students.find(s => s._id === (f.studentId?._id || f.studentId));
                          if (!student || student.class !== feeFilters.class) {
                            return false;
                          }
                        }
                        // Filter by status
                        if (feeFilters.status && f.status !== feeFilters.status) {
                          return false;
                        }
                        // Filter by category
                        if (feeFilters.feeCategory && f.feeCategory !== feeFilters.feeCategory) {
                          return false;
                        }
                        // Filter by type
                        if (feeFilters.feesType && f.feesType !== feeFilters.feesType) {
                          return false;
                        }
                        // Filter by student search
                        if (feeFilters.studentSearch) {
                          const student = students.find(s => s._id === (f.studentId?._id || f.studentId));
                          const searchTerm = feeFilters.studentSearch.toLowerCase();
                          if (!student || !student.studentName.toLowerCase().includes(searchTerm)) {
                            return false;
                          }
                        }
                        return true;
                      })
                      .map((f) => {
                        const student = students.find(s => s._id === (f.studentId?._id || f.studentId));
                        return (
                          <tr key={f._id} className="border-b border-neutral-1 hover:bg-neutral-1/50 transition">
                            <td className="px-4 py-3 text-neutral-3 font-medium">{f.studentId?.studentName || student?.studentName || 'N/A'}</td>
                            <td className="px-4 py-3 text-neutral-3">{student?.class || 'N/A'}</td>
                            <td className="px-4 py-3 text-neutral-3 capitalize">{f.feesType || 'monthly'}</td>
                            <td className="px-4 py-3 text-neutral-3 capitalize">{f.feeCategory || 'regular'}</td>
                            <td className="px-4 py-3 text-neutral-3 font-semibold">₹{f.amount.toLocaleString()}</td>
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
                              <button onClick={() => handleDeleteFee(f._id)} className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition" title="Delete Fee">
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'fines' && (() => {
            // Calculate fine statistics
            const totalFines = fines.length;
            const paidFines = fines.filter(f => f.status === 'paid').length;
            const pendingFines = fines.filter(f => f.status === 'pending').length;
            const overdueFines = fines.filter(f => f.status === 'overdue').length;
            const totalAmount = fines.reduce((sum, f) => sum + (f.amount || 0), 0);
            const paidAmount = fines.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0);
            const pendingAmount = fines.filter(f => f.status === 'pending').reduce((sum, f) => sum + (f.amount || 0), 0);
            const overdueAmount = fines.filter(f => f.status === 'overdue').reduce((sum, f) => sum + (f.amount || 0), 0);

            const filteredFines = fines.filter((f) => {
              // Filter by class
              if (fineFilters.class) {
                const student = students.find(s => s._id === (f.studentId?._id || f.studentId));
                if (!student || student.class !== fineFilters.class) {
                  return false;
                }
              }
              // Filter by status
              if (fineFilters.status && f.status !== fineFilters.status) {
                return false;
              }
              // Filter by fine type
              if (fineFilters.fineType && f.fineType !== fineFilters.fineType) {
                return false;
              }
              // Filter by student search
              if (fineFilters.studentSearch) {
                const student = students.find(s => s._id === (f.studentId?._id || f.studentId));
                const searchTerm = fineFilters.studentSearch.toLowerCase();
                if (!student || !student.studentName.toLowerCase().includes(searchTerm)) {
                  return false;
                }
              }
              return true;
            });

            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-neutral-3">Fines Management</h2>
                  <button onClick={() => {
                    setShowFineForm(!showFineForm);
                    if (!showFineForm) {
                      setEditingFine(null);
                      setFineForm({
                        selectedStudent: '', studentName: '', amount: '', reason: '', dueDate: '', remarks: '', fineType: 'other'
                      });
                      setFineStudentSearchQuery('');
                      setFineSearchResults([]);
                    }
                  }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                    <FiPlus />
                    <span>Add Fine</span>
                  </button>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Fines</p>
                        <p className="text-3xl font-bold mt-1">{totalFines}</p>
                        <p className="text-blue-100 text-sm mt-1">₹{totalAmount.toLocaleString()}</p>
                      </div>
                      <FiDollarSign className="text-4xl opacity-80" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Paid</p>
                        <p className="text-3xl font-bold mt-1">{paidFines}</p>
                        <p className="text-green-100 text-sm mt-1">₹{paidAmount.toLocaleString()}</p>
                      </div>
                      <FiDollarSign className="text-4xl opacity-80" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm font-medium">Pending</p>
                        <p className="text-3xl font-bold mt-1">{pendingFines}</p>
                        <p className="text-yellow-100 text-sm mt-1">₹{pendingAmount.toLocaleString()}</p>
                      </div>
                      <FiDollarSign className="text-4xl opacity-80" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm font-medium">Overdue</p>
                        <p className="text-3xl font-bold mt-1">{overdueFines}</p>
                        <p className="text-red-100 text-sm mt-1">₹{overdueAmount.toLocaleString()}</p>
                      </div>
                      <FiDollarSign className="text-4xl opacity-80" />
                    </div>
                  </div>
                </div>

                {showFineForm && (
                  <form onSubmit={handleSubmitFine} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingFine ? 'Edit Fine' : 'Add Fine'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm text-neutral-3/70 mb-1">Select Student (Roll/Enrollment Number) <span className="text-red-500">*</span></label>
                        <input
                          type="hidden"
                          value={fineForm.selectedStudent}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Search by name, roll number, or enrollment number"
                          value={fineStudentSearchQuery}
                          onChange={(e) => {
                            setFineStudentSearchQuery(e.target.value);
                            if (!e.target.value) {
                              setFineSearchResults([]);
                              setFineForm({...fineForm, selectedStudent: '', studentName: ''});
                            }
                          }}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        {(fineSearchResults.length > 0 || (fineStudentSearchQuery && fineSearchResults.length === 0 && fineStudentSearchQuery.length >= 2)) && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {fineSearchResults.length > 0 ? (
                              fineSearchResults.map((s) => (
                                <div
                                  key={s._id}
                                  onClick={() => {
                                    setFineForm({...fineForm, selectedStudent: s._id, studentName: s.studentName});
                                    setFineStudentSearchQuery(`${s.rollNumber || 'N/A'} / ${s.enrollmentNumber} - ${s.studentName}`);
                                    setFineSearchResults([]);
                                  }}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  {s.rollNumber || 'N/A'} / {s.enrollmentNumber} - {s.studentName} ({s.class || 'N/A'})
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">No students found</div>
                            )}
                          </div>
                        )}
                        {!fineStudentSearchQuery && (
                          <select
                            value={fineForm.selectedStudent}
                            onChange={(e) => {
                              const student = students.find(s => s._id === e.target.value);
                              setFineForm({...fineForm, selectedStudent: e.target.value, studentName: student ? student.studentName : ''});
                            }}
                            required
                            className="w-full px-4 py-2 border rounded-lg mt-2"
                          >
                            <option value="">Or select from list</option>
                            {students.map((s) => (
                              <option key={s._id} value={s._id}>
                                {s.rollNumber || 'N/A'} / {s.enrollmentNumber} - {s.studentName} ({s.class || 'N/A'})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      {fineForm.studentName && (
                        <div>
                          <label className="block text-sm text-neutral-3/70 mb-1">Student Name</label>
                          <input type="text" value={fineForm.studentName} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Fine Type <span className="text-red-500">*</span></label>
                        <select
                          value={fineForm.fineType}
                          onChange={(e) => setFineForm({...fineForm, fineType: e.target.value})}
                          required
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="late">Late Fine</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Fine Amount (₹) <span className="text-red-500">*</span></label>
                        <input type="number" placeholder="Enter amount" value={fineForm.amount} onChange={(e) => setFineForm({...fineForm, amount: e.target.value})} required min="0" step="0.01" className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Due Date <span className="text-red-500">*</span></label>
                        <input type="date" value={fineForm.dueDate} onChange={(e) => setFineForm({...fineForm, dueDate: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-neutral-3/70 mb-1">Reason <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="Enter reason for fine" value={fineForm.reason} onChange={(e) => setFineForm({...fineForm, reason: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-neutral-3/70 mb-1">Remarks (Optional)</label>
                        <textarea value={fineForm.remarks} onChange={(e) => setFineForm({...fineForm, remarks: e.target.value})} placeholder="Additional notes or remarks" className="w-full px-4 py-2 border rounded-lg" rows="2" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">{editingFine ? 'Update Fine' : 'Save Fine'}</button>
                      <button type="button" onClick={() => {
                        setShowFineForm(false);
                        setEditingFine(null);
                        setFineForm({
                          selectedStudent: '', studentName: '', amount: '', reason: '', dueDate: '', remarks: '', fineType: 'other'
                        });
                        setFineStudentSearchQuery('');
                        setFineSearchResults([]);
                      }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg hover:bg-neutral-1/80 transition">Cancel</button>
                    </div>
                  </form>
                )}

                {/* Filter Options */}
                <div className="bg-neutral-2 rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold text-neutral-3 mb-4">Filter Fines</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-neutral-3/70 mb-2">Filter by Class</label>
                      <select
                        value={fineFilters.class}
                        onChange={(e) => setFineFilters({...fineFilters, class: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">All Classes</option>
                        {classes.map((c) => (
                          <option key={c._id} value={c.className}>
                            {c.className} {c.section ? `- ${c.section}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-3/70 mb-2">Filter by Status</label>
                      <select
                        value={fineFilters.status}
                        onChange={(e) => setFineFilters({...fineFilters, status: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-3/70 mb-2">Filter by Fine Type</label>
                      <select
                        value={fineFilters.fineType}
                        onChange={(e) => setFineFilters({...fineFilters, fineType: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">All Types</option>
                        <option value="late">Late Fine</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-3/70 mb-2">Search Student</label>
                      <input
                        type="text"
                        placeholder="Search by student name"
                        value={fineFilters.studentSearch}
                        onChange={(e) => setFineFilters({...fineFilters, studentSearch: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setFineFilters({ class: '', status: '', fineType: '', studentSearch: '' })}
                      className="px-4 py-2 bg-neutral-1 text-neutral-3 rounded-lg hover:bg-neutral-1/80 transition"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
                  {filteredFines.length === 0 ? (
                    <div className="p-8 text-center text-neutral-3/70">
                      <FiDollarSign className="text-5xl mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No fines found</p>
                      <p className="text-sm mt-2">Try adjusting your filters or add a new fine</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-primary text-white">
                          <tr>
                            <th className="px-4 py-3 text-left">Student</th>
                            <th className="px-4 py-3 text-left">Class</th>
                            <th className="px-4 py-3 text-left">Roll No.</th>
                            <th className="px-4 py-3 text-left">Fine Type</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Reason</th>
                            <th className="px-4 py-3 text-left">Due Date</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFines.map((f) => {
                            const student = students.find(s => s._id === (f.studentId?._id || f.studentId));
                            return (
                              <tr key={f._id} className="border-b border-neutral-1 hover:bg-neutral-1/50 transition">
                                <td className="px-4 py-3 text-neutral-3 font-medium">{f.studentId?.studentName || student?.studentName || 'N/A'}</td>
                                <td className="px-4 py-3 text-neutral-3">{student?.class || 'N/A'}</td>
                                <td className="px-4 py-3 text-neutral-3">{student?.rollNumber || 'N/A'}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    f.fineType === 'late' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-800 border border-gray-300'
                                  }`}>
                                    {f.fineType === 'late' ? 'Late Fine' : 'Other'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-neutral-3 font-semibold text-lg">₹{f.amount.toLocaleString()}</td>
                                <td className="px-4 py-3 text-neutral-3 max-w-xs truncate" title={f.reason}>{f.reason}</td>
                                <td className="px-4 py-3 text-neutral-3">
                                  <div className="flex flex-col">
                                    <span>{new Date(f.dueDate).toLocaleDateString()}</span>
                                    {new Date(f.dueDate) < new Date() && f.status !== 'paid' && (
                                      <span className="text-xs text-red-600 font-semibold">Overdue</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    f.status === 'paid' ? 'bg-green-100 text-green-800 border border-green-300' :
                                    f.status === 'overdue' ? 'bg-red-100 text-red-800 border border-red-300' :
                                    'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                  }`}>
                                    {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex space-x-2">
                                    <button onClick={() => handleEditFine(f)} className="text-secondary hover:text-secondary-600 p-1 rounded hover:bg-secondary/10 transition" title="Edit Fine">
                                      <FiEdit />
                                    </button>
                                    <button onClick={() => handleDeleteFine(f._id)} className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition" title="Delete Fine">
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

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

