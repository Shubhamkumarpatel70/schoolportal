import React, { useState } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiHome, FiAward, FiCamera, FiCheckCircle, FiX, FiUserPlus } from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";

const AdmissionForm = ({ session, onClose }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    mobileNumber: "",
    fathersName: "",
    mothersName: "",
    previousSchool: "",
    previousClassPercentage: "",
    passportPhoto: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, passportPhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/admissions/apply`, formData);
      setSuccess(true);
      setTimeout(() => { if (onClose) onClose(); }, 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col lg:flex-row max-h-[90vh] overflow-hidden min-h-[400px]">
        <div className="lg:w-1/3 bg-green-500 p-10 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
           <FiCheckCircle className="text-7xl mb-4 relative z-10" />
           <h2 className="text-2xl font-black uppercase tracking-tighter relative z-10">SUCCESS!</h2>
        </div>
        <div className="flex-1 bg-white p-12 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-black text-neutral-3 tracking-tighter uppercase">Application Received</h2>
          <p className="text-neutral-3/50 mt-4 max-w-md mx-auto font-medium">
            Thank you for applying to our institution. Our admissions team will review your application and get back to you shortly via email.
          </p>
          <button onClick={onClose} className="mt-8 px-10 py-3 bg-neutral-1 hover:bg-neutral-2 text-neutral-3 font-black rounded-2xl transition-all uppercase text-xs tracking-widest">
            Close Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row max-h-[90vh] overflow-hidden">
      {/* Sidebar / Branding */}
      <div className="lg:w-1/3 bg-primary p-10 text-white flex flex-col justify-between relative overflow-hidden min-h-[300px] lg:min-h-[600px]">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
         <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl">
               <FiUserPlus className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter leading-none uppercase italic">
               Step into <br /> 
               <span className="text-white/60">the</span> <br /> 
               Future
            </h1>
            <p className="mt-6 text-sm font-medium text-white/80 leading-relaxed max-w-[200px]">
               Join our community of learners and leaders. Start your journey with us today.
            </p>
         </div>

         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Admission Live</span>
            </div>
            <p className="text-2xl font-black uppercase tracking-tighter italic">Session {session}</p>
         </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 bg-white relative">
        <div className="absolute top-6 right-6 z-20">
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-3 bg-neutral-1 hover:bg-neutral-2 rounded-2xl text-neutral-3/40 transition-all hover:scale-110 active:scale-95"
            >
              <FiX className="text-xl" />
            </button>
          )}
        </div>

        <div className="h-full overflow-y-auto p-8 md:p-12 scrollbar-hide pt-24 lg:pt-20">
          <div className="mb-10">
             <h2 className="text-2xl font-black text-neutral-3 tracking-tighter uppercase">Application Form</h2>
             <p className="text-xs font-bold text-neutral-3/40 mt-1 uppercase tracking-widest">Complete all required fields below</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Student Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-3/30" />
                <input type="text" required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-neutral-1 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition font-bold text-sm" placeholder="e.g. John Doe" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-3/30" />
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-neutral-1 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition font-bold text-sm" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Mobile Number</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-3/30" />
                <input type="tel" required value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-neutral-1 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition font-bold text-sm" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Father's Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-3/30 opacity-50" />
                <input type="text" required value={formData.fathersName} onChange={e => setFormData({...formData, fathersName: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-neutral-1 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition font-bold text-sm" placeholder="Father's name" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Mother's Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-3/30 opacity-50" />
                <input type="text" required value={formData.mothersName} onChange={e => setFormData({...formData, mothersName: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-neutral-1 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition font-bold text-sm" placeholder="Mother's name" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Previous School</label>
              <div className="relative">
                <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-3/30" />
                <input type="text" value={formData.previousSchool} onChange={e => setFormData({...formData, previousSchool: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-neutral-1 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition font-bold text-sm" placeholder="Last school attended" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Prev Class % / Grade</label>
              <div className="relative">
                <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-3/30" />
                <input type="text" value={formData.previousClassPercentage} onChange={e => setFormData({...formData, previousClassPercentage: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-neutral-1 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition font-bold text-sm" placeholder="e.g. 85%" />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Passport Size Photo</label>
              <div className="relative group cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
                <label htmlFor="photo-upload" className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-neutral-1 rounded-3xl border-2 border-dashed border-neutral-3/10 hover:border-primary/40 transition cursor-pointer group-hover:bg-neutral-2">
                   {formData.passportPhoto ? <img src={formData.passportPhoto} className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-white" /> : <FiCamera className="text-neutral-3/30 text-2xl" />}
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-neutral-3 uppercase tracking-widest">Select Passport Photo</span>
                      <span className="text-[8px] font-bold text-neutral-3/30 uppercase">Max size 2MB (JPG/PNG)</span>
                   </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="md:col-span-2 w-full py-5 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 uppercase tracking-widest text-xs">
              {loading ? "Processing..." : "Submit Enrollment Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
