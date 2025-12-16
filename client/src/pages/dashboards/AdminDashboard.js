import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import {
  FiUsers, FiCalendar, FiBell, FiImage, FiMail, FiFileText, FiUserPlus,
  FiMenu, FiX, FiSettings, FiUpload, FiEdit, FiTrash2, FiDollarSign, FiAward
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    notifications: 0,
    contacts: 0,
    students: 0
  });

  // Data states
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [fines, setFines] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [enrollmentNumbers, setEnrollmentNumbers] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [selectedClassForExam, setSelectedClassForExam] = useState('');
  const [notices, setNotices] = useState([]);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState('');

  // Form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingNotification, setEditingNotification] = useState(null);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingClassTeacher, setEditingClassTeacher] = useState(null);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [editingFee, setEditingFee] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [imageUploadType, setImageUploadType] = useState('link'); // 'link' or 'file'
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [feeStudentSearchQuery, setFeeStudentSearchQuery] = useState('');
  const [feeSearchResults, setFeeSearchResults] = useState([]);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [teacherSearchResults, setTeacherSearchResults] = useState([]);

  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '' });
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', type: 'general', targetRole: 'all' });
  const [carouselForm, setCarouselForm] = useState({ image: '', title: '', description: '', order: 0 });
  const [galleryForm, setGalleryForm] = useState({ image: '', galleryName: '', title: '', description: '' });
  const [studentForm, setStudentForm] = useState({
    studentName: '', fathersName: '', mothersName: '', address: '', class: '',
    rollNumber: '', enrollmentNumber: '', mobileNumber: '', studentType: 'dayScholar', busRoute: '', email: '', transportOpted: false
  });
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [classTeacherForm, setClassTeacherForm] = useState({ teacherId: '', className: '', section: '' });
  const [classForm, setClassForm] = useState({ className: '', section: '', description: '' });
  const [enrollmentForm, setEnrollmentForm] = useState({ enrollmentNumber: '', name: '' });
  const [feeForm, setFeeForm] = useState({
    selectedClass: '', selectedStudent: '', studentName: '', amount: '', feesType: 'monthly',
    month: '', installmentNumber: '', dueDate: '', remarks: '', feeCategory: 'regular', transportAmount: ''
  });
  const [fineForm, setFineForm] = useState({
    selectedStudent: '', studentName: '', amount: '', reason: '', dueDate: '', remarks: '', fineType: 'other'
  });
  const [noticeForm, setNoticeForm] = useState({ title: '', message: '', tag: 'normal' });
  const [showFineForm, setShowFineForm] = useState(false);
  const [editingFine, setEditingFine] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', qualification: '',
    experience: '', specialization: '', otherDetails: '', role: 'teacher'
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, navigate, activeTab]);

  const searchStudentsForFee = async (query) => {
    if (!query || query.length < 2) {
      setFeeSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students/search?q=${encodeURIComponent(query)}`);
      setFeeSearchResults(res.data);
    } catch (error) {
      console.error('Error searching students:', error);
      setFeeSearchResults([]);
    }
  };

  const searchTeachers = async (query) => {
    if (!query || query.length < 2) {
      setTeacherSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/teachers/search?q=${encodeURIComponent(query)}`);
      setTeacherSearchResults(res.data);
    } catch (error) {
      console.error('Error searching teachers:', error);
      setTeacherSearchResults([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === 'fees') {
        searchStudentsForFee(feeStudentSearchQuery);
      } else if (activeTab === 'classTeachers') {
        searchTeachers(teacherSearchQuery);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [feeStudentSearchQuery, teacherSearchQuery, activeTab]);

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
      if (activeTab === 'students' && showStudentForm) {
        fetchEnrollmentDetails();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [studentForm.enrollmentNumber, activeTab, showStudentForm]);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, eventsRes, notificationsRes, contactsRes, carouselRes, galleryRes, studentsRes, classesRes, feesRes, finesRes, classTeachersRes, enrollmentNumbersRes, teachersRes, noticesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users`),
        axios.get(`${API_BASE_URL}/api/events`),
        axios.get(`${API_BASE_URL}/api/notifications`),
        axios.get(`${API_BASE_URL}/api/contacts`),
        axios.get(`${API_BASE_URL}/api/carousel/all`),
        axios.get(`${API_BASE_URL}/api/gallery`),
        axios.get(`${API_BASE_URL}/api/students`),
        axios.get(`${API_BASE_URL}/api/classes`),
        axios.get(`${API_BASE_URL}/api/fees`),
        axios.get(`${API_BASE_URL}/api/fines`),
        axios.get(`${API_BASE_URL}/api/classTeachers`),
        axios.get(`${API_BASE_URL}/api/enrollmentNumbers`),
        axios.get(`${API_BASE_URL}/api/teachers`),
        axios.get(`${API_BASE_URL}/api/notices`)
      ]);
      
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setNotifications(notificationsRes.data);
      setContacts(contactsRes.data);
      setCarouselImages(carouselRes.data);
      setGalleryImages(galleryRes.data);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
      setFees(feesRes.data);
      setFines(finesRes.data);
      setClassTeachers(classTeachersRes.data);
      setEnrollmentNumbers(enrollmentNumbersRes.data);
      setTeachers(teachersRes.data);
      setNotices(noticesRes.data);
      
      setStats({
        users: usersRes.data.length,
        events: eventsRes.data.length,
        notifications: notificationsRes.data.length,
        contacts: contactsRes.data.length,
        students: studentsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchStudentsByClass = async (className) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/fees/class/${className}`);
      setClassStudents(res.data);
    } catch (error) {
      console.error('Error fetching students by class:', error);
      setClassStudents([]);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}/role`, { role: newRole });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await axios.put(`${API_BASE_URL}/api/events/${editingEvent._id}`, eventForm);
        setEditingEvent(null);
        alert('Event updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/events`, eventForm);
        alert('Event created successfully!');
      }
      setShowEventForm(false);
      setEventForm({ title: '', description: '', date: '', location: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating event:', error);
      alert(error.response?.data?.message || 'Error saving event');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      location: event.location || ''
    });
    setShowEventForm(true);
  };

  const handleSubmitNotification = async (e) => {
    e.preventDefault();
    try {
      if (editingNotification) {
        await axios.put(`${API_BASE_URL}/api/notifications/${editingNotification._id}`, notificationForm);
        setEditingNotification(null);
        alert('Notification updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/notifications`, notificationForm);
        alert('Notification sent successfully!');
      }
      setShowNotificationForm(false);
      setNotificationForm({ title: '', message: '', type: 'general', targetRole: 'all' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating notification:', error);
      alert(error.response?.data?.message || 'Error saving notification');
    }
  };

  const handleEditNotification = (notification) => {
    setEditingNotification(notification);
    setNotificationForm({
      title: notification.title,
      message: notification.message,
      type: notification.type || 'general',
      targetRole: notification.targetRole || 'all'
    });
    setShowNotificationForm(true);
  };

  const handleSubmitCarousel = async (e) => {
    e.preventDefault();
    try {
      if (editingCarousel) {
        await axios.put(`${API_BASE_URL}/api/carousel/${editingCarousel._id}`, carouselForm);
        setEditingCarousel(null);
        alert('Carousel image updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/carousel`, carouselForm);
        alert('Carousel image uploaded successfully!');
      }
      setShowCarouselForm(false);
      setCarouselForm({ image: '', title: '', description: '', order: 0 });
      setImageUploadType('link');
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating carousel:', error);
      alert(error.response?.data?.message || 'Error saving carousel image');
    }
  };

  const handleEditCarousel = (carousel) => {
    setEditingCarousel(carousel);
    setCarouselForm({
      image: carousel.image || '',
      title: carousel.title || '',
      description: carousel.description || '',
      order: carousel.order || 0
    });
    setImageUploadType(carousel.image && carousel.image.startsWith('data:') ? 'file' : 'link');
    setShowCarouselForm(true);
  };

  const handleSubmitGallery = async (e) => {
    e.preventDefault();
    try {
      if (editingGallery) {
        await axios.put(`${API_BASE_URL}/api/gallery/${editingGallery._id}`, galleryForm);
        setEditingGallery(null);
        alert('Gallery image updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/gallery`, galleryForm);
        alert('Gallery image uploaded successfully!');
      }
      setShowGalleryForm(false);
      setGalleryForm({ image: '', galleryName: '', title: '', description: '' });
      setImageUploadType('link');
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating gallery image:', error);
      alert(error.response?.data?.message || 'Error saving gallery image');
    }
  };

  const handleEditGallery = (gallery) => {
    setEditingGallery(gallery);
    setGalleryForm({
      image: gallery.image || '',
      galleryName: gallery.galleryName || '',
      title: gallery.title || '',
      description: gallery.description || ''
    });
    setImageUploadType(gallery.image && gallery.image.startsWith('data:') ? 'file' : 'link');
    setShowGalleryForm(true);
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(`${API_BASE_URL}/api/students/${editingStudent._id}`, studentForm);
        setEditingStudent(null);
        alert('Student updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/students`, studentForm);
        alert('Student added successfully! Login ID: Mobile Number, Password: Enrollment Number');
      }
      setShowStudentForm(false);
      setStudentForm({
        studentName: '', fathersName: '', mothersName: '', address: '', class: '',
        rollNumber: '', enrollmentNumber: '', mobileNumber: '', studentType: 'dayScholar', busRoute: '', email: '', transportOpted: false
      });
      setEnrollmentDetails(null);
      setEnrollmentLoading(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating student:', error);
      alert(error.response?.data?.message || 'Error saving student');
    }
  };

  const handleSubmitClassTeacher = async (e) => {
    e.preventDefault();
    try {
      if (editingClassTeacher) {
        await axios.put(`${API_BASE_URL}/api/classTeachers/${editingClassTeacher._id}`, classTeacherForm);
        setEditingClassTeacher(null);
        alert('Class teacher updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/classTeachers`, classTeacherForm);
        alert('Class teacher assigned successfully!');
      }
      setClassTeacherForm({ teacherId: '', className: '', section: '' });
      setTeacherSearchQuery('');
      setTeacherSearchResults([]);
      fetchDashboardData();
    } catch (error) {
      console.error('Error assigning/updating class teacher:', error);
      alert(error.response?.data?.message || 'Error saving class teacher');
    }
  };

  const handleEditClassTeacher = (classTeacher) => {
    setEditingClassTeacher(classTeacher);
    setClassTeacherForm({
      teacherId: classTeacher.teacherId._id || classTeacher.teacherId,
      className: classTeacher.className,
      section: classTeacher.section || ''
    });
  };

  const handleSubmitEnrollment = async (e) => {
    e.preventDefault();
    try {
      if (editingEnrollment) {
        await axios.put(`${API_BASE_URL}/api/enrollmentNumbers/${editingEnrollment._id}`, enrollmentForm);
        setEditingEnrollment(null);
        alert('Enrollment number updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/enrollmentNumbers`, enrollmentForm);
        alert('Enrollment number added successfully!');
      }
      setEnrollmentForm({ enrollmentNumber: '', name: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding/updating enrollment number:', error);
      alert(error.response?.data?.message || 'Error saving enrollment number');
    }
  };

  const handleEditEnrollment = (enrollment) => {
    setEditingEnrollment(enrollment);
    setEnrollmentForm({
      enrollmentNumber: enrollment.enrollmentNumber,
      name: enrollment.name
    });
  };

  const handleEditStudent = async (student) => {
    setEditingStudent(student);
    setEnrollmentDetails(null); // Clear enrollment details when editing
    // Fetch user email
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
        email: userRes.data.email || '',
        transportOpted: student.transportOpted || false
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
        email: '',
        transportOpted: student.transportOpted || false
      });
    }
    setShowStudentForm(true);
  };

  const handleSubmitClass = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await axios.put(`${API_BASE_URL}/api/classes/${editingClass._id}`, classForm);
        setEditingClass(null);
        alert('Class updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/classes`, classForm);
        alert('Class created successfully!');
      }
      setShowClassForm(false);
      setClassForm({ className: '', section: '', description: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating class:', error);
      alert(error.response?.data?.message || 'Error saving class');
    }
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setClassForm({
      className: classItem.className,
      section: classItem.section || '',
      description: classItem.description || ''
    });
    setShowClassForm(true);
  };

  const handleSubmitFee = async (e) => {
    e.preventDefault();
    try {
      const feeData = {
        studentId: feeForm.selectedStudent,
        amount: feeForm.amount,
        feesType: feeForm.feesType,
        month: feeForm.month,
        installmentNumber: feeForm.installmentNumber,
        dueDate: feeForm.dueDate,
        remarks: feeForm.remarks,
        feeCategory: feeForm.feeCategory
      };
      
      if (editingFee) {
        await axios.put(`${API_BASE_URL}/api/fees/${editingFee._id}`, feeData);
        setEditingFee(null);
        alert('Fee updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/fees`, feeData);
        
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
        alert('Fee added successfully!');
      }
      setShowFeeForm(false);
      setFeeForm({
        selectedClass: '', selectedStudent: '', studentName: '', amount: '', feesType: 'monthly',
        month: '', installmentNumber: '', dueDate: '', remarks: '', feeCategory: 'regular', transportAmount: ''
      });
      setClassStudents([]);
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating fee:', error);
      alert(error.response?.data?.message || 'Error saving fee');
    }
  };

  const handleEditFee = (fee) => {
    setEditingFee(fee);
    // Find student to get class
    const student = students.find(s => s._id.toString() === fee.studentId._id?.toString() || s._id.toString() === fee.studentId.toString());
    if (student) {
      setFeeForm({
        selectedClass: student.class,
        selectedStudent: student._id,
        studentName: student.studentName,
        amount: fee.amount,
        feesType: fee.feesType || 'monthly',
        month: fee.month || '',
        installmentNumber: fee.installmentNumber || '',
        dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
        remarks: fee.remarks || '',
        feeCategory: fee.feeCategory || 'regular',
        transportAmount: ''
      });
      fetchStudentsByClass(student.class);
    }
    setShowFeeForm(true);
  };

  const handleSubmitTeacher = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...teacherForm };
      
      // Don't send password if editing and password is empty
      if (editingTeacher && !submitData.password) {
        delete submitData.password;
      }
      
      if (editingTeacher) {
        await axios.put(`${API_BASE_URL}/api/teachers/${editingTeacher._id}`, submitData);
        setEditingTeacher(null);
        alert('Teacher/Accountant updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/teachers`, submitData);
        alert('Teacher/Accountant added successfully!');
      }
      setShowTeacherForm(false);
      setTeacherForm({
        name: '', email: '', password: '', phone: '', address: '', qualification: '',
        experience: '', specialization: '', otherDetails: '', role: 'teacher'
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating teacher:', error);
      alert(error.response?.data?.message || 'Error saving teacher/accountant');
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      password: '', // Don't show password
      phone: teacher.phone || '',
      address: teacher.address || '',
      qualification: teacher.qualification || '',
      experience: teacher.experience || '',
      specialization: teacher.specialization || '',
      otherDetails: teacher.otherDetails || '',
      role: teacher.role
    });
    setShowTeacherForm(true);
  };

  const handleSubmitFine = async (e) => {
    e.preventDefault();
    try {
      if (editingFine) {
        await axios.put(`${API_BASE_URL}/api/fines/${editingFine._id}`, fineForm);
        setEditingFine(null);
        alert('Fine updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/fines`, fineForm);
        alert('Fine added successfully!');
      }
      setShowFineForm(false);
      setFineForm({
        selectedStudent: '', studentName: '', amount: '', reason: '', dueDate: '', remarks: ''
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating/updating fine:', error);
      alert(error.response?.data?.message || 'Error saving fine');
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
    setShowFineForm(true);
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
      fetchDashboardData();
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

  const handleImageUpload = (e, formType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (formType === 'carousel') {
          setCarouselForm({ ...carouselForm, image: base64String });
        } else if (formType === 'gallery') {
          setGalleryForm({ ...galleryForm, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const endpoints = {
        event: `/api/events/${id}`,
        notification: `/api/notifications/${id}`,
        carousel: `/api/carousel/${id}`,
        gallery: `/api/gallery/${id}`,
        contact: `/api/contacts/${id}`,
        student: `/api/students/${id}`,
        class: `/api/classes/${id}`,
        fee: `/api/fees/${id}`,
        fine: `/api/fines/${id}`,
        classTeacher: `/api/classTeachers/${id}`,
        enrollmentNumber: `/api/enrollmentNumbers/${id}`,
        teacher: `/api/teachers/${id}`,
        notice: `/api/notices/${id}`
      };
      await axios.delete(`${API_BASE_URL}${endpoints[type]}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-3 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                <p className="text-neutral-3/70 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-neutral-3">{stats.users}</p>
              </div>
              <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                <p className="text-neutral-3/70 text-sm">Events</p>
                <p className="text-3xl font-bold text-neutral-3">{stats.events}</p>
              </div>
              <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                <p className="text-neutral-3/70 text-sm">Notifications</p>
                <p className="text-3xl font-bold text-neutral-3">{stats.notifications}</p>
              </div>
              <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                <p className="text-neutral-3/70 text-sm">Contact Queries</p>
                <p className="text-3xl font-bold text-neutral-3">{stats.contacts}</p>
              </div>
              <div className="bg-neutral-2 rounded-lg shadow-md p-6">
                <p className="text-neutral-3/70 text-sm">Students</p>
                <p className="text-3xl font-bold text-neutral-3">{stats.students}</p>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Manage Users</h2>
            </div>
            <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-neutral-1">
                      <td className="px-4 py-3 text-neutral-3">{u.name}</td>
                      <td className="px-4 py-3 text-neutral-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded bg-neutral-2 text-neutral-3"
                        >
                          <option value="admin">Admin</option>
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="accountant">Accountant</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete('user', u._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Notifications</h2>
              <button
                onClick={() => {
                  setShowNotificationForm(!showNotificationForm);
                  if (!showNotificationForm) {
                    setEditingNotification(null);
                    setNotificationForm({ title: '', message: '', type: 'general', targetRole: 'all' });
                  }
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
              >
                <FiBell />
                <span>Send Notification</span>
              </button>
            </div>
            {showNotificationForm && (
              <form onSubmit={handleSubmitNotification} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingNotification ? 'Edit Notification' : 'Send Notification'}</h3>
                <input type="text" placeholder="Title" value={notificationForm.title} onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                <textarea placeholder="Message" value={notificationForm.message} onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" rows="3" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={notificationForm.type} onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})} className="px-4 py-2 border rounded-lg">
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="event">Event</option>
                    <option value="fee">Fee</option>
                  </select>
                  <select value={notificationForm.targetRole} onChange={(e) => setNotificationForm({...notificationForm, targetRole: e.target.value})} className="px-4 py-2 border rounded-lg">
                    <option value="all">All</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="accountant">Accountant</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingNotification ? 'Update' : 'Send'}</button>
                  <button type="button" onClick={() => {
                    setShowNotificationForm(false);
                    setEditingNotification(null);
                    setNotificationForm({ title: '', message: '', type: 'general', targetRole: 'all' });
                  }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n._id} className="bg-neutral-2 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-neutral-3">{n.title}</h3>
                    <p className="text-sm text-neutral-3/70">{n.message}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditNotification(n)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                    <button onClick={() => handleDelete('notification', n._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'events':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Events</h2>
              <button onClick={() => {
                setShowEventForm(!showEventForm);
                if (!showEventForm) {
                  setEditingEvent(null);
                  setEventForm({ title: '', description: '', date: '', location: '' });
                }
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiCalendar />
                <span>Add Event</span>
              </button>
            </div>
            {showEventForm && (
              <form onSubmit={handleSubmitEvent} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
                <input type="text" placeholder="Title" value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                <textarea placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" rows="3" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})} required className="px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({...eventForm, location: e.target.value})} className="px-4 py-2 border rounded-lg" />
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingEvent ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => {
                    setShowEventForm(false);
                    setEditingEvent(null);
                    setEventForm({ title: '', description: '', date: '', location: '' });
                  }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            <div className="space-y-4">
              {events.map((e) => (
                <div key={e._id} className="bg-neutral-2 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-neutral-3">{e.title}</h3>
                    <p className="text-sm text-neutral-3/70">{new Date(e.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditEvent(e)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                    <button onClick={() => handleDelete('event', e._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'carousel':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Carousel Images</h2>
              <button onClick={() => {
                setShowCarouselForm(!showCarouselForm);
                if (!showCarouselForm) {
                  setEditingCarousel(null);
                  setCarouselForm({ image: '', title: '', description: '', order: 0 });
                  setImageUploadType('link');
                }
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiUpload />
                <span>Upload Image</span>
              </button>
            </div>
            {showCarouselForm && (
              <form onSubmit={handleSubmitCarousel} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingCarousel ? 'Edit Carousel Image' : 'Upload Carousel Image'}</h3>
                <div>
                  <label className="block text-sm text-neutral-3/70 mb-2">Upload Type</label>
                  <div className="flex space-x-4 mb-4">
                    <label className="flex items-center">
                      <input type="radio" value="link" checked={imageUploadType === 'link'} onChange={(e) => setImageUploadType(e.target.value)} className="mr-2" />
                      Image Link
                    </label>
                    <label className="flex items-center">
                      <input type="radio" value="file" checked={imageUploadType === 'file'} onChange={(e) => setImageUploadType(e.target.value)} className="mr-2" />
                      Upload File
                    </label>
                  </div>
                  {imageUploadType === 'link' ? (
                    <input type="text" placeholder="Image URL" value={carouselForm.image} onChange={(e) => setCarouselForm({...carouselForm, image: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'carousel')} required={!editingCarousel} className="w-full px-4 py-2 border rounded-lg" />
                  )}
                  {carouselForm.image && carouselForm.image.startsWith('data:') && (
                    <img src={carouselForm.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>
                <input type="text" placeholder="Title" value={carouselForm.title} onChange={(e) => setCarouselForm({...carouselForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                <textarea placeholder="Description" value={carouselForm.description} onChange={(e) => setCarouselForm({...carouselForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="2" />
                <input type="number" placeholder="Order" value={carouselForm.order} onChange={(e) => setCarouselForm({...carouselForm, order: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingCarousel ? 'Update' : 'Upload'}</button>
                  <button type="button" onClick={() => {
                    setShowCarouselForm(false);
                    setEditingCarousel(null);
                    setCarouselForm({ image: '', title: '', description: '', order: 0 });
                    setImageUploadType('link');
                  }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {carouselImages.map((img) => (
                <div key={img._id} className="bg-neutral-2 p-4 rounded-lg">
                  <div className="h-48 bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                    {img.image ? <img src={img.image} alt={img.title} className="h-full w-full object-cover rounded" /> : <FiImage className="text-4xl text-gray-400" />}
                  </div>
                  <h3 className="font-semibold text-neutral-3 mb-1">{img.title}</h3>
                  <div className="flex space-x-2 mt-2">
                    <button onClick={() => handleEditCarousel(img)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                    <button onClick={() => handleDelete('carousel', img._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-3 mb-6">Contact Queries</h2>
            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c._id} className="bg-neutral-2 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-neutral-3">{c.name}</h3>
                      <p className="text-sm text-neutral-3/70">{c.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : c.status === 'read' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{c.status}</span>
                  </div>
                  <p className="font-semibold text-neutral-3 mb-1">{c.subject}</p>
                  <p className="text-sm text-neutral-3/70 mb-2">{c.message}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-neutral-3/50">{new Date(c.createdAt).toLocaleDateString()}</p>
                    <button onClick={() => handleDelete('contact', c._id)} className="text-red-600"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Gallery</h2>
              <button onClick={() => {
                setShowGalleryForm(!showGalleryForm);
                if (!showGalleryForm) {
                  setEditingGallery(null);
                  setGalleryForm({ image: '', galleryName: '', title: '', description: '' });
                  setImageUploadType('link');
                }
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiUpload />
                <span>Upload Image</span>
              </button>
            </div>
            {showGalleryForm && (
              <form onSubmit={handleSubmitGallery} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingGallery ? 'Edit Gallery Image' : 'Upload Gallery Image'}</h3>
                <div>
                  <label className="block text-sm text-neutral-3/70 mb-2">Upload Type</label>
                  <div className="flex space-x-4 mb-4">
                    <label className="flex items-center">
                      <input type="radio" value="link" checked={imageUploadType === 'link'} onChange={(e) => setImageUploadType(e.target.value)} className="mr-2" />
                      Image Link
                    </label>
                    <label className="flex items-center">
                      <input type="radio" value="file" checked={imageUploadType === 'file'} onChange={(e) => setImageUploadType(e.target.value)} className="mr-2" />
                      Upload File
                    </label>
                  </div>
                  {imageUploadType === 'link' ? (
                    <input type="text" placeholder="Image URL" value={galleryForm.image} onChange={(e) => setGalleryForm({...galleryForm, image: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} required={!editingGallery} className="w-full px-4 py-2 border rounded-lg" />
                  )}
                  {galleryForm.image && galleryForm.image.startsWith('data:') && (
                    <img src={galleryForm.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>
                <input type="text" placeholder="Gallery Name" value={galleryForm.galleryName} onChange={(e) => setGalleryForm({...galleryForm, galleryName: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Title" value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                <textarea placeholder="Description" value={galleryForm.description} onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="2" />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingGallery ? 'Update' : 'Upload'}</button>
                  <button type="button" onClick={() => {
                    setShowGalleryForm(false);
                    setEditingGallery(null);
                    setGalleryForm({ image: '', galleryName: '', title: '', description: '' });
                    setImageUploadType('link');
                  }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {galleryImages.map((img) => (
                <div key={img._id} className="bg-neutral-2 p-4 rounded-lg">
                  <div className="h-48 bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                    {img.image ? <img src={img.image} alt={img.title} className="h-full w-full object-cover rounded" /> : <FiImage className="text-4xl text-gray-400" />}
                  </div>
                  <h3 className="font-semibold text-neutral-3 mb-1">{img.galleryName}</h3>
                  <p className="text-sm text-neutral-3/70 mb-2">{img.title}</p>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditGallery(img)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                    <button onClick={() => handleDelete('gallery', img._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'classes':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Classes</h2>
              <button onClick={() => {
                setShowClassForm(!showClassForm);
                if (!showClassForm) {
                  setEditingClass(null);
                  setClassForm({ className: '', section: '', description: '' });
                }
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiUserPlus />
                <span>Add Class</span>
              </button>
            </div>
            {showClassForm && (
              <form onSubmit={handleSubmitClass} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingClass ? 'Edit Class' : 'Add Class'}</h3>
                <input type="text" placeholder="Class Name (e.g., 10th, 11th, 12th)" value={classForm.className} onChange={(e) => setClassForm({...classForm, className: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                <input type="text" placeholder="Section (Optional)" value={classForm.section} onChange={(e) => setClassForm({...classForm, section: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                <textarea placeholder="Description (Optional)" value={classForm.description} onChange={(e) => setClassForm({...classForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="2" />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingClass ? 'Update Class' : 'Add Class'}</button>
                  <button type="button" onClick={() => {
                    setShowClassForm(false);
                    setEditingClass(null);
                    setClassForm({ className: '', section: '', description: '' });
                  }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Class Name</th>
                    <th className="px-4 py-3 text-left">Section</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c._id} className="border-b border-neutral-1">
                      <td className="px-4 py-3 text-neutral-3">{c.className}</td>
                      <td className="px-4 py-3 text-neutral-3">{c.section || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditClass(c)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                          <button onClick={() => handleDelete('class', c._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'fees':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Fees Management</h2>
              <button onClick={() => {
                setShowFeeForm(!showFeeForm);
                if (!showFeeForm) {
                  setEditingFee(null);
                  setFeeForm({
                    selectedClass: '', selectedStudent: '', studentName: '', amount: '', feesType: 'monthly',
                    month: '', installmentNumber: '', dueDate: '', remarks: '', feeCategory: 'regular', transportAmount: ''
                  });
                  setClassStudents([]);
                }
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiDollarSign />
                <span>Add Fee</span>
              </button>
            </div>
            {showFeeForm && (
              <form onSubmit={handleSubmitFee} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingFee ? 'Edit Fee' : 'Add Fee'}</h3>
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
                      value={feeStudentSearchQuery}
                      onChange={(e) => {
                        setFeeStudentSearchQuery(e.target.value);
                        if (!e.target.value) {
                          setFeeSearchResults([]);
                          setFeeForm({...feeForm, selectedStudent: '', studentName: '', transportAmount: ''});
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    {(feeSearchResults.length > 0 || (feeStudentSearchQuery && feeSearchResults.length === 0 && feeStudentSearchQuery.length >= 2)) && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {feeSearchResults.length > 0 ? (
                          feeSearchResults.map((s) => (
                            <div
                              key={s._id}
                              onClick={() => {
                                setFeeForm({...feeForm, selectedStudent: s._id, studentName: s.studentName, transportAmount: ''});
                                setFeeStudentSearchQuery(`${s.rollNumber} / ${s.enrollmentNumber} - ${s.studentName}`);
                                setFeeSearchResults([]);
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
                    {!feeStudentSearchQuery && (
                      <select
                        value={feeForm.selectedStudent}
                        onChange={(e) => {
                          const student = classStudents.find(s => s._id === e.target.value);
                          setFeeForm({...feeForm, selectedStudent: e.target.value, studentName: student ? student.studentName : '', transportAmount: ''});
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
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingFee ? 'Update Fee' : 'Submit Fee'}</button>
                    <button type="button" onClick={() => {
                      setShowFeeForm(false);
                      setEditingFee(null);
                      setFeeForm({
                        selectedClass: '', selectedStudent: '', studentName: '', amount: '', feesType: 'monthly',
                        month: '', installmentNumber: '', dueDate: '', remarks: '', feeCategory: 'regular', transportAmount: ''
                      });
                      setClassStudents([]);
                      setFeeStudentSearchQuery('');
                      setFeeSearchResults([]);
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
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditFee(f)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                          <button onClick={() => handleDelete('fee', f._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'fines':
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
                }
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiDollarSign />
                <span>Add Fine</span>
              </button>
            </div>
            {showFineForm && (
              <form onSubmit={handleSubmitFine} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingFine ? 'Edit Fine' : 'Add Fine'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Select Student</label>
                    <select
                      value={fineForm.selectedStudent}
                      onChange={(e) => {
                        const student = students.find(s => s._id === e.target.value);
                        setFineForm({...fineForm, selectedStudent: e.target.value, studentName: student ? student.studentName : ''});
                      }}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Student</option>
                      {students.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.rollNumber} / {s.enrollmentNumber} - {s.studentName}
                        </option>
                      ))}
                    </select>
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
                    <label className="block text-sm text-neutral-3/70 mb-1">Fine Amount <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="Amount" value={fineForm.amount} onChange={(e) => setFineForm({...fineForm, amount: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Due Date <span className="text-red-500">*</span></label>
                    <input type="date" value={fineForm.dueDate} onChange={(e) => setFineForm({...fineForm, dueDate: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-neutral-3/70 mb-1">Reason <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Reason for fine" value={fineForm.reason} onChange={(e) => setFineForm({...fineForm, reason: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-neutral-3/70 mb-1">Remarks (Optional)</label>
                    <textarea value={fineForm.remarks} onChange={(e) => setFineForm({...fineForm, remarks: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="2" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Save</button>
                  <button type="button" onClick={() => {
                    setShowFineForm(false);
                    setEditingFine(null);
                    setFineForm({
                      selectedStudent: '', studentName: '', amount: '', reason: '', dueDate: '', remarks: '', fineType: 'other'
                    });
                  }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Fine Type</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                    <th className="px-4 py-3 text-left">Due Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fines.map((f) => (
                    <tr key={f._id} className="border-b border-neutral-1">
                      <td className="px-4 py-3 text-neutral-3">{f.studentId?.studentName || 'N/A'}</td>
                      <td className="px-4 py-3 text-neutral-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          f.fineType === 'late' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {f.fineType === 'late' ? 'Late Fine' : 'Other'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-3 font-semibold">₹{f.amount}</td>
                      <td className="px-4 py-3 text-neutral-3">{f.reason}</td>
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
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditFine(f)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                          <button onClick={() => handleDelete('fine', f._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'classTeachers':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Class Teachers</h2>
              <button onClick={() => {
                setClassTeacherForm({ teacherId: '', className: '', section: '' });
                setEditingClassTeacher(null);
                setTeacherSearchQuery('');
                setTeacherSearchResults([]);
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiUserPlus />
                <span>Assign Class Teacher</span>
              </button>
            </div>
            <form onSubmit={handleSubmitClassTeacher} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingClassTeacher ? 'Edit Class Teacher' : 'Assign Class Teacher'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-sm text-neutral-3/70 mb-1">Select Teacher</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    value={teacherSearchQuery}
                    onChange={(e) => {
                      setTeacherSearchQuery(e.target.value);
                      if (!e.target.value) {
                        setTeacherSearchResults([]);
                        setClassTeacherForm({...classTeacherForm, teacherId: ''});
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {(teacherSearchResults.length > 0 || (teacherSearchQuery && teacherSearchResults.length === 0 && teacherSearchQuery.length >= 2)) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {teacherSearchResults.length > 0 ? (
                        teacherSearchResults.map((t) => (
                          <div
                            key={t._id}
                            onClick={() => {
                              setClassTeacherForm({...classTeacherForm, teacherId: t._id});
                              setTeacherSearchQuery(`${t.name} (${t.email})`);
                              setTeacherSearchResults([]);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {t.name} ({t.email}) - {t.role}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No teachers found</div>
                      )}
                    </div>
                  )}
                  {!teacherSearchQuery && (
                    <select
                      value={classTeacherForm.teacherId}
                      onChange={(e) => setClassTeacherForm({...classTeacherForm, teacherId: e.target.value})}
                      required
                      className="w-full px-4 py-2 border rounded-lg mt-2"
                    >
                      <option value="">Or select from list</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-neutral-3/70 mb-1">Select Class</label>
                  <select
                    value={classTeacherForm.className}
                    onChange={(e) => setClassTeacherForm({...classTeacherForm, className: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c._id} value={c.className}>{c.className} {c.section ? `- ${c.section}` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-3/70 mb-1">Section (Optional)</label>
                  <input
                    type="text"
                    placeholder="Section"
                    value={classTeacherForm.section}
                    onChange={(e) => setClassTeacherForm({...classTeacherForm, section: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingClassTeacher ? 'Update' : 'Assign Class Teacher'}</button>
                <button type="button" onClick={() => {
                  setClassTeacherForm({ teacherId: '', className: '', section: '' });
                  setEditingClassTeacher(null);
                  setTeacherSearchQuery('');
                  setTeacherSearchResults([]);
                }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Clear</button>
              </div>
            </form>
            <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Teacher Name</th>
                    <th className="px-4 py-3 text-left">Class</th>
                    <th className="px-4 py-3 text-left">Section</th>
                    <th className="px-4 py-3 text-left">Total Students</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classTeachers.map((ct) => {
                    const studentCount = students.filter(s => s.class === ct.className).length;
                    return (
                      <tr key={ct._id} className="border-b border-neutral-1">
                        <td className="px-4 py-3 text-neutral-3">{ct.teacherId?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-neutral-3">{ct.className}</td>
                      <td className="px-4 py-3 text-neutral-3">{ct.section || 'N/A'}</td>
                      <td className="px-4 py-3 text-neutral-3 font-semibold">{studentCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditClassTeacher(ct)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                          <button onClick={() => handleDelete('classTeacher', ct._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                        </div>
                      </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'enrollmentNumbers':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Enrollment Numbers</h2>
              <button onClick={() => {
                setEnrollmentForm({ enrollmentNumber: '', name: '' });
                setEditingEnrollment(null);
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiUserPlus />
                <span>Add Enrollment Number</span>
              </button>
            </div>
            <form onSubmit={handleSubmitEnrollment} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingEnrollment ? 'Edit Enrollment Number' : 'Add Enrollment Number'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-3/70 mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    placeholder="Enter enrollment number"
                    value={enrollmentForm.enrollmentNumber}
                    onChange={(e) => setEnrollmentForm({...enrollmentForm, enrollmentNumber: e.target.value})}
                    required
                    disabled={editingEnrollment?.isUsed}
                    className={`w-full px-4 py-2 border rounded-lg ${editingEnrollment?.isUsed ? 'bg-gray-100' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-3/70 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter student name"
                    value={enrollmentForm.name}
                    onChange={(e) => setEnrollmentForm({...enrollmentForm, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingEnrollment ? 'Update' : 'Add Enrollment Number'}</button>
                <button type="button" onClick={() => {
                  setEnrollmentForm({ enrollmentNumber: '', name: '' });
                  setEditingEnrollment(null);
                }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Clear</button>
              </div>
            </form>
            <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Enrollment Number</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Used By</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentNumbers.map((en) => (
                    <tr key={en._id} className="border-b border-neutral-1">
                      <td className="px-4 py-3 text-neutral-3 font-semibold">{en.enrollmentNumber}</td>
                      <td className="px-4 py-3 text-neutral-3">{en.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          en.isUsed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {en.isUsed ? 'Used' : 'Available'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-3">{en.usedBy?.name || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditEnrollment(en)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                          <button onClick={() => handleDelete('enrollmentNumber', en._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'addTeacher':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Add Teacher/Accountant</h2>
              <button onClick={() => {
                setShowTeacherForm(!showTeacherForm);
                if (!showTeacherForm) {
                  setEditingTeacher(null);
                  setTeacherForm({
                    name: '', email: '', password: '', phone: '', address: '', qualification: '',
                    experience: '', specialization: '', otherDetails: '', role: 'teacher'
                  });
                }
              }} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
                <FiUserPlus />
                <span>{showTeacherForm ? 'Cancel' : 'Add Teacher/Accountant'}</span>
              </button>
            </div>
            {showTeacherForm && (
              <form onSubmit={handleSubmitTeacher} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingTeacher ? 'Edit Teacher/Accountant' : 'Add Teacher/Accountant'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Full Name" value={teacherForm.name} onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Email <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="Email Address" value={teacherForm.email} onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Password {!editingTeacher && <span className="text-red-500">*</span>}</label>
                    <input type="password" placeholder={editingTeacher ? "Leave blank to keep current password" : "Password"} value={teacherForm.password} onChange={(e) => setTeacherForm({...teacherForm, password: e.target.value})} required={!editingTeacher} className="w-full px-4 py-2 border rounded-lg" />
                    {editingTeacher && <p className="text-xs text-neutral-3/50 mt-1">Leave blank to keep current password</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Contact Number</label>
                    <input type="tel" placeholder="Phone Number" value={teacherForm.phone} onChange={(e) => setTeacherForm({...teacherForm, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Role <span className="text-red-500">*</span></label>
                    <select value={teacherForm.role} onChange={(e) => setTeacherForm({...teacherForm, role: e.target.value})} required className="w-full px-4 py-2 border rounded-lg">
                      <option value="teacher">Teacher</option>
                      <option value="accountant">Accountant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Qualification</label>
                    <input type="text" placeholder="e.g., M.Sc, B.Ed" value={teacherForm.qualification} onChange={(e) => setTeacherForm({...teacherForm, qualification: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Experience</label>
                    <input type="text" placeholder="e.g., 5 years" value={teacherForm.experience} onChange={(e) => setTeacherForm({...teacherForm, experience: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Specialization</label>
                    <input type="text" placeholder="e.g., Mathematics, Science" value={teacherForm.specialization} onChange={(e) => setTeacherForm({...teacherForm, specialization: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-neutral-3/70 mb-1">Address</label>
                    <input type="text" placeholder="Address" value={teacherForm.address} onChange={(e) => setTeacherForm({...teacherForm, address: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-neutral-3/70 mb-1">Other Details</label>
                    <textarea placeholder="Additional information" value={teacherForm.otherDetails} onChange={(e) => setTeacherForm({...teacherForm, otherDetails: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="3" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">{editingTeacher ? 'Update' : 'Add Teacher/Accountant'}</button>
                  <button type="button" onClick={() => {
                    setShowTeacherForm(false);
                    setEditingTeacher(null);
                    setTeacherForm({
                      name: '', email: '', password: '', phone: '', address: '', qualification: '',
                      experience: '', specialization: '', otherDetails: '', role: 'teacher'
                    });
                  }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Qualification</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t._id} className="border-b border-neutral-1">
                      <td className="px-4 py-3 text-neutral-3">{t.name}</td>
                      <td className="px-4 py-3 text-neutral-3">{t.email}</td>
                      <td className="px-4 py-3 text-neutral-3">{t.phone || 'N/A'}</td>
                      <td className="px-4 py-3 text-neutral-3 capitalize">{t.role}</td>
                      <td className="px-4 py-3 text-neutral-3">{t.qualification || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditTeacher(t)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                          <button onClick={() => handleDelete('teacher', t._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'students':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-3">Students</h2>
              <button onClick={() => {
                setShowStudentForm(!showStudentForm);
                setEditingStudent(null);
                setStudentForm({
                  studentName: '', fathersName: '', mothersName: '', address: '', class: '',
                  rollNumber: '', enrollmentNumber: '', mobileNumber: '', studentType: 'dayScholar', busRoute: '', email: '', transportOpted: false
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
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Class</label>
                    <select value={studentForm.class} onChange={(e) => setStudentForm({...studentForm, class: e.target.value})} required className="w-full px-4 py-2 border rounded-lg">
                      <option value="">Select Class</option>
                      {classes.map((c) => (
                        <option key={c._id} value={c.className}>{c.className} {c.section ? `- ${c.section}` : ''}</option>
                      ))}
                    </select>
                  </div>
                  <input type="text" placeholder="Roll Number" value={studentForm.rollNumber} onChange={(e) => setStudentForm({...studentForm, rollNumber: e.target.value})} required className="px-4 py-2 border rounded-lg" />
                  <input type="tel" placeholder="Mobile Number" value={studentForm.mobileNumber} onChange={(e) => setStudentForm({...studentForm, mobileNumber: e.target.value})} required className="px-4 py-2 border rounded-lg" />
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Student Type</label>
                    <select value={studentForm.studentType} onChange={(e) => setStudentForm({...studentForm, studentType: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                      <option value="dayScholar">Day Scholar</option>
                      <option value="hosteler">Hosteler</option>
                    </select>
                  </div>
                  {studentForm.studentType === 'dayScholar' && (
                    <>
                      <div>
                        <label className="block text-sm text-neutral-3/70 mb-1">Bus Route</label>
                        <input type="text" placeholder="Bus Route" value={studentForm.busRoute} onChange={(e) => setStudentForm({...studentForm, busRoute: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="transportOpted" checked={studentForm.transportOpted} onChange={(e) => setStudentForm({...studentForm, transportOpted: e.target.checked})} className="mr-2" />
                        <label htmlFor="transportOpted" className="text-sm text-neutral-3/70">Opt for Transport</label>
                      </div>
                    </>
                  )}
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
                    setStudentForm({
                      studentName: '', fathersName: '', mothersName: '', address: '', class: '',
                      rollNumber: '', enrollmentNumber: '', mobileNumber: '', studentType: 'dayScholar', busRoute: '', email: '', transportOpted: false
                    });
                    setEnrollmentDetails(null);
      setEnrollmentLoading(false);
                  }} className="bg-neutral-1 text-neutral-3 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
            {/* Class Filter */}
            <div className="mb-4">
              <label className="block text-sm text-neutral-3/70 mb-2">Filter by Class</label>
              <select
                value={selectedClassForStudents}
                onChange={(e) => setSelectedClassForStudents(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full md:w-64"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.className}>
                    {cls.className} {cls.section ? `- ${cls.section}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Class</th>
                    <th className="px-4 py-3 text-left">Roll No</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((s) => !selectedClassForStudents || s.class === selectedClassForStudents)
                    .map((s) => (
                    <tr key={s._id} className="border-b border-neutral-1">
                      <td className="px-4 py-3 text-neutral-3">{s.studentName}</td>
                      <td className="px-4 py-3 text-neutral-3">{s.class}</td>
                      <td className="px-4 py-3 text-neutral-3">{s.rollNumber}</td>
                      <td className="px-4 py-3 text-neutral-3">{s.mobileNumber}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditStudent(s)} className="text-secondary hover:text-secondary-600"><FiEdit /></button>
                          <button onClick={() => handleDelete('student', s._id)} className="text-red-600 hover:text-red-700"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'examResults':
        return (
          <div>
            <h2 className="text-2xl font-bold text-neutral-3 mb-6">Exam Results</h2>
            
            {/* Class Selection */}
            <div className="bg-neutral-2 rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-neutral-3 font-semibold mb-2">Select Class</label>
                  <select
                    value={selectedClassForExam}
                    onChange={async (e) => {
                      const className = e.target.value;
                      setSelectedClassForExam(className);
                      if (className) {
                        try {
                          const res = await axios.get(`${API_BASE_URL}/api/examResults/class/${className}`);
                          setExamResults(res.data);
                        } catch (error) {
                          console.error('Error fetching exam results:', error);
                          setExamResults([]);
                        }
                      } else {
                        setExamResults([]);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="">-- Select Class --</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls.className}>
                        {cls.className} {cls.section ? `- ${cls.section}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {examResults.length > 0 ? (
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
                          <h3 className="text-xl font-bold text-neutral-3 capitalize">{group.examType.replace('-', ' ')} Exam</h3>
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
                            </tr>
                          </thead>
                          <tbody>
                            {group.results.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })).map((result, index) => (
                              <tr key={result._id} className="border-b border-neutral-1">
                                <td className="px-4 py-3 text-neutral-3">{index + 1}</td>
                                <td className="px-4 py-3 text-neutral-3">{result.rollNumber}</td>
                                <td className="px-4 py-3 text-neutral-3">{result.studentName}</td>
                                <td className="px-4 py-3 text-neutral-3 font-semibold">{result.examPercent}%</td>
                                <td className="px-4 py-3">
                                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                    result.examPercent >= 50 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {getGrade(result.examPercent)}
                                  </span>
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
            ) : selectedClassForExam ? (
              <div className="bg-neutral-2 rounded-lg shadow-md p-12 text-center">
                <p className="text-neutral-3/70 text-lg">No results found for this class</p>
              </div>
            ) : (
              <div className="bg-neutral-2 rounded-lg shadow-md p-12 text-center">
                <p className="text-neutral-3/70 text-lg">Please select a class to view exam results</p>
              </div>
            )}
          </div>
        );

      case 'notices':
        return (
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
                          onClick={() => handleDelete('notice', notice._id)}
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
        );

      default:
        return null;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiSettings },
    { id: 'users', label: 'Manage Users', icon: FiUsers },
    { id: 'addTeacher', label: 'Add Teacher', icon: FiUserPlus },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'events', label: 'Events', icon: FiCalendar },
    { id: 'carousel', label: 'Carousel', icon: FiImage },
    { id: 'contacts', label: 'Contact Queries', icon: FiMail },
    { id: 'gallery', label: 'Gallery', icon: FiImage },
    { id: 'classes', label: 'Classes', icon: FiFileText },
    { id: 'classTeachers', label: 'Class Teachers', icon: FiUsers },
    { id: 'enrollmentNumbers', label: 'Enrollment Numbers', icon: FiFileText },
    { id: 'students', label: 'Students', icon: FiUserPlus },
    { id: 'fees', label: 'Fees', icon: FiDollarSign },
    { id: 'fines', label: 'Fines', icon: FiDollarSign },
    { id: 'examResults', label: 'Exam Results', icon: FiAward },
    { id: 'notices', label: 'Notices', icon: FiBell }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-1">
      <Header />
      <div className="flex-grow flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-primary text-white transition-all duration-300 overflow-hidden ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-white">
                <FiX />
              </button>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      activeTab === item.id ? 'bg-secondary text-white' : 'hover:bg-primary-700'
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="mb-4 md:hidden bg-primary text-white p-2 rounded">
              <FiMenu />
            </button>
          )}
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
