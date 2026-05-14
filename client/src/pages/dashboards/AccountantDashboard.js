import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import {
  FiDollarSign, FiUsers, FiFileText, FiTrendingUp, FiLogOut, FiMenu, FiBell, FiActivity, FiBriefcase, FiCalendar
} from "react-icons/fi";

// Modular Components
import AccountantFeeManagement from "../../components/accountant/AccountantFeeManagement";
import AccountantFineManagement from "../../components/accountant/AccountantFineManagement";
import CircularView from "../../components/CircularView";
import LeaveManagement from "../../components/LeaveManagement";
import ExpenseManagement from "../../components/accountant/ExpenseManagement";
import FinancialAnalytics from "../../components/admin/FinancialAnalytics"; // Re-using Admin's premium charts

const AccountantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // States
  const [fees, setFees] = useState([]);
  const [fines, setFines] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, pending: 0, students: 0 });

  const fetchData = async () => {
    try {
      const [feesRes, finesRes, studentsRes, classesRes, notifsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/fees`),
        axios.get(`${API_BASE_URL}/api/fines`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students`),
        axios.get(`${API_BASE_URL}/api/classes`),
        axios.get(`${API_BASE_URL}/api/notifications`).catch(() => ({ data: [] })),
      ]);

      setFees(feesRes.data);
      setFines(finesRes.data || []);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
      setNotifications(notifsRes.data.slice(0, 5));

      const totalRevenue = feesRes.data.filter(f => f.status === "paid").reduce((acc, f) => acc + (f.amount || 0), 0);
      const totalPending = feesRes.data.filter(f => f.status === "pending").reduce((acc, f) => acc + (f.amount || 0), 0);

      setStats({
        revenue: totalRevenue,
        pending: totalPending,
        students: studentsRes.data.length
      });
    } catch (error) {
      console.error("Error fetching accountant data", error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "accountant") navigate("/login");
    fetchData();
  }, [user, navigate]);

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: <FiActivity /> },
    { id: "fees", label: "Fee Records", icon: <FiDollarSign /> },
    { id: "fines", label: "Fine Records", icon: <FiBriefcase /> },
    { id: "expenses", label: "Expenditures", icon: <FiTrendingUp /> },
    { id: "leaves", label: "Leaves", icon: <FiCalendar /> },
    { id: "circulars", label: "Circulars", icon: <FiFileText /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Total Collected" value={`₹${stats.revenue.toLocaleString()}`} icon={<FiTrendingUp className="text-green-500" />} color="bg-green-50" />
              <StatCard label="Pending Dues" value={`₹${stats.pending.toLocaleString()}`} icon={<FiDollarSign className="text-orange-500" />} color="bg-orange-50" />
              <StatCard label="Total Students" value={stats.students} icon={<FiUsers className="text-blue-500" />} color="bg-blue-50" />
            </div>
            
            {/* Premium Analytics Section */}
            <div className="bg-neutral-2 p-6 rounded-3xl border border-neutral-1 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-3 mb-6">Financial Analytics</h3>
              <FinancialAnalytics fees={fees} fines={fines} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1">
                <h3 className="text-lg font-bold text-neutral-3 mb-4">Recent Fee Collection</h3>
                <div className="space-y-3">
                  {fees.slice(0, 5).map(f => (
                    <div key={f._id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-neutral-1">
                      <div>
                        <p className="font-bold text-sm">{f.studentId?.studentName}</p>
                        <p className="text-[10px] opacity-50 uppercase tracking-widest">{f.feesType}</p>
                      </div>
                      <span className="font-black text-primary">₹{f.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1">
                <h3 className="text-lg font-bold text-neutral-3 mb-4">Latest Notifications</h3>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n._id} className="p-3 bg-white rounded-xl border border-neutral-1">
                      <p className="font-bold text-sm text-neutral-3">{n.title}</p>
                      <p className="text-[10px] opacity-60 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "fees":
        return <AccountantFeeManagement fees={fees} students={students} classes={classes} fetchDashboardData={fetchData} />;
      case "fines":
        return <AccountantFineManagement fines={fines} students={students} fetchDashboardData={fetchData} />;
      case "expenses":
        return <ExpenseManagement />;
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
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-neutral-3">ACCOUNTS<span className="text-primary">.</span></span>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-neutral-1 rounded-xl transition text-neutral-3"><FiMenu /></button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
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
  <div className={`${color} p-6 rounded-3xl shadow-sm border border-black/5 flex items-center gap-4 hover:translate-y-[-2px] transition-all`}>
    <div className="p-4 bg-white rounded-2xl shadow-sm text-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-neutral-3/40 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-neutral-3">{value}</p>
    </div>
  </div>
);

export default AccountantDashboard;
