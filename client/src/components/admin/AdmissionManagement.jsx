import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSettings, FiCheckCircle, FiXCircle, FiGrid, FiList, FiClock, FiMail, FiPhone, FiUser, FiEye, FiEdit2, FiSave, FiMonitor, FiLayers } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const AdmissionManagement = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState({ isOpen: false, displayType: 'navbar', session: '2024-25' });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [tempSession, setTempSession] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [configRes, appsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admissions/config`),
        axios.get(`${API_BASE_URL}/api/admissions/applications`)
      ]);
      setConfig(configRes.data);
      setTempSession(configRes.data.session);
      setApplications(appsRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleToggle = async () => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/admissions/config`, { isOpen: !config.isOpen });
      setConfig(res.data);
    } catch (e) { alert("Failed to update config"); }
  };

  const updateConfig = async (updates) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/admissions/config`, updates);
      setConfig(res.data);
      if (updates.session) setIsEditingSession(false);
    } catch (e) { alert("Update failed"); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admissions/applications/${id}/status`, { status });
      fetchData();
    } catch (e) { alert("Status update failed"); }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Control Panel */}
      {user?.role === 'admin' && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-1 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
             <div className="space-y-4">
                <h3 className="text-xl font-black text-neutral-3 tracking-tighter flex items-center gap-2">
                  <FiSettings className="text-primary" /> ADMISSION CONTROL
                </h3>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-3 bg-neutral-1 p-2 rounded-2xl">
                      <span className="text-[10px] font-black uppercase text-neutral-3/40 ml-2">Portal Status</span>
                      <button onClick={handleToggle} className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${config.isOpen ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-neutral-3/20'}`}>
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${config.isOpen ? 'translate-x-8' : 'translate-x-1'}`} />
                      </button>
                      <span className={`text-[10px] font-black uppercase mr-2 ${config.isOpen ? 'text-green-600' : 'text-neutral-3/40'}`}>
                          {config.isOpen ? "Live" : "Offline"}
                      </span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 max-w-2xl">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase opacity-40 ml-1">Display Type</label>
                   <div className="flex p-1 bg-neutral-1 rounded-2xl">
                      <button 
                        onClick={() => updateConfig({ displayType: 'navbar' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${config.displayType === 'navbar' ? 'bg-white text-primary shadow-sm' : 'text-neutral-3/40 hover:text-neutral-3'}`}
                      >
                         <FiMonitor /> NAVBAR
                      </button>
                      <button 
                        onClick={() => updateConfig({ displayType: 'popup' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${config.displayType === 'popup' ? 'bg-white text-primary shadow-sm' : 'text-neutral-3/40 hover:text-neutral-3'}`}
                      >
                         <FiLayers /> POPUP
                      </button>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase opacity-40 ml-1">Admission Session</label>
                   <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          disabled={!isEditingSession}
                          value={tempSession} 
                          onChange={e => setTempSession(e.target.value)}
                          className={`w-full px-4 py-2 rounded-xl outline-none font-bold text-sm transition-all ${isEditingSession ? 'bg-white ring-2 ring-primary/20 border-primary' : 'bg-neutral-1 text-neutral-3/60 border-transparent'}`} 
                        />
                      </div>
                      {isEditingSession ? (
                        <button onClick={() => updateConfig({ session: tempSession })} className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition"><FiSave /></button>
                      ) : (
                        <button onClick={() => setIsEditingSession(true)} className="p-2 bg-neutral-1 text-neutral-3/40 rounded-xl hover:text-primary transition"><FiEdit2 /></button>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white rounded-3xl border border-neutral-1 overflow-hidden">
        <div className="p-6 border-b border-neutral-1 flex justify-between items-center">
           <h3 className="text-xl font-black text-neutral-3 tracking-tighter">APPLICATIONS</h3>
           <span className="bg-neutral-1 px-4 py-1 rounded-full text-xs font-bold text-neutral-3/50">{applications.length} TOTAL</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-1/50 text-neutral-3/40 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Session</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-1">
              {applications.map(app => (
                <tr key={app._id} className="hover:bg-neutral-1/30 transition">
                  <td className="px-6 py-4">
                     <p className="font-bold text-neutral-3">{app.studentName}</p>
                     <p className="text-[10px] opacity-40 font-black uppercase">Prev: {app.previousClassPercentage}%</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="flex items-center gap-1"><FiMail className="opacity-30" /> {app.email}</p>
                     <p className="flex items-center gap-1 mt-1 text-neutral-3/50"><FiPhone className="opacity-30" /> {app.mobileNumber}</p>
                  </td>
                  <td className="px-6 py-4 font-bold">{app.session}</td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {app.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                       <button onClick={() => setSelectedApp(app)} className="p-2 bg-neutral-1 rounded-lg text-neutral-3/50 hover:text-primary transition" title="View Detail"><FiEye /></button>
                       <button onClick={() => updateStatus(app._id, 'shortlisted')} className="p-2 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition" title="Shortlist"><FiCheckCircle /></button>
                       <button onClick={() => updateStatus(app._id, 'rejected')} className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition" title="Reject"><FiXCircle /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && <div className="p-20 text-center opacity-30 italic">No applications received yet</div>}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-3/20 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
              <div className="p-8 border-b border-neutral-1 flex justify-between items-start">
                 <div className="flex gap-4">
                    {selectedApp.passportPhoto ? <img src={selectedApp.passportPhoto} className="w-20 h-20 rounded-2xl object-cover shadow-lg" /> : <div className="w-20 h-20 bg-neutral-1 rounded-2xl flex items-center justify-center text-3xl text-neutral-3/20"><FiUser /></div>}
                    <div>
                       <h2 className="text-2xl font-black text-neutral-3 tracking-tighter">{selectedApp.studentName}</h2>
                       <p className="text-sm font-bold text-primary uppercase">Session {selectedApp.session}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-neutral-1 rounded-xl text-neutral-3/40 transition"><FiXCircle className="text-2xl" /></button>
              </div>
              <div className="p-8 grid grid-cols-2 gap-8 text-sm">
                 <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Father's Name</p>
                    <p className="font-bold text-neutral-3">{selectedApp.fathersName}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Mother's Name</p>
                    <p className="font-bold text-neutral-3">{selectedApp.mothersName}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Previous School</p>
                    <p className="font-bold text-neutral-3">{selectedApp.previousSchool || 'N/A'}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Class % / Grade</p>
                    <p className="font-bold text-neutral-3">{selectedApp.previousClassPercentage || 'N/A'}</p>
                 </div>
                 <div className="col-span-2">
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">Application Date</p>
                    <p className="font-bold text-neutral-3">{new Date(selectedApp.createdAt).toLocaleString()}</p>
                 </div>
              </div>
              <div className="p-8 bg-neutral-1/50 flex justify-end gap-3">
                 <button onClick={() => setSelectedApp(null)} className="px-6 py-2 rounded-xl font-bold text-neutral-3/50 hover:bg-neutral-2 transition">Close</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionManagement;
