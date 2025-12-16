import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import {
  FiUsers,
  FiBook,
  FiFileText,
  FiCalendar,
  FiBell,
  FiCheckCircle,
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiAward,
  FiSave,
  FiX
} from 'react-icons/fi';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [classTeacher, setClassTeacher] = useState(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    studentName: '', fathersName: '', mothersName: '', address: '', class: '',
    rollNumber: '', enrollmentNumber: '', mobileNumber: '', studentType: 'dayScholar', busRoute: '', email: ''
  });
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [examResults, setExamResults] = useState([]);
  const [examResultForm, setExamResultForm] = useState({
    examType: 'regular',
    examDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });
  const [editingExamResult, setEditingExamResult] = useState(null);
  const [editingExamPercent, setEditingExamPercent] = useState({});

  useEffect(() => {
    if (user?.role !== 'teacher') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  // Fetch enrollment details when enrollment number changes (debounced)
  useEffect(() => {
    const fetchEnrollmentDetails = async () => {
      if (!studentForm.enrollmentNumber || studentForm.enrollmentNumber.length === 0) {
        setEnrollmentDetails(null);
        setEnrollmentLoading(false);
        return;
      }
      
      setEnrollmentLoading(true);
      setEnrollmentDetails(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/enrollmentNumbers/details/${studentForm.enrollmentNumber}`);
        if (res.data) {
          setEnrollmentDetails(res.data);
          if (res.data.name) {
            setStudentForm(prev => ({ ...prev, studentName: res.data.name }));
          } else {
            setStudentForm(prev => ({ ...prev, studentName: '' }));
          }
        } else {
          setEnrollmentDetails(null);
          setStudentForm(prev => ({ ...prev, studentName: '' }));
        }
      } catch (error) {
        setEnrollmentDetails(null);
        setStudentForm(prev => ({ ...prev, studentName: '' }));
      } finally {
        setEnrollmentLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (showStudentForm) {
        fetchEnrollmentDetails();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [studentForm.enrollmentNumber, showStudentForm]);

  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    events: 0,
    notifications: 0
  });

  const fetchData = async () => {
    try {
      const [eventsRes, notificationsRes, classTeacherRes, studentsRes] = await Promise.all([
        axios.get('${API_BASE_URL}/api/events'),
        axios.get('${API_BASE_URL}/api/notifications'),
        axios.get(`${API_BASE_URL}/api/classTeachers/teacher/${user?._id || user?.id}`).catch(() => ({ data: null })),
        axios.get('${API_BASE_URL}/api/students').catch(() => ({ data: [] }))
      ]);
      const classTeacherData = classTeacherRes.data;
      const studentsData = studentsRes.data || [];
      
      setEvents(eventsRes.data.slice(0, 5));
      setNotifications(notificationsRes.data.slice(0, 5));
      setClassTeacher(classTeacherData);
      // Filter students by assigned class
      const filteredStudents = classTeacherData 
        ? studentsData.filter(s => s.class === classTeacherData.className)
        : [];
      setStudents(filteredStudents);
      
      // Fetch exam results if class is assigned
      if (classTeacherData) {
        try {
          const examRes = await axios.get(`${API_BASE_URL}/api/examResults/class/${classTeacherData.className}`);
          setExamResults(examRes.data);
        } catch (error) {
          console.error('Error fetching exam results:', error);
          setExamResults([]);
        }
      }
      
      // Calculate real stats
      const studentCount = classTeacherData ? studentsData.filter(s => s.class === classTeacherData.className).length : 0;
      setStats({
        students: studentCount,
        classes: classTeacherData ? 1 : 0,
        events: eventsRes.data.length,
        notifications: notificationsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(`${API_BASE_URL}/api/students/${editingStudent._id}`, studentForm);
        setEditingStudent(null);
        alert('Student updated successfully!');
      } else {
        await axios.post('${API_BASE_URL}/api/students', studentForm);
        alert('Student added successfully!');
      }
      setShowStudentForm(false);
      setStudentForm({
        studentName: '', fathersName: '', mothersName: '', address: '', class: classTeacher?.className || '',
        rollNumber: '', enrollmentNumber: '', mobileNumber: '', studentType: 'dayScholar', busRoute: '', email: ''
      });
      setEnrollmentDetails(null);
      setEnrollmentLoading(false);
      fetchData();
    } catch (error) {
      console.error('Error creating/updating student:', error);
      alert(error.response?.data?.message || 'Error saving student');
    }
  };

  const handleEditStudent = async (student) => {
    setEditingStudent(student);
    setEnrollmentDetails(null); // Clear enrollment details when editing
    try {
      const userRes = await axios.get(`${API_BASE_URL}/api/users/${student.userId._id || student.userId}`);
      setStudentForm({
        studentName: student.studentName,
        fathersName: student.fathersName,
        mothersName: student.mothersName,
        address: student.address,
        class: student.class,
        rollNumber: student.rollNumber,
        enrollmentNumber: student.enrollmentNumber,
        mobileNumber: student.mobileNumber,
        studentType: student.studentType || 'dayScholar',
        busRoute: student.busRoute || '',
        email: userRes.data.email || ''
      });
    } catch (error) {
      setStudentForm({
        studentName: student.studentName,
        fathersName: student.fathersName,
        mothersName: student.mothersName,
        address: student.address,
        class: student.class,
        rollNumber: student.rollNumber,
        enrollmentNumber: student.enrollmentNumber,
        mobileNumber: student.mobileNumber,
        studentType: student.studentType || 'dayScholar',
        busRoute: student.busRoute || '',
        email: ''
      });
    }
    setShowStudentForm(true);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/students/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert(error.response?.data?.message || 'Error deleting student');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiCheckCircle },
    { id: 'myClass', label: 'My Class', icon: FiUsers },
    { id: 'examResult', label: 'Exam Result', icon: FiAward }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-1">
      <Header />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-3 mb-2">Teacher Dashboard</h1>
            <p className="text-neutral-3/70">Welcome back, {user?.name}</p>
            {classTeacher && (
              <p className="text-neutral-3/70 text-sm mt-1">Class: {classTeacher.className} {classTeacher.section ? `- ${classTeacher.section}` : ''}</p>
            )}
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

          {activeTab === 'dashboard' && (
            <>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-3/70 text-sm">Students</p>
                  <p className="text-2xl font-bold text-neutral-3">{stats.students}</p>
                </div>
                <FiUsers className="text-3xl text-secondary" />
              </div>
            </div>
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-3/70 text-sm">Classes</p>
                  <p className="text-2xl font-bold text-neutral-3">{stats.classes}</p>
                </div>
                <FiBook className="text-3xl text-secondary" />
              </div>
            </div>
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-3/70 text-sm">Events</p>
                  <p className="text-2xl font-bold text-neutral-3">{stats.events}</p>
                </div>
                <FiCalendar className="text-3xl text-secondary" />
              </div>
            </div>
            <div className="bg-neutral-2 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-3/70 text-sm">Notifications</p>
                  <p className="text-2xl font-bold text-neutral-3">{stats.notifications}</p>
                </div>
                <FiBell className="text-3xl text-secondary" />
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

            </>
          )}

          {activeTab === 'myClass' && (
            <div>
              {!classTeacher ? (
                <div className="bg-neutral-2 rounded-lg shadow-md p-6 text-center">
                  <p className="text-neutral-3/70">No class assigned. Please contact admin.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-3">My Class - {classTeacher.className} {classTeacher.section ? `- ${classTeacher.section}` : ''}</h2>
                    <button onClick={() => {
                      setShowStudentForm(!showStudentForm);
                      setEditingStudent(null);
                      setStudentForm({
                        studentName: '', fathersName: '', mothersName: '', address: '', class: classTeacher.className,
                        rollNumber: '', enrollmentNumber: '', mobileNumber: '', studentType: 'dayScholar', busRoute: '', email: ''
                      });
                      setEnrollmentDetails(null);
                      setEnrollmentLoading(false);
                    }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                      <FiUserPlus />
                      <span>Add Student</span>
                    </button>
                  </div>
                  {showStudentForm && (
                    <form onSubmit={handleSubmitStudent} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-sm text-neutral-3/70 mb-1">Enrollment Number <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="Enter Enrollment Number" value={studentForm.enrollmentNumber} onChange={(e) => {
                            setStudentForm({...studentForm, enrollmentNumber: e.target.value});
                          }} required className="w-full px-4 py-2 border rounded-lg" />
                          {enrollmentLoading && (
                            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <p className="text-sm text-gray-600">Searching...</p>
                            </div>
                          )}
                          {!enrollmentLoading && enrollmentDetails && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <span className="text-blue-600">✓</span>
                                <div className="flex-1">
                                  <p className="text-sm text-blue-800 font-semibold mb-2">Enrollment Number Found</p>
                                  <div className="space-y-1 text-sm">
                                    <p className="text-blue-700">
                                      <span className="font-medium">Enrollment Number:</span> {enrollmentDetails.enrollmentNumber}
                                    </p>
                                    <p className="text-blue-700">
                                      <span className="font-medium">Name:</span> {enrollmentDetails.name || 'No name associated'}
                                    </p>
                                    <p className="text-blue-700">
                                      <span className="font-medium">Status:</span> 
                                      <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                        enrollmentDetails.isUsed 
                                          ? 'bg-orange-100 text-orange-800' 
                                          : 'bg-green-100 text-green-800'
                                      }`}>
                                        {enrollmentDetails.isUsed ? 'Used' : 'Available'}
                                      </span>
                                    </p>
                                    {enrollmentDetails.usedBy && (
                                      <p className="text-blue-700">
                                        <span className="font-medium">Used By:</span> {enrollmentDetails.usedBy.name} ({enrollmentDetails.usedBy.email})
                                      </p>
                                    )}
                                    {enrollmentDetails.createdAt && (
                                      <p className="text-blue-600 text-xs mt-2">
                                        Created: {new Date(enrollmentDetails.createdAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {!enrollmentLoading && studentForm.enrollmentNumber && !enrollmentDetails && (
                            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <p className="text-sm text-gray-600">Enrollment number not found in database</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-neutral-3/70 mb-1">Student Name <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="Student Name (Auto-filled from enrollment)" value={studentForm.studentName} onChange={(e) => setStudentForm({...studentForm, studentName: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <input type="text" placeholder="Father's Name" value={studentForm.fathersName} onChange={(e) => setStudentForm({...studentForm, fathersName: e.target.value})} required className="px-4 py-2 border rounded-lg" />
                        <input type="text" placeholder="Mother's Name" value={studentForm.mothersName} onChange={(e) => setStudentForm({...studentForm, mothersName: e.target.value})} required className="px-4 py-2 border rounded-lg" />
                        <input type="text" placeholder="Address" value={studentForm.address} onChange={(e) => setStudentForm({...studentForm, address: e.target.value})} required className="px-4 py-2 border rounded-lg" />
                        <input type="text" placeholder="Roll Number" value={studentForm.rollNumber} onChange={(e) => setStudentForm({...studentForm, rollNumber: e.target.value})} required className="px-4 py-2 border rounded-lg" />
                        <input type="tel" placeholder="Mobile Number" value={studentForm.mobileNumber} onChange={(e) => setStudentForm({...studentForm, mobileNumber: e.target.value})} required className="px-4 py-2 border rounded-lg" />
                        <div>
                          <label className="block text-sm text-neutral-3/70 mb-1">Student Type</label>
                          <select value={studentForm.studentType} onChange={(e) => setStudentForm({...studentForm, studentType: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                            <option value="dayScholar">Day Scholar</option>
                            <option value="hosteler">Hosteler</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-neutral-3/70 mb-1">Bus Route (if Day Scholar)</label>
                          <input type="text" placeholder="Bus Route" value={studentForm.busRoute} onChange={(e) => setStudentForm({...studentForm, busRoute: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-neutral-3/70 mb-1">Email (Optional)</label>
                          <input type="email" placeholder="Email Address" value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingStudent ? 'Update Student' : 'Add Student'}</button>
                        <button type="button" onClick={() => {
                          setShowStudentForm(false);
                          setEditingStudent(null);
                          setEnrollmentDetails(null);
                          setEnrollmentLoading(false);
                        }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                      </div>
                    </form>
                  )}
                  <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Roll No</th>
                          <th className="px-4 py-3 text-left">Mobile</th>
                          <th className="px-4 py-3 text-left">Type</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s) => (
                          <tr key={s._id} className="border-b border-neutral-1">
                            <td className="px-4 py-3 text-neutral-3">{s.studentName}</td>
                            <td className="px-4 py-3 text-neutral-3">{s.rollNumber}</td>
                            <td className="px-4 py-3 text-neutral-3">{s.mobileNumber}</td>
                            <td className="px-4 py-3 text-neutral-3 capitalize">{s.studentType === 'dayScholar' ? 'Day Scholar' : 'Hosteler'}</td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button onClick={() => handleEditStudent(s)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                                <button onClick={() => handleDeleteStudent(s._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'examResult' && (
            <div>
              {!classTeacher ? (
                <div className="bg-neutral-2 rounded-lg shadow-md p-6 text-center">
                  <p className="text-neutral-3/70">No class assigned. Please contact admin.</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-3 mb-6">Exam Results - {classTeacher.className} {classTeacher.section ? `- ${classTeacher.section}` : ''}</h2>
                  
                  {/* Add New Results Form */}
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const results = students.map(student => ({
                        studentId: student._id,
                        rollNumber: student.rollNumber,
                        studentName: student.studentName,
                        examPercent: document.getElementById(`examPercent_${student._id}`)?.value || 0
                      })).filter(r => r.examPercent > 0);

                      if (results.length === 0) {
                        alert('Please enter exam percentage for at least one student');
                        return;
                      }

                      await axios.post('${API_BASE_URL}/api/examResults', {
                        results,
                        className: classTeacher.className,
                        examType: examResultForm.examType,
                        examDate: examResultForm.examDate,
                        remarks: examResultForm.remarks
                      });

                      alert('Exam results submitted successfully!');
                      fetchData();
                      setExamResultForm({
                        examType: 'regular',
                        examDate: new Date().toISOString().split('T')[0],
                        remarks: ''
                      });
                      // Clear all input fields
                      students.forEach(student => {
                        const input = document.getElementById(`examPercent_${student._id}`);
                        if (input) input.value = '';
                      });
                    } catch (error) {
                      console.error('Error submitting exam results:', error);
                      alert(error.response?.data?.message || 'Error submitting exam results');
                    }
                  }} className="bg-neutral-2 rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-neutral-3 mb-4">Add New Exam Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Exam Type</label>
                        <select value={examResultForm.examType} onChange={(e) => setExamResultForm({...examResultForm, examType: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                          <option value="regular">Regular</option>
                          <option value="mid-term">Mid-Term</option>
                          <option value="final">Final</option>
                          <option value="unit-test">Unit Test</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Exam Date</label>
                        <input type="date" value={examResultForm.examDate} onChange={(e) => setExamResultForm({...examResultForm, examDate: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Remarks (Optional)</label>
                        <input type="text" value={examResultForm.remarks} onChange={(e) => setExamResultForm({...examResultForm, remarks: e.target.value})} placeholder="Remarks" className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                    </div>

                    <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden mb-4">
                      <table className="w-full">
                        <thead className="bg-primary text-white">
                          <tr>
                            <th className="px-4 py-3 text-left">S.No</th>
                            <th className="px-4 py-3 text-left">Roll No</th>
                            <th className="px-4 py-3 text-left">Student Name</th>
                            <th className="px-4 py-3 text-left">Exam Percent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })).map((student, index) => (
                            <tr key={student._id} className="border-b border-neutral-1">
                              <td className="px-4 py-3 text-neutral-3">{index + 1}</td>
                              <td className="px-4 py-3 text-neutral-3">{student.rollNumber}</td>
                              <td className="px-4 py-3 text-neutral-3">{student.studentName}</td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  id={`examPercent_${student._id}`}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  placeholder="Enter %"
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                      Submit Results
                    </button>
                  </form>

                  {/* Existing Results with Edit Functionality */}
                  {examResults.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-neutral-3 mb-4">Existing Exam Results</h3>
                      <div className="space-y-6">
                        {Object.values(examResults.reduce((acc, result) => {
                          const key = `${result.examType}_${result.examDate}`;
                          if (!acc[key]) {
                            acc[key] = {
                              examType: result.examType,
                              examDate: result.examDate,
                              addedBy: result.addedBy?.name || 'Unknown',
                              remarks: result.remarks,
                              results: []
                            };
                          }
                          acc[key].results.push(result);
                          return acc;
                        }, {})).map((group, groupIndex) => {
                          const getGrade = (percent) => {
                            if (percent >= 90) return 'A+';
                            if (percent >= 80) return 'A';
                            if (percent >= 70) return 'B+';
                            if (percent >= 60) return 'B';
                            if (percent >= 50) return 'C+';
                            if (percent >= 40) return 'C';
                            return 'F';
                          };
                          
                          return (
                            <div key={groupIndex} className="bg-neutral-2 rounded-lg shadow-md p-6">
                              <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-1">
                                <div>
                                  <h4 className="text-lg font-bold text-neutral-3 capitalize">{group.examType.replace('-', ' ')} Exam</h4>
                                  <p className="text-sm text-neutral-3/70">
                                    Date: {new Date(group.examDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-neutral-3/50 mt-1">
                                    Added by: {group.addedBy}
                                  </p>
                                </div>
                                {group.remarks && (
                                  <p className="text-sm text-neutral-3/70 italic">{group.remarks}</p>
                                )}
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-primary text-white">
                                    <tr>
                                      <th className="px-4 py-3 text-left">S.No</th>
                                      <th className="px-4 py-3 text-left">Roll No</th>
                                      <th className="px-4 py-3 text-left">Student Name</th>
                                      <th className="px-4 py-3 text-left">Percentage</th>
                                      <th className="px-4 py-3 text-left">Grade</th>
                                      <th className="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {group.results.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })).map((result, index) => (
                                      <tr key={result._id} className="border-b border-neutral-1">
                                        <td className="px-4 py-3 text-neutral-3">{index + 1}</td>
                                        <td className="px-4 py-3 text-neutral-3">{result.rollNumber}</td>
                                        <td className="px-4 py-3 text-neutral-3">{result.studentName}</td>
                                        <td className="px-4 py-3">
                                          {editingExamResult === result._id ? (
                                            <input
                                              type="number"
                                              min="0"
                                              max="100"
                                              step="0.01"
                                              defaultValue={result.examPercent}
                                              onChange={(e) => setEditingExamPercent({...editingExamPercent, [result._id]: parseFloat(e.target.value)})}
                                              className="w-20 px-2 py-1 border rounded"
                                            />
                                          ) : (
                                            <span className="font-semibold">{result.examPercent}%</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                            result.examPercent >= 50 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {getGrade(editingExamResult === result._id ? (editingExamPercent[result._id] || result.examPercent) : result.examPercent)}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3">
                                          {editingExamResult === result._id ? (
                                            <div className="flex space-x-2">
                                              <button
                                                onClick={async () => {
                                                  try {
                                                    const newPercent = editingExamPercent[result._id] !== undefined ? editingExamPercent[result._id] : result.examPercent;
                                                    if (newPercent < 0 || newPercent > 100) {
                                                      alert('Percentage must be between 0 and 100');
                                                      return;
                                                    }
                                                    await axios.put(`${API_BASE_URL}/api/examResults/${result._id}`, {
                                                      examPercent: newPercent
                                                    });
                                                    alert('Result updated successfully!');
                                                    setEditingExamResult(null);
                                                    setEditingExamPercent({});
                                                    fetchData();
                                                  } catch (error) {
                                                    console.error('Error updating result:', error);
                                                    alert(error.response?.data?.message || 'Error updating result');
                                                  }
                                                }}
                                                className="text-green-600 hover:text-green-700 flex items-center space-x-1"
                                                title="Save Changes"
                                              >
                                                <FiSave />
                                                <span>Save</span>
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setEditingExamResult(null);
                                                  setEditingExamPercent({});
                                                }}
                                                className="text-gray-600 hover:text-gray-700 flex items-center space-x-1"
                                                title="Cancel"
                                              >
                                                <FiX />
                                                <span>Cancel</span>
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="flex space-x-2">
                                              <button
                                                onClick={() => {
                                                  setEditingExamResult(result._id);
                                                  setEditingExamPercent({[result._id]: result.examPercent});
                                                }}
                                                className="text-secondary hover:text-secondary-600"
                                                title="Edit Result"
                                              >
                                                <FiEdit />
                                              </button>
                                              <button
                                                onClick={async () => {
                                                  if (window.confirm('Are you sure you want to delete this exam result?')) {
                                                    try {
                                                      await axios.delete(`${API_BASE_URL}/api/examResults/${result._id}`);
                                                      alert('Result deleted successfully!');
                                                      fetchData();
                                                    } catch (error) {
                                                      console.error('Error deleting result:', error);
                                                      alert(error.response?.data?.message || 'Error deleting result');
                                                    }
                                                  }
                                                }}
                                                className="text-red-600 hover:text-red-700"
                                                title="Delete Result"
                                              >
                                                <FiTrash2 />
                                              </button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;

