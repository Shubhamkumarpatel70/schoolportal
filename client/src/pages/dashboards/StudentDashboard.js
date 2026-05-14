import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import {
  FiCalendar, FiBell, FiDollarSign, FiUser, FiCheckCircle, FiBookOpen, FiLogOut, FiMenu, FiFileText, FiBook
} from "react-icons/fi";

// Modular Components
import StudentProfile from "../../components/student/StudentProfile";
import StudentExams from "../../components/student/StudentExams";
import StudentAttendance from "./StudentAttendance";
import CircularView from "../../components/CircularView";
import LeaveManagement from "../../components/LeaveManagement";
import StudentLibraryView from "../../components/StudentLibraryView";
import AssignmentManagement from "../../components/AssignmentManagement";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // States
  const [studentData, setStudentData] = useState(null);
  const [fees, setFees] = useState([]);
  const [fines, setFines] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ fees: 0, exams: 0, attendance: "—" });

  const fetchData = async () => {
    try {
      const userId = user?._id || user?.id;
      const [studentRes, feesRes, finesRes, eventsRes, notificationsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/students/${userId}`),
        axios.get(`${API_BASE_URL}/api/fees/student/${userId}`),
        axios.get(`${API_BASE_URL}/api/fines/student/${userId}`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/events`),
        axios.get(`${API_BASE_URL}/api/notifications`).catch(() => ({ data: [] })),
      ]);

      setStudentData(studentRes.data);
      setFees(feesRes.data);
      setFines(finesRes.data || []);
      setEvents(eventsRes.data.slice(0, 5));
      setNotifications(notificationsRes.data.slice(0, 5));

      setStats({
        fees: feesRes.data.filter(f => f.status === "pending").length,
        exams: 0, // Will be updated if schedules are fetched
        attendance: "—"
      });
    } catch (error) {
      console.error("Error fetching student data", error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "student") navigate("/login");
    fetchData();
  }, [user, navigate]);

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: <FiCheckCircle /> },
    { id: "profile", label: "My Profile", icon: <FiUser /> },
    { id: "exams", label: "Exams & Results", icon: <FiBookOpen /> },
    { id: "fees", label: "Fee Details", icon: <FiDollarSign /> },
    { id: "assignments", label: "Assignments", icon: <FiBookOpen /> },
    { id: "attendance", label: "Attendance", icon: <FiCalendar /> },
    { id: "leaves", label: "Leaves", icon: <FiCalendar /> },
    { id: "library", label: "Library", icon: <FiBook /> },
    { id: "circulars", label: "Circulars", icon: <FiFileText /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Pending Fees" value={stats.fees} icon={<FiDollarSign className="text-red-500" />} color="bg-red-50" />
              <StatCard label="Notifications" value={notifications.length} icon={<FiBell className="text-blue-500" />} color="bg-blue-50" />
              <StatCard label="Recent Events" value={events.length} icon={<FiCalendar className="text-green-500" />} color="bg-green-50" />
            </div>
            <div className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-3 mb-4">Latest School News</h3>
              <div className="space-y-4">
                {notifications.map(n => (
                  <div key={n._id} className="p-4 bg-white rounded-xl border border-neutral-1">
                    <p className="font-bold text-neutral-3">{n.title}</p>
                    <p className="text-xs opacity-60 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "profile":
        return <StudentProfile studentData={studentData} user={user} />;
      case "exams":
        return <StudentExams studentData={studentData} />;
      case "attendance":
        return <StudentAttendance user={user} />;
      case "fees":
        return <StudentFeeView fees={fees} fines={fines} />;
      case "assignments":
        return <AssignmentManagement user={user} studentData={studentData} />;
      case "leaves":
        return <LeaveManagement user={user} />;
      case "library":
        return <StudentLibraryView />;
      case "circulars":
        return <CircularView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-1 flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-white border-r border-neutral-1 transition-all duration-300 flex flex-col z-40`}>
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-neutral-3">STUDENT<span className="text-primary">.</span></span>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-neutral-1 rounded-xl transition text-neutral-3"><FiMenu /></button>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" : "text-neutral-3/60 hover:bg-neutral-1 hover:text-neutral-3"}`}
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

const StatCard = ({ label, value, icon, color }) => (
  <div className={`${color} p-6 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4 hover:translate-y-[-2px] transition-transform`}>
    <div className="p-3 bg-white rounded-xl shadow-sm text-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-neutral-3/50 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-neutral-3">{value}</p>
    </div>
  </div>
);

const StudentFeeView = ({ fees, fines }) => (
  <div className="space-y-6 animate-fadeIn">
    <h2 className="text-2xl font-bold text-neutral-3">My Fee Ledger</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-bold text-neutral-3/60 px-2 uppercase text-xs tracking-widest">Fees</h3>
        {fees.map(f => (
          <div key={f._id} className="bg-neutral-2 p-5 rounded-2xl border border-neutral-1 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-neutral-3 capitalize">{f.feesType} Fee</p>
              <p className="text-xs opacity-50">{f.month || "Annual"}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-lg">₹{f.amount}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${f.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {f.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-neutral-3/60 px-2 uppercase text-xs tracking-widest">Fines</h3>
        {fines.map(f => (
          <div key={f._id} className="bg-neutral-2 p-5 rounded-2xl border border-red-100 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-red-600">Late Fine</p>
              <p className="text-xs opacity-50">{f.reason || "Late payment"}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-lg">₹{f.amount}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${f.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {f.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StudentDashboard;
