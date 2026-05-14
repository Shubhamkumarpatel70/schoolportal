import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiFileText, FiPlus, FiTrash2, FiDownload, FiEye, FiPaperclip } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const CircularManagement = () => {
  const [circulars, setCirculars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", pdfData: "", fileName: "" });

  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/circulars`);
      setCirculars(res.data);
    } catch (error) { console.error("Error fetching circulars", error); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, pdfData: reader.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pdfData) return alert("Please select a PDF file");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/circulars`, form);
      alert("Circular uploaded successfully!");
      setForm({ title: "", pdfData: "", fileName: "" });
      setShowForm(false);
      fetchCirculars();
    } catch (error) { alert("Error uploading circular"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this circular?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/circulars/${id}`);
      fetchCirculars();
    } catch (error) { alert("Error deleting circular"); }
  };

  const viewCircular = (circular) => {
    const win = window.open();
    win.document.write(`<iframe src="${circular.pdfData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">School Circulars</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
          <FiPlus /> {showForm ? "Cancel" : "Upload Circular"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-2xl mb-8 border border-neutral-1 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-3/50 uppercase tracking-widest">Circular Title</label>
              <input type="text" placeholder="e.g. Summer Vacation Notice" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none focus:border-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-3/50 uppercase tracking-widest">PDF Document</label>
              <div className="relative">
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                <label htmlFor="pdf-upload" className="flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer hover:bg-white transition">
                  <span className="text-neutral-3/60 truncate">{form.fileName || "Select PDF file..."}</span>
                  <FiPaperclip className="text-primary" />
                </label>
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? "Uploading..." : "Publish Circular"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circulars.map(c => (
          <div key={c._id} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 group hover:border-primary/30 transition shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
              <FiFileText />
            </div>
            <h3 className="font-bold text-neutral-3 mb-1 truncate">{c.title}</h3>
            <p className="text-xs text-neutral-3/50 mb-4 italic">Uploaded on {formatDateDDMMYYYY(c.createdAt)}</p>
            <div className="flex gap-2">
              <button onClick={() => viewCircular(c)} className="flex-1 bg-white text-primary border border-neutral-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition">
                <FiEye /> View
              </button>
              <button onClick={() => handleDelete(c._id)} className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
      {circulars.length === 0 && <div className="text-center py-20 opacity-30 italic">No circulars published yet</div>}
    </div>
  );
};

export default CircularManagement;
