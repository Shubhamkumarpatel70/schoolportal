import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiFileText, FiDownload, FiEye, FiSearch, FiCalendar } from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";
import { formatDateDDMMYYYY } from "../utils/date";

const CircularView = () => {
  const [circulars, setCirculars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/circulars`);
      setCirculars(res.data);
    } catch (error) { console.error("Error fetching circulars", error); }
  };

  const viewCircular = (circular) => {
    const win = window.open();
    win.document.write(`<iframe src="${circular.pdfData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
  };

  const filtered = circulars.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Official Circulars</h2>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-3/30" />
          <input 
            type="text" 
            placeholder="Search circulars..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:border-primary text-sm bg-neutral-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c._id} className="bg-neutral-2 p-4 rounded-2xl border border-neutral-1 hover:border-primary/20 transition flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-lg">
                <FiFileText />
              </div>
              <div>
                <h3 className="font-bold text-neutral-3 text-sm md:text-base">{c.title}</h3>
                <p className="text-[10px] text-neutral-3/40 uppercase font-bold tracking-widest flex items-center gap-1">
                  <FiCalendar /> {formatDateDDMMYYYY(c.createdAt)} • BY {c.uploadedBy?.name || "ADMIN"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => viewCircular(c)}
                className="flex-1 md:flex-none bg-primary text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition"
              >
                <FiEye /> View PDF
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center opacity-30 italic">No circulars found</div>
        )}
      </div>
    </div>
  );
};

export default CircularView;
