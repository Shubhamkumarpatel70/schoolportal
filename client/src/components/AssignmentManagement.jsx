import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBook, FiPlus, FiTrash2, FiDownload, FiPaperclip, FiCalendar } from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";
import { formatDateDDMMYYYY } from "../utils/date";

const AssignmentManagement = ({ user, studentData }) => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", className: "", subject: "", dueDate: "", description: "", fileData: "" });

  useEffect(() => {
    if (user.role === 'student' && studentData) {
      fetchAssignments(studentData.class);
    }
  }, [user, studentData]);

  const fetchAssignments = async (className) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/assignments/class/${className}`);
      setAssignments(res.data);
    } catch (e) { console.error(e); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, fileData: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/assignments`, form);
      alert("Assignment published!");
      setShowForm(false);
      setForm({ title: "", className: "", subject: "", dueDate: "", description: "", fileData: "" });
      // If we are managing a class, refresh
      if (form.className) fetchAssignments(form.className);
    } catch (e) { alert("Error publishing assignment"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/assignments/${id}`);
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (e) { alert("Error deleting assignment"); }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-3">Homework & Assignments</h2>
        {user.role === 'teacher' && (
          <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
            <FiPlus /> {showForm ? "Cancel" : "New Assignment"}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Class (e.g. 10A)" value={form.className} onChange={e => setForm({...form, className: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none" />
            <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none" />
          </div>
          <textarea placeholder="Description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none h-24" />
          <div className="flex items-center gap-4">
             <input type="file" onChange={handleFileChange} className="hidden" id="assign-file" />
             <label htmlFor="assign-file" className="bg-white px-6 py-2 border rounded-xl cursor-pointer hover:bg-neutral-1 transition flex items-center gap-2 text-sm font-bold"><FiPaperclip /> {form.fileData ? "File Attached" : "Attach Document"}</label>
             <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50">Publish</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map(a => (
          <div key={a._id} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 group hover:border-primary/30 transition shadow-sm relative">
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl"><FiBook /></div>
               {user.role === 'teacher' && <button onClick={() => handleDelete(a._id)} className="text-red-600 opacity-0 group-hover:opacity-100 transition"><FiTrash2 /></button>}
            </div>
            <h3 className="font-bold text-neutral-3">{a.title}</h3>
            <p className="text-xs font-bold text-primary mb-2">{a.subject} • Class {a.className}</p>
            <p className="text-xs text-neutral-3/60 line-clamp-2 mb-4">{a.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-neutral-1">
               <span className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1"><FiCalendar /> Due: {formatDateDDMMYYYY(a.dueDate)}</span>
               {a.fileData && (
                 <a href={a.fileData} download={`Assignment_${a.title}`} className="bg-white p-2 rounded-lg text-primary border border-neutral-1 hover:bg-primary hover:text-white transition shadow-sm"><FiDownload /></a>
               )}
            </div>
          </div>
        ))}
        {assignments.length === 0 && <div className="md:col-span-2 py-20 text-center opacity-30 italic">No assignments posted for this class</div>}
      </div>
    </div>
  );
};

export default AssignmentManagement;
