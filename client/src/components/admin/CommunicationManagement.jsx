import React, { useState } from "react";
import axios from "axios";
import { FiBell, FiEdit, FiTrash2, FiFileText, FiVolume2 } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const CommunicationManagement = ({ 
  notifications, 
  notices, 
  announcements, 
  fetchDashboardData, 
  handleDelete 
}) => {
  const [activeSubTab, setActiveSubTab] = useState("notifications");

  return (
    <div>
      <div className="flex space-x-4 mb-6 border-b border-neutral-1">
        {["notifications", "notices", "announcements"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-2 px-1 capitalize font-medium transition ${activeSubTab === tab ? "text-primary border-b-2 border-primary" : "text-neutral-3/60 hover:text-neutral-3"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === "notifications" && (
        <NotificationList notifications={notifications} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
      {activeSubTab === "notices" && (
        <NoticeList notices={notices} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
      {activeSubTab === "announcements" && (
        <AnnouncementList announcements={announcements} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
    </div>
  );
};

const NotificationList = ({ notifications, fetchDashboardData, handleDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", message: "", type: "general", targetRole: "all" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await axios.put(`${API_BASE_URL}/api/notifications/${editing._id}`, form);
      else await axios.post(`${API_BASE_URL}/api/notifications`, form);
      setShowForm(false);
      setForm({ title: "", message: "", type: "general", targetRole: "all" });
      fetchDashboardData();
    } catch (error) { alert("Error saving notification"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-3">System Notifications</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiBell /> {showForm ? "Cancel" : "New Notification"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <select value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})} className="px-4 py-2 border rounded-lg">
            <option value="all">All Users</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
          </select>
          <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required className="px-4 py-2 border rounded-lg md:col-span-2" rows="2" />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">{editing ? "Update" : "Send"}</button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notifications.map(n => (
          <div key={n._id} className="bg-neutral-2 p-4 rounded-lg border border-neutral-1 flex justify-between items-start">
            <div>
              <h4 className="font-bold text-neutral-3">{n.title}</h4>
              <p className="text-sm opacity-70 mb-2">{n.message}</p>
              <span className="text-[10px] uppercase font-bold text-primary">{n.targetRole}</span>
            </div>
            <button onClick={() => handleDelete("notification", n._id)} className="text-red-600"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NoticeList = ({ notices, fetchDashboardData, handleDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "General", date: new Date().toISOString().split('T')[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/notices`, form);
      setShowForm(false);
      fetchDashboardData();
    } catch (error) { alert("Error saving notice"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-3">Official Notices</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiFileText /> {showForm ? "Cancel" : "Post Notice"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
          <input type="text" placeholder="Notice Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
          <textarea placeholder="Notice Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" rows="4" />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Post</button>
        </form>
      )}
      <div className="bg-neutral-2 rounded-lg shadow-md divide-y divide-neutral-1">
        {notices.map(n => (
          <div key={n._id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{n.title}</p>
              <p className="text-xs opacity-50">{formatDateDDMMYYYY(n.date || n.createdAt)}</p>
            </div>
            <button onClick={() => handleDelete("notice", n._id)} className="text-red-600"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnnouncementList = ({ announcements, fetchDashboardData, handleDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/announcements`, form);
      setShowForm(false);
      fetchDashboardData();
    } catch (error) { alert("Error saving announcement"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-3">Public Announcements</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiVolume2 /> {showForm ? "Cancel" : "New Announcement"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
          <input type="text" placeholder="Announcement Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
          <textarea placeholder="Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" rows="3" />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Broadcast</button>
        </form>
      )}
      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a._id} className="bg-neutral-2 p-4 rounded-lg border-l-4 border-primary flex justify-between items-center">
            <div>
              <h4 className="font-bold">{a.title}</h4>
              <p className="text-sm opacity-70">{a.content}</p>
            </div>
            <button onClick={() => handleDelete("announcement", a._id)} className="text-red-600"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunicationManagement;
