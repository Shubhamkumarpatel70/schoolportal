import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiPlus, FiUser } from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";
import { formatDateDDMMYYYY } from "../utils/date";

const LeaveManagement = ({ user }) => {
  const [myLeaves, setMyLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchMyLeaves();
    if (user.role === 'admin' || user.role === 'teacher') {
      fetchPendingLeaves();
      fetchAllLeaves();
    }
  }, [user]);

  const fetchMyLeaves = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/leaves/my`);
      setMyLeaves(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchPendingLeaves = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/leaves/pending`);
      setPendingLeaves(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchAllLeaves = async () => {
    try {
      const endpoint = user.role === 'admin' ? '/api/leaves/all' : '/api/leaves/pending?all=true'; 
      const res = await axios.get(`${API_BASE_URL}${endpoint}`);
      setAllLeaves(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/leaves/apply`, form);
      alert("Leave applied successfully!");
      setShowForm(false);
      setForm({ startDate: "", endDate: "", reason: "" });
      fetchMyLeaves();
    } catch (e) { alert("Error applying leave"); }
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/leaves/${id}/status`, { status });
      fetchPendingLeaves();
    } catch (e) { alert("Error updating status"); }
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-3">Leave Management</h2>
        {user.role !== 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
            <FiPlus /> {showForm ? "Cancel" : "Apply for Leave"}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-3/50 uppercase">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none focus:border-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-3/50 uppercase">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none focus:border-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-3/50 uppercase">Reason</label>
            <textarea placeholder="Explain your reason..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none h-32" />
          </div>
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Submit Application</button>
        </form>
      )}

      {(user.role === 'admin' || user.role === 'teacher') && pendingLeaves.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-3/60 uppercase tracking-widest text-xs">Pending Approvals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLeaves.map(l => (
              <div key={l._id} className="bg-white p-5 rounded-2xl border border-neutral-1 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-1 rounded-xl flex items-center justify-center text-primary"><FiUser /></div>
                    <div>
                      <p className="font-bold text-neutral-3">{l.user?.name}</p>
                      <p className="text-[10px] opacity-50 uppercase font-bold tracking-widest">{l.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStatus(l._id, 'approved')} className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition"><FiCheckCircle /></button>
                    <button onClick={() => handleStatus(l._id, 'rejected')} className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition"><FiXCircle /></button>
                  </div>
                </div>
                <div className="bg-neutral-1 p-3 rounded-xl">
                  <p className="text-xs font-bold text-neutral-3/70 flex items-center gap-1 mb-1"><FiCalendar /> {formatDateDDMMYYYY(l.startDate)} - {formatDateDDMMYYYY(l.endDate)}</p>
                  <p className="text-xs italic">"{l.reason}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-neutral-3/60 uppercase tracking-widest text-xs">Leave Log & History</h3>
          <div className="flex gap-2">
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1 border rounded-lg text-xs font-bold outline-none focus:border-primary bg-neutral-2"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1 border rounded-lg text-xs font-bold outline-none focus:border-primary bg-neutral-2"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="bg-neutral-2 rounded-2xl border border-neutral-1 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-primary text-white">
              <tr>
                {(user.role === 'admin' || user.role === 'teacher') && <th className="px-6 py-4">Applicant</th>}
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {(user.role === 'admin' || user.role === 'teacher' ? allLeaves : myLeaves)
                .filter(l => {
                  const d = new Date(l.startDate);
                  return (d.getMonth() + 1) === selectedMonth && d.getFullYear() === selectedYear;
                })
                .map(l => (
                <tr key={l._id} className="border-b border-neutral-1 hover:bg-neutral-1 transition">
                  {(user.role === 'admin' || user.role === 'teacher') && (
                    <td className="px-6 py-4">
                      <p className="font-bold">{l.user?.name}</p>
                      <p className="text-[10px] opacity-50 uppercase tracking-widest">{l.role}</p>
                    </td>
                  )}
                  <td className="px-6 py-4 font-bold">{formatDateDDMMYYYY(l.startDate)} - {formatDateDDMMYYYY(l.endDate)}</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">{l.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${l.status === 'approved' ? 'bg-green-100 text-green-700' : l.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 opacity-50">{formatDateDDMMYYYY(l.appliedOn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(user.role === 'admin' || user.role === 'teacher' ? allLeaves : myLeaves).filter(l => {
            const d = new Date(l.startDate);
            return (d.getMonth() + 1) === selectedMonth && d.getFullYear() === selectedYear;
          }).length === 0 && (
            <div className="p-10 text-center opacity-30 italic">No leaves found for {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
