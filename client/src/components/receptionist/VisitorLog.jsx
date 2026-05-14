import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiClock, FiUser, FiInfo, FiLogOut } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const VisitorLog = () => {
  const [visitors, setVisitors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", purpose: "", whomToMeet: "", inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });

  useEffect(() => { fetchVisitors(); }, []);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/visitors`);
      setVisitors(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/visitors`, form);
      alert("Visitor logged!");
      setShowForm(false);
      setForm({ name: "", contact: "", purpose: "", whomToMeet: "", inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      fetchVisitors();
    } catch (e) { alert("Error logging visitor"); }
  };

  const markExit = async (id) => {
    const outTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      await axios.put(`${API_BASE_URL}/api/visitors/${id}/exit`, { outTime });
      fetchVisitors();
    } catch (e) { alert("Error marking exit"); }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-3">Visitor Logbook</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
          <FiPlus /> {showForm ? "Cancel" : "Add Visitor"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-neutral-1 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Visitor Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Contact No" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Purpose (e.g. Meeting)" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Whom to Meet" value={form.whomToMeet} onChange={e => setForm({...form, whomToMeet: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="In Time" value={form.inTime} onChange={e => setForm({...form, inTime: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
          </div>
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Log Entry</button>
        </form>
      )}

      <div className="bg-neutral-2 rounded-2xl border border-neutral-1 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-3 text-white">
            <tr>
              <th className="px-6 py-4">Visitor</th>
              <th className="px-6 py-4">Purpose</th>
              <th className="px-6 py-4">Meeting With</th>
              <th className="px-6 py-4">In Time</th>
              <th className="px-6 py-4">Out Time</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(v => (
              <tr key={v._id} className="border-b border-neutral-1 hover:bg-neutral-1 transition">
                <td className="px-6 py-4 font-bold">{v.name}<br/><span className="text-[10px] font-normal opacity-50">{v.contact}</span></td>
                <td className="px-6 py-4">{v.purpose}</td>
                <td className="px-6 py-4 font-medium">{v.whomToMeet}</td>
                <td className="px-6 py-4"><span className="text-green-600 font-bold">{v.inTime}</span></td>
                <td className="px-6 py-4"><span className="text-red-600 font-bold">{v.outTime || "—"}</span></td>
                <td className="px-6 py-4 opacity-50">{formatDateDDMMYYYY(v.date)}</td>
                <td className="px-6 py-4">
                    {!v.outTime && (
                        <button onClick={() => markExit(v._id)} className="text-primary hover:scale-110 transition flex items-center gap-1 font-bold text-xs">
                           <FiLogOut /> Exit
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visitors.length === 0 && <div className="p-10 text-center opacity-30 italic">No visitors today</div>}
      </div>
    </div>
  );
};

export default VisitorLog;
