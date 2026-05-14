import React from "react";
import { FiUser, FiMapPin, FiPhone, FiMail, FiHash, FiCalendar } from "react-icons/fi";

const StudentProfile = ({ studentData, user }) => {
  if (!studentData) return <div className="p-10 text-center opacity-50">Loading profile...</div>;

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Digital ID Card Style Header */}
      <div className="bg-gradient-to-br from-primary to-primary-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-primary text-5xl font-black shadow-lg">
            {studentData.studentName.charAt(0)}
          </div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-black">{studentData.studentName}</h1>
            <p className="text-primary-100 font-medium tracking-wide">STUDENT • CLASS {studentData.class}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/10">ID: {studentData.enrollmentNumber}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/10">ROLL: {studentData.rollNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={<FiUser />} label="Father's Name" value={studentData.fathersName} />
        <InfoCard icon={<FiUser />} label="Mother's Name" value={studentData.mothersName} />
        <InfoCard icon={<FiPhone />} label="Mobile Number" value={studentData.mobileNumber} />
        <InfoCard icon={<FiMail />} label="Email Address" value={user?.email || "Not Linked"} />
        <InfoCard icon={<FiMapPin />} label="Address" value={studentData.address} />
        <InfoCard icon={<FiCalendar />} label="Student Type" value={studentData.studentType === 'dayScholar' ? 'Day Scholar' : 'Hosteler'} />
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-neutral-2 p-5 rounded-2xl border border-neutral-1 flex items-center gap-4 hover:shadow-md transition shadow-sm">
    <div className="p-3 bg-white rounded-xl text-primary text-lg shadow-sm border border-neutral-1">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-neutral-3/40 uppercase tracking-widest">{label}</p>
      <p className="font-bold text-neutral-3">{value || "N/A"}</p>
    </div>
  </div>
);

export default StudentProfile;
