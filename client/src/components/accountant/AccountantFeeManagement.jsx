import React, { useState } from "react";
import axios from "axios";
import { FiPlus, FiSearch, FiDollarSign, FiFilter, FiTrash2, FiEdit } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const AccountantFeeManagement = ({ fees, students, classes, fetchDashboardData }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [form, setForm] = useState({
    selectedStudent: "",
    amount: "",
    feesType: "monthly",
    month: "",
    dueDate: new Date().toISOString().split('T')[0],
    remarks: ""
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
      await axios.post(`${API_BASE_URL}/api/fees`, {
        studentId: form.selectedStudent,
        ...form
      });
      alert("Fee added successfully!");
      setShowForm(false);
      setForm({ selectedStudent: "", amount: "", feesType: "monthly", month: "", dueDate: new Date().toISOString().split('T')[0], remarks: "" });
      setSearchQuery("");
      fetchDashboardData();
    } catch (error) { alert("Error adding fee"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Fee Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
          <FiPlus /> {showForm ? "Cancel" : "Add New Fee"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-2xl mb-8 border border-neutral-1 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <label className="text-xs font-bold text-neutral-3/50 uppercase tracking-widest">Student Search</label>
              <input 
                type="text" 
                placeholder="Name / Roll / Enrollment..." 
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-primary"
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
              <label className="text-xs font-bold text-neutral-3/50 uppercase tracking-widest">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={form.feesType} onChange={e => setForm({...form, feesType: e.target.value})} className="px-4 py-3 border rounded-xl outline-none">
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="exam">Exam Fee</option>
            </select>
            <input type="text" placeholder="Month/Description" value={form.month} onChange={e => setForm({...form, month: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
            <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
          </div>
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Generate Fee</button>
        </form>
      )}

      <div className="bg-neutral-2 rounded-2xl border border-neutral-1 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {fees.slice(0, 50).map(fee => (
              <tr key={fee._id} className="border-b border-neutral-1 hover:bg-neutral-1 transition">
                <td className="px-6 py-4 font-bold">{fee.studentId?.studentName}</td>
                <td className="px-6 py-4 capitalize">{fee.feesType}</td>
                <td className="px-6 py-4 font-black">₹{fee.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {fee.status}
                  </span>
                </td>
                <td className="px-6 py-4 opacity-60">{formatDateDDMMYYYY(fee.dueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountantFeeManagement;
