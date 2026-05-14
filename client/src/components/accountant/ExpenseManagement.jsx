import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrendingDown, FiPlus, FiTrash2, FiDollarSign, FiTag, FiCalendar } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", category: "Salary", date: new Date().toISOString().split('T')[0], remarks: "" });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/expenses`);
      setExpenses(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/expenses`, form);
      alert("Expense recorded!");
      setShowForm(false);
      setForm({ title: "", amount: "", category: "Salary", date: new Date().toISOString().split('T')[0], remarks: "" });
      fetchExpenses();
    } catch (e) { alert("Error recording expense"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete record?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (e) { alert("Error deleting record"); }
  };

  const categories = ["Salary", "Electricity", "Maintenance", "Stationery", "Rent", "Other"];

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-3 flex items-center gap-2"><FiTrendingDown className="text-red-600" /> School Expenditures</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-red-100">
          <FiPlus /> {showForm ? "Cancel" : "Record Expense"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border-2 border-red-50 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="text" placeholder="Expense Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-4 py-3 border rounded-xl outline-none">
               {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
          </div>
          <textarea placeholder="Remarks (optional)..." value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none h-20" />
          <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold">Record Expenditure</button>
        </form>
      )}

      <div className="bg-neutral-2 rounded-2xl border border-neutral-1 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-3 text-white">
            <tr>
              <th className="px-6 py-4">Expense Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e._id} className="border-b border-neutral-1 hover:bg-neutral-1 transition">
                <td className="px-6 py-4">
                   <p className="font-bold text-neutral-3">{e.title}</p>
                   <p className="text-[10px] opacity-40 uppercase font-black">Added by {e.addedBy?.name || "System"}</p>
                </td>
                <td className="px-6 py-4"><span className="bg-neutral-1 px-3 py-1 rounded-full text-[10px] font-black uppercase text-neutral-3/60 tracking-wider">{e.category}</span></td>
                <td className="px-6 py-4 font-black text-red-600">₹{e.amount}</td>
                <td className="px-6 py-4 opacity-50">{formatDateDDMMYYYY(e.date)}</td>
                <td className="px-6 py-4"><button onClick={() => handleDelete(e._id)} className="text-red-600"><FiTrash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && <div className="p-10 text-center opacity-30 italic">No expenditure records found</div>}
      </div>
    </div>
  );
};

export default ExpenseManagement;
