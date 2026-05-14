import React, { useState } from "react";
import axios from "axios";
import { FiPlus, FiAlertCircle, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const AccountantFineManagement = ({ fines, students, fetchDashboardData }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [form, setForm] = useState({
    selectedStudent: "",
    amount: "",
    reason: "",
    dueDate: new Date().toISOString().split('T')[0]
  });

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length > 2) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/students/search?q=${q}`);
        setSearchResults(res.data);
      } catch (e) { console.error(e); }
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/fines`, {
        studentId: form.selectedStudent,
        ...form
      });
      alert("Fine added successfully!");
      setShowForm(false);
      setForm({ selectedStudent: "", amount: "", reason: "", dueDate: new Date().toISOString().split('T')[0] });
      setSearchQuery("");
      fetchDashboardData();
    } catch (error) { alert("Error adding fine"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/fines/${id}`);
      fetchDashboardData();
    } catch (error) { alert("Error deleting fine"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3 text-red-600">Fine Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-red-200">
          <FiPlus /> {showForm ? "Cancel" : "Impose Fine"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl mb-8 border-2 border-red-50 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-xs font-bold text-neutral-3/50 uppercase tracking-widest">Student Search</label>
              <input 
                type="text" 
                placeholder="Name / Roll..." 
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-red-600"
              />
              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  {searchResults.map(s => (
                    <div 
                      key={s._id} 
                      onClick={() => { setForm({...form, selectedStudent: s._id}); setSearchQuery(s.studentName); setSearchResults([]); }}
                      className="px-4 py-2 hover:bg-neutral-1 cursor-pointer text-sm"
                    >
                      {s.studentName} (Class {s.class} - {s.rollNumber})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-3/50 uppercase tracking-widest">Fine Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Reason (e.g. Damage to Library Book)" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
          </div>
          <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold">Impose Fine</button>
        </form>
      )}

      <div className="bg-neutral-2 rounded-2xl border border-neutral-1 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fines.map(fine => (
              <tr key={fine._id} className="border-b border-neutral-1 hover:bg-neutral-1 transition">
                <td className="px-6 py-4 font-bold">{fine.studentId?.studentName || "N/A"}</td>
                <td className="px-6 py-4 truncate max-w-[200px]">{fine.reason}</td>
                <td className="px-6 py-4 font-black text-red-600">₹{fine.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${fine.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {fine.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(fine._id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountantFineManagement;
