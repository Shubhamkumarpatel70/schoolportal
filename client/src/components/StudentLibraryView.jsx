import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBook, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";
import { formatDateDDMMYYYY } from "../utils/date";

const StudentLibraryView = () => {
  const [myIssues, setMyIssues] = useState([]);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookIssues/my`);
      setMyIssues(res.data);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-3">My Library Records</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myIssues.map(i => (
          <div key={i._id} className="bg-white p-6 rounded-2xl border border-neutral-1 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-2 h-full ${i.status === 'returned' ? 'bg-green-500' : new Date(i.dueDate) < new Date() ? 'bg-red-500' : 'bg-orange-500'}`} />
            
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-neutral-1 text-primary rounded-xl flex items-center justify-center text-xl shadow-inner"><FiBook /></div>
               <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${i.status === 'returned' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                 {i.status}
               </span>
            </div>

            <h3 className="font-bold text-neutral-3 text-lg leading-tight mb-1">{i.book?.title}</h3>
            <p className="text-xs font-bold text-neutral-3/40 uppercase tracking-widest mb-6">By {i.book?.author}</p>

            <div className="space-y-3">
               <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-neutral-3/40 flex items-center gap-1 uppercase tracking-tighter"><FiClock /> Issued On</span>
                  <span className="text-neutral-3">{formatDateDDMMYYYY(i.issueDate)}</span>
               </div>
               <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-neutral-3/40 flex items-center gap-1 uppercase tracking-tighter"><FiAlertCircle /> Due Date</span>
                  <span className={`${new Date(i.dueDate) < new Date() && i.status === 'issued' ? 'text-red-600' : 'text-neutral-3'}`}>{formatDateDDMMYYYY(i.dueDate)}</span>
               </div>
               {i.status === 'returned' && (
                  <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-neutral-1">
                    <span className="text-green-600 flex items-center gap-1 uppercase tracking-tighter"><FiCheckCircle /> Returned</span>
                    <span className="text-green-600">{formatDateDDMMYYYY(i.returnDate)}</span>
                  </div>
               )}
            </div>
          </div>
        ))}
        {myIssues.length === 0 && <div className="col-span-full py-20 text-center opacity-30 italic">You haven't borrowed any books yet</div>}
      </div>
    </div>
  );
};

export default StudentLibraryView;
