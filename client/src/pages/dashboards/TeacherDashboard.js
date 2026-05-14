import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import {
  FiUsers, FiCalendar, FiBell, FiAward, FiLogOut, FiMenu, FiActivity, FiBook, FiFileText, FiBookOpen
} from "react-icons/fi";

// Modular Components
import TeacherStudentManagement from "../../components/teacher/TeacherStudentManagement";
import TeacherExamResults from "../../components/teacher/TeacherExamResults";
import TeacherAttendance from "../../components/teacher/TeacherAttendance";
import CircularView from "../../components/CircularView";
import LeaveManagement from "../../components/LeaveManagement";
import AssignmentManagement from "../../components/AssignmentManagement";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // States
  const [students, setStudents] = useState([]);
  const [classTeacher, setClassTeacher] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);
  const [stats, setStats] = useState({ students: 0, exams: 0, notices: 0 });

  const fetchTeacherData = async () => {
    try {
      const teacherId = user?._id || user?.id;
      const [classTeacherRes, studentsRes, eventsRes, notificationsRes, schedulesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/classTeachers/teacher/${teacherId}`).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/api/students`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/events`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/notifications`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/examSchedules`).catch(() => ({ data: [] })),
      ]);

      const classData = classTeacherRes.data;
      const allStudents = studentsRes.data || [];
      const myStudents = classData ? allStudents.filter(s => s.class === classData.className) : [];

      setClassTeacher(classData);
      setStudents(myStudents);
      setEvents(eventsRes.data.slice(0, 5));
      setNotifications(notificationsRes.data.slice(0, 5));
      setExamSchedules(schedulesRes.data);

      if (classData) {
        const resultsRes = await axios.get(`${API_BASE_URL}/api/examResults/class/${classData.className}`);
        setExamResults(resultsRes.data);
      }

      setStats({
        students: myStudents.length,
        exams: schedulesRes.data.length,
        notices: notificationsRes.data.length
      });
    } catch (error) {
      console.error("Error fetching teacher data", error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "teacher") navigate("/login");
    fetchTeacherData();
  }, [user, navigate]);

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: <FiActivity /> },
    { id: "students", label: "My Students", icon: <FiUsers /> },
    { id: "attendance", label: "Attendance", icon: <FiCalendar /> },
    { id: "results", label: "Exam Results", icon: <FiAward /> },
    { id: "schedules", label: "Exam Datesheets", icon: <FiBook /> },
    { id: "assignments", label: "Assignments", icon: <FiBookOpen /> },
    { id: "leaves", label: "Leaves", icon: <FiCalendar /> },
    { id: "circulars", label: "Circulars", icon: <FiFileText /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="My Students" value={stats.students} icon={<FiUsers className="text-blue-500" />} color="bg-blue-50" />
              <StatCard label="Scheduled Exams" value={stats.exams} icon={<FiBook className="text-green-500" />} color="bg-green-50" />
              <StatCard label="Latest Notices" value={stats.notices} icon={<FiBell className="text-orange-500" />} color="bg-orange-50" />
            </div>
            <div className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1">
              <h3 className="text-lg font-bold text-neutral-3 mb-4">Upcoming School Events</h3>
              <div className="space-y-3">
                {events.map(e => (
                  <div key={e._id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-neutral-1">
                    <span className="font-medium">{e.title}</span>
                    <span className="text-xs text-primary font-bold">{new Date(e.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "students":
        return <TeacherStudentManagement students={students} classTeacher={classTeacher} fetchTeacherData={fetchTeacherData} />;
      case "attendance":
        return <TeacherAttendance students={students} classTeacher={classTeacher} fetchTeacherData={fetchTeacherData} />;
      case "results":
        return <TeacherExamResults examResults={examResults} students={students} classTeacher={classTeacher} fetchTeacherData={fetchTeacherData} />;
      case "schedules":
        return <ExamScheduleView schedules={examSchedules} />;
      case "assignments":
        return <AssignmentManagement user={user} />;
      case "leaves":
        return <LeaveManagement user={user} />;
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
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-neutral-3">TEACHER<span className="text-secondary">.</span></span>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-neutral-1 rounded-xl transition text-neutral-3"><FiMenu /></button>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${activeTab === item.id ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]" : "text-neutral-3/60 hover:bg-neutral-1 hover:text-neutral-3"}`}
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
  <div className={`${color} p-6 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4 hover:scale-[1.02] transition-transform`}>
    <div className="p-3 bg-white rounded-xl shadow-sm text-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-neutral-3/50 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-neutral-3">{value}</p>
    </div>
  </div>
);

const ExamScheduleView = ({ schedules }) => (
  <div className="space-y-6 animate-fadeIn">
    <h2 className="text-2xl font-bold text-neutral-3">Exam Datesheets</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {schedules.map(s => (
        <div key={s._id} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-3 mb-1">{s.examName}</h3>
          <p className="text-sm font-bold text-primary mb-4">Target: Class {s.className}</p>
          <div className="space-y-2">
            {s.subjects.map((sub, i) => (
              <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-neutral-1 last:border-0">
                <span className="font-medium">{sub.subjectName}</span>
                <span className="opacity-60">{new Date(sub.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TeacherDashboard;
