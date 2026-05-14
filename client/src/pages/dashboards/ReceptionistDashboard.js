import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  FiUsers, FiUserPlus, FiLogOut, FiMenu, FiBell, FiActivity, FiSearch, FiCalendar, FiFileText, FiClock
} from "react-icons/fi";

// Modular Components
import InquiryManagement from "../../components/receptionist/InquiryManagement";
import VisitorLog from "../../components/receptionist/VisitorLog";
import CircularView from "../../components/CircularView";
import LeaveManagement from "../../components/LeaveManagement";
import AdmissionManagement from "../../components/admin/AdmissionManagement";

const ReceptionistDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: <FiActivity /> },
    { id: "inquiries", label: "Inquiries", icon: <FiUserPlus /> },
    { id: "visitors", label: "Visitor Log", icon: <FiClock /> },
    { id: "admissions", label: "Admissions", icon: <FiUserPlus /> },
    { id: "leaves", label: "Leaves", icon: <FiCalendar /> },
    { id: "circulars", label: "Circulars", icon: <FiFileText /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="bg-[#4F46E5] text-white p-8 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
               <div className="relative z-10">
                  <h1 className="text-3xl font-bold mb-2">Reception Desk</h1>
                  <p className="opacity-80">Welcome back, {user?.name}. You are the face of our school today.</p>
               </div>
               <FiUsers className="absolute -right-10 -bottom-10 text-[200px] opacity-10 rotate-12" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div onClick={() => setActiveTab("inquiries")} className="bg-white p-6 rounded-2xl border border-neutral-1 cursor-pointer hover:border-indigo-500 transition shadow-sm">
                  <FiUserPlus className="text-[#4F46E5] text-2xl mb-2" />
                  <p className="font-bold">Admission Pipeline</p>
                  <p className="text-xs opacity-50">Manage inquiries</p>
               </div>
               <div onClick={() => setActiveTab("visitors")} className="bg-white p-6 rounded-2xl border border-neutral-1 cursor-pointer hover:border-indigo-500 transition shadow-sm">
                  <FiClock className="text-[#4F46E5] text-2xl mb-2" />
                  <p className="font-bold">Visitor Tracking</p>
                  <p className="text-xs opacity-50">Log entries & exits</p>
               </div>
            </div>
          </div>
        );
      case "inquiries": return <InquiryManagement />;
      case "visitors": return <VisitorLog />;
      case "admissions": return <AdmissionManagement />;
      case "leaves": return <LeaveManagement user={user} />;
      case "circulars": return <CircularView />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-1 flex flex-col font-outfit">
      <Header />
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-white border-r border-neutral-1 transition-all duration-300 flex flex-col z-40`}>
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-[#4F46E5]">RECEPTION<span className="text-indigo-600">.</span></span>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-neutral-1 rounded-xl transition text-neutral-3"><FiMenu /></button>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${activeTab === item.id ? "bg-[#4F46E5] text-white shadow-lg shadow-indigo-200 scale-[1.02]" : "text-neutral-3/60 hover:bg-neutral-1 hover:text-neutral-3"}`}
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

export default ReceptionistDashboard;
