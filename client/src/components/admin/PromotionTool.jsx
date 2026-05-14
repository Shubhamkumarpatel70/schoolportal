import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrendingUp, FiArrowRight, FiShield } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";

const PromotionTool = ({ classes }) => {
  const [sourceClass, setSourceClass] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentsCount, setStudentsCount] = useState(0);

  useEffect(() => {
    if (sourceClass) {
        fetchCount();
    }
  }, [sourceClass]);

  const fetchCount = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/fees/class/${sourceClass}`);
        setStudentsCount(res.data.length);
    } catch (e) { console.error(e); }
  };

  const handlePromote = async () => {
    if (!sourceClass || !targetClass) return alert("Select both classes");
    if (!window.confirm(`Are you sure you want to promote ${studentsCount} students from ${sourceClass} to ${targetClass}?`)) return;
    
    setLoading(true);
    try {
        // I need a backend route for this. I'll create it.
        await axios.post(`${API_BASE_URL}/api/students/bulk-promote`, { sourceClass, targetClass });
        alert("Promotion successful!");
        setSourceClass("");
        setTargetClass("");
        setStudentsCount(0);
    } catch (e) { alert("Error in promotion"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-neutral-2 p-8 rounded-3xl border border-neutral-1 shadow-sm">
      <div className="flex items-center gap-4 mb-8 text-primary">
         <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl"><FiTrendingUp /></div>
         <div>
            <h2 className="text-xl font-bold text-neutral-3">Annual Student Promotion</h2>
            <p className="text-xs text-neutral-3/50 font-bold uppercase tracking-widest">End of Session Utility</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-8">
         <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-neutral-3/40">From Class</label>
            <select value={sourceClass} onChange={e => setSourceClass(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none bg-white">
                <option value="">Select Source...</option>
                {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
            </select>
         </div>
         <div className="flex justify-center text-2xl text-neutral-3/20"><FiArrowRight /></div>
         <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-neutral-3/40">To Class</label>
            <select value={targetClass} onChange={e => setTargetClass(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none bg-white">
                <option value="">Select Target...</option>
                {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                <option value="Alumni">Alumni (Pass Out)</option>
            </select>
         </div>
      </div>

      {studentsCount > 0 && (
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 mb-8 flex items-center justify-between">
              <div>
                  <p className="text-sm font-bold text-neutral-3">{studentsCount} Students Identified</p>
                  <p className="text-xs text-neutral-3/50">These students will be migrated to {targetClass || "..."}</p>
              </div>
              <button 
                onClick={handlePromote} 
                disabled={loading || !targetClass}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Execute Promotion"}
              </button>
          </div>
      )}

      <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 bg-red-50 p-3 rounded-lg uppercase tracking-wider">
         <FiShield /> Warning: This action is irreversible. All selected students will have their Class field updated.
      </div>
    </div>
  );
};

export default PromotionTool;
