import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import {
  FiUsers, FiCalendar, FiBell, FiImage, FiMail, FiFileText,
  FiSettings, FiDollarSign, FiAward, FiLogOut, FiMenu, FiX, FiActivity, FiHash, FiTrendingUp, FiBookOpen, FiBook, FiUserPlus
} from "react-icons/fi";

// Modular Components
import FeeManagement from "../../components/admin/FeeManagement";
import StudentManagement from "../../components/admin/StudentManagement";
import AttendanceManagement from "../../components/admin/AttendanceManagement";
import UserManagement from "../../components/admin/UserManagement";
import FineManagement from "../../components/admin/FineManagement";
import AcademicManagement from "../../components/admin/AcademicManagement";
import CommunicationManagement from "../../components/admin/CommunicationManagement";
import ContentManagement from "../../components/admin/ContentManagement";
import SystemManagement from "../../components/admin/SystemManagement";
import FinancialAnalytics from "../../components/admin/FinancialAnalytics";
import ExamManagement from "../../components/admin/ExamManagement";
import CircularManagement from "../../components/admin/CircularManagement";
import LeaveManagement from "../../components/LeaveManagement";
import AdminLibraryView from "../../components/admin/AdminLibraryView";
import AdmissionManagement from "../../components/admin/AdmissionManagement";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Shared Data States
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [fines, setFines] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [enrollmentNumbers, setEnrollmentNumbers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notices, setNotices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ users: 0, students: 0, events: 0, notifications: 0, contacts: 0 });

  const fetchDashboardData = async () => {
    try {
      const [
        usersRes, studentsRes, classesRes, feesRes, finesRes, 
        teachersRes, classTeachersRes, enrollmentsRes, 
        notifsRes, noticesRes, announcementsRes, 
        carouselRes, galleryRes, eventsRes, contactsRes, sessionsRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users`),
        axios.get(`${API_BASE_URL}/api/students`),
        axios.get(`${API_BASE_URL}/api/classes`),
        axios.get(`${API_BASE_URL}/api/fees`),
        axios.get(`${API_BASE_URL}/api/fines`),
        axios.get(`${API_BASE_URL}/api/teachers`),
        axios.get(`${API_BASE_URL}/api/classTeachers`),
        axios.get(`${API_BASE_URL}/api/enrollmentNumbers`),
        axios.get(`${API_BASE_URL}/api/notifications`),
        axios.get(`${API_BASE_URL}/api/notices`),
        axios.get(`${API_BASE_URL}/api/announcements/all`),
        axios.get(`${API_BASE_URL}/api/carousel/all`),
        axios.get(`${API_BASE_URL}/api/gallery`),
        axios.get(`${API_BASE_URL}/api/events`),
        axios.get(`${API_BASE_URL}/api/contacts`),
        axios.get(`${API_BASE_URL}/api/auth/sessions`),
      ]);

      setUsers(usersRes.data);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
      setFees(feesRes.data);
      setFines(finesRes.data);
      setTeachers(teachersRes.data);
      setClassTeachers(classTeachersRes.data);
      setEnrollmentNumbers(enrollmentsRes.data);
      setNotifications(notifsRes.data);
      setNotices(noticesRes.data);
      setAnnouncements(announcementsRes.data);
      setCarouselImages(carouselRes.data);
      setGalleryImages(galleryRes.data);
      setEvents(eventsRes.data);
      setContacts(contactsRes.data);
      setSessions(sessionsRes.data);

      setStats({
        users: usersRes.data.length,
        students: studentsRes.data.length,
        events: eventsRes.data.length,
        notifications: notifsRes.data.length,
        contacts: contactsRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
    fetchDashboardData();
  }, [user, navigate]);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoints = {
        user: `/api/users/${id}`,
        student: `/api/students/${id}`,
        class: `/api/classes/${id}`,
        fee: `/api/fees/${id}`,
        fine: `/api/fines/${id}`,
        teacher: `/api/teachers/${id}`,
        classTeacher: `/api/classTeachers/${id}`,
        enrollmentNumber: `/api/enrollmentNumbers/${id}`,
        notification: `/api/notifications/${id}`,
        notice: `/api/notices/${id}`,
        announcement: `/api/announcements/${id}`,
        carousel: `/api/carousel/${id}`,
        gallery: `/api/gallery/${id}`,
        event: `/api/events/${id}`,
        contact: `/api/contacts/${id}`,
      };
      await axios.delete(`${API_BASE_URL}${endpoints[type]}`);
      fetchDashboardData();
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiActivity /> },
    { id: "finance", label: "Financials", icon: <FiTrendingUp /> },
    { id: "users", label: "Users", icon: <FiUsers /> },
    { id: "students", label: "Students", icon: <FiAward /> },
    { id: "academic", label: "Academic", icon: <FiHash /> },
    { id: "attendance", label: "Attendance", icon: <FiCalendar /> },
    { id: "exams", label: "Exams", icon: <FiBookOpen /> },
    { id: "fees", label: "Fees", icon: <FiDollarSign /> },
    { id: "fines", label: "Fines", icon: <FiDollarSign /> },
    { id: "communication", label: "Communication", icon: <FiBell /> },
    { id: "circulars", label: "Circulars", icon: <FiFileText /> },
    { id: "leaves", label: "Leaves", icon: <FiCalendar /> },
    { id: "library", label: "Library", icon: <FiBook /> },
    { id: "admissions", label: "Admissions", icon: <FiUserPlus /> },
    { id: "content", label: "Website Content", icon: <FiImage /> },
    { id: "system", label: "System", icon: <FiSettings /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <SystemManagement stats={stats} contacts={contacts} sessions={sessions} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
            <FinancialAnalytics fees={fees} fines={fines} />
          </div>
        );
      case "finance":
        return <FinancialAnalytics fees={fees} fines={fines} />;
      case "users":
        return <UserManagement users={users} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />;
      case "students":
        return <StudentManagement students={students} classes={classes} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />;
      case "academic":
        return <AcademicManagement classes={classes} teachers={teachers} classTeachers={classTeachers} enrollmentNumbers={enrollmentNumbers} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />;
      case "attendance":
        return <AttendanceManagement classes={classes} />;
      case "exams":
        return <ExamManagement classes={classes} />;
      case "communication":
        return <CommunicationManagement notifications={notifications} notices={notices} announcements={announcements} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />;
      case "circulars":
        return <CircularManagement />;
      case "leaves":
        return <LeaveManagement user={user} />;
      case "library":
        return <AdminLibraryView />;
      case "admissions":
        return <AdmissionManagement />;
      case "fees":
        return <FeeManagement fees={fees} students={students} classes={classes} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />;
      case "fines":
        return <FineManagement fines={fines} students={students} classes={classes} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />;
      case "content":
        return <ContentManagement carouselImages={carouselImages} galleryImages={galleryImages} events={events} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />;
      default:
        return <div className="p-8 text-center text-neutral-3/50 italic">Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-1 flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-white border-r border-neutral-1 transition-all duration-300 flex flex-col z-40 shadow-sm`}>
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-neutral-3 uppercase">Admin<span className="text-primary">.</span></span>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-neutral-1 rounded-xl transition text-neutral-3"><FiMenu /></button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" : "text-neutral-3/60 hover:bg-neutral-1 hover:text-neutral-3"}`}
                title={item.label}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && <span className="font-bold tracking-wide">{item.label}</span>}
              </button>
            ))}
          </nav>
          <div className="p-4">
            <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-bold">
              <FiLogOut className="text-xl" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
