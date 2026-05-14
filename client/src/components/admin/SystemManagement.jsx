import React, { useState } from "react";
import axios from "axios";
import { FiLogOut, FiTrash2, FiMail, FiActivity, FiDatabase } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const SystemManagement = ({ 
  stats, 
  contacts, 
  sessions, 
  fetchDashboardData, 
  handleDelete 
}) => {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  const handleLogoutSession = async (sessionId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/sessions/${sessionId}/logout`);
      fetchDashboardData();
      alert("Session logged out successfully!");
    } catch (error) {
      alert("Error logging out session");
    }
  };

  return (
    <div>
      <div className="flex space-x-4 mb-6 border-b border-neutral-1">
        {["overview", "sessions", "contacts"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-2 px-1 capitalize font-medium transition ${activeSubTab === tab ? "text-primary border-b-2 border-primary" : "text-neutral-3/60 hover:text-neutral-3"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === "overview" && (
        <div className="animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <StatCard label="Total Users" value={stats.users} icon={<FiActivity className="text-blue-500" />} />
            <StatCard label="Students" value={stats.students} icon={<FiDatabase className="text-green-500" />} />
            <StatCard label="Events" value={stats.events} icon={<FiActivity className="text-purple-500" />} />
            <StatCard label="Contacts" value={stats.contacts} icon={<FiMail className="text-orange-500" />} />
          </div>
        </div>
      )}

      {activeSubTab === "sessions" && (
        <div className="animate-fadeIn bg-neutral-2 rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s._id} className="border-b border-neutral-1">
                  <td className="px-4 py-3">
                    <p className="font-medium">{s.userId?.name || "Deleted"}</p>
                    <p className="text-xs opacity-50">{s.userId?.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{s.userId?.role}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.isActive ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-800"}`}>
                      {s.isActive ? "ACTIVE" : "LOGGED OUT"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {s.isActive && (
                      <button onClick={() => handleLogoutSession(s._id)} className="text-red-600 hover:bg-red-50 p-1 rounded transition">
                        <FiLogOut />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === "contacts" && (
        <div className="animate-fadeIn space-y-4">
          {contacts.map(c => (
            <div key={c._id} className="bg-neutral-2 p-4 rounded-lg border border-neutral-1 flex justify-between items-start">
              <div>
                <p className="font-bold">{c.name} <span className="font-normal opacity-50 text-xs ml-2">{c.email}</span></p>
                <p className="text-sm mt-1">{c.message}</p>
                <p className="text-[10px] opacity-40 mt-2">{formatDateDDMMYYYY(c.createdAt)}</p>
              </div>
              <button onClick={() => handleDelete("contact", c._id)} className="text-red-600"><FiTrash2 /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-neutral-2 p-6 rounded-xl shadow-sm border border-neutral-1 flex items-center gap-4">
    <div className="p-3 bg-white rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="text-xs font-medium text-neutral-3/50 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-neutral-3">{value}</p>
    </div>
  </div>
);

export default SystemManagement;
