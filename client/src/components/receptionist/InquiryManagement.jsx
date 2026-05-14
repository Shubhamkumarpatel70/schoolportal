import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiPhone, FiMail, FiUser, FiInfo, FiTrendingUp } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentName: "", parentName: "", grade: "", contact: "", email: "", source: "Advertisement", remarks: "" });

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/inquiries`);
      setInquiries(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/inquiries`, form);
      alert("Inquiry recorded!");
      setShowForm(false);
      setForm({ studentName: "", parentName: "", grade: "", contact: "", email: "", source: "Advertisement", remarks: "" });
      fetchInquiries();
    } catch (e) { alert("Error recording inquiry"); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/inquiries/${id}`, { status });
      fetchInquiries();
    } catch (e) { alert("Error updating status"); }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-3 flex items-center gap-2"><FiTrendingUp className="text-primary" /> Admission Inquiries</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
          <FiPlus /> {showForm ? "Cancel" : "New Inquiry"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-neutral-1 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="text" placeholder="Student Name" value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Parent Name" value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Grade/Class" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Contact No" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
            <select value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="px-4 py-3 border rounded-xl outline-none bg-white">
                <option value="Advertisement">Advertisement</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Walk-in">Walk-in</option>
            </select>
            <input type="text" placeholder="Short Remarks" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
          </div>
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Record Prospect</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inquiries.map(i => (
          <div key={i._id} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 hover:border-primary/20 transition shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-white p-2 rounded-xl text-primary border border-neutral-1 shadow-sm"><FiUser /></div>
               <select 
                 value={i.status} 
                 onChange={e => updateStatus(i._id, e.target.value)}
                 className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg outline-none border ${i.status === 'new' ? 'bg-blue-50 text-blue-600' : i.status === 'admitted' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}
               >
                 <option value="new">New</option>
                 <option value="following">Following</option>
                 <option value="admitted">Admitted</option>
                 <option value="closed">Closed</option>
               </select>
            </div>
            <h3 className="font-bold text-neutral-3 text-lg leading-tight">{i.studentName}</h3>
            <p className="text-xs font-bold text-neutral-3/40 uppercase tracking-widest mb-4">Class {i.grade} • {i.parentName || "Unknown Parent"}</p>
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-neutral-3/70"><FiPhone /> {i.contact}</div>
                {i.email && <div className="flex items-center gap-2 text-xs text-neutral-3/70"><FiMail /> {i.email}</div>}
                <div className="flex items-center gap-2 text-xs text-neutral-3/70 italic"><FiInfo /> "{i.remarks || "No remarks"}"</div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-1">
               <span className="text-[10px] font-black uppercase text-neutral-3/30 tracking-wider">Source: {i.source}</span>
               <span className="text-[10px] font-black text-neutral-3/30">{formatDateDDMMYYYY(i.createdAt)}</span>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && <div className="md:col-span-3 py-20 text-center opacity-30 italic">No inquiries found</div>}
      </div>
    </div>
  );
};

export default InquiryManagement;
