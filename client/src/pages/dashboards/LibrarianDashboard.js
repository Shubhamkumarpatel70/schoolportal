import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  FiBook, FiBookOpen, FiLogOut, FiMenu, FiBell, FiActivity, FiSearch, FiCalendar, FiFileText
} from "react-icons/fi";

// Modular Components
import BookManagement from "../../components/librarian/BookManagement";
import BookIssueManagement from "../../components/librarian/BookIssueManagement";
import CircularView from "../../components/CircularView";
import LeaveManagement from "../../components/LeaveManagement";

const LibrarianDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: <FiActivity /> },
    { id: "catalog", label: "Book Catalog", icon: <FiBook /> },
    { id: "issues", label: "Issue & Return", icon: <FiBookOpen /> },
    { id: "leaves", label: "Leaves", icon: <FiCalendar /> },
    { id: "circulars", label: "Circulars", icon: <FiFileText /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="bg-primary text-white p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden">
               <div className="relative z-10">
                  <h1 className="text-3xl font-bold mb-2">Library Workspace</h1>
                  <p className="opacity-80">Welcome back, {user?.name}. Manage your school's knowledge hub.</p>
               </div>
               <FiBook className="absolute -right-10 -bottom-10 text-[200px] opacity-10 rotate-12" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div onClick={() => setActiveTab("catalog")} className="bg-white p-6 rounded-2xl border border-neutral-1 cursor-pointer hover:border-primary transition">
                  <FiBook className="text-primary text-2xl mb-2" />
                  <p className="font-bold">Catalog Management</p>
                  <p className="text-xs opacity-50">Add/Update books</p>
               </div>
               <div onClick={() => setActiveTab("issues")} className="bg-white p-6 rounded-2xl border border-neutral-1 cursor-pointer hover:border-primary transition">
                  <FiBookOpen className="text-primary text-2xl mb-2" />
                  <p className="font-bold">Circulation</p>
                  <p className="text-xs opacity-50">Handle book issues</p>
               </div>
            </div>
          </div>
        );
      case "catalog": return <BookManagement />;
      case "issues": return <BookIssueManagement />;
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
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-neutral-3">LIBRARIAN<span className="text-primary">.</span></span>}
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

export default LibrarianDashboard;
