import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiCheckCircle, FiXCircle, FiSave, FiSearch } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY, toDateKeyYMD } from "../../utils/date";

const TeacherAttendance = ({ students, classTeacher, fetchTeacherData }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({}); // studentId: status
  const [loading, setLoading] = useState(false);
  const [holiday, setHoliday] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [date, classTeacher]);

  const fetchAttendance = async () => {
    if (!classTeacher) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/attendance/class/${classTeacher.className}?date=${date}`);
      const records = res.data || [];
      const statusMap = {};
      records.forEach(r => {
        statusMap[r.student._id || r.student] = r.status;
      });
      setAttendance(statusMap);

      // Check if it's a holiday
      const holRes = await axios.get(`${API_BASE_URL}/api/holidays?date=${date}`);
      setHoliday(holRes.data?.[0] || null);
    } catch (error) { console.error("Error fetching attendance", error); }
    finally { setLoading(false); }
  };

  const handleMark = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  const handleSubmit = async () => {
    if (holiday && holiday.title !== "Sunday Attendance Enabled") {
      alert("Cannot mark attendance on a holiday!");
      return;
    }
    try {
      const payload = Object.entries(attendance).map(([id, status]) => ({ studentId: id, status }));
      await axios.post(`${API_BASE_URL}/api/attendance/mark`, {
        classId: classTeacher.className,
        date,
        attendance: payload
      });
      alert("Attendance marked successfully!");
      fetchAttendance();
    } catch (error) { alert("Error marking attendance"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Daily Attendance</h2>
        <div className="flex gap-4">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-4 py-2 border rounded-lg outline-none" />
          <button onClick={handleSubmit} className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
            <FiSave /> Save Attendance
          </button>
        </div>
      </div>

      {holiday && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${holiday.title === "Sunday Attendance Enabled" ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>
          <FiCalendar />
          <span className="font-bold">{holiday.title === "Sunday Attendance Enabled" ? "Sunday Attendance is Enabled" : `Today is a Holiday: ${holiday.title}`}</span>
        </div>
      )}

      <div className="bg-neutral-2 rounded-2xl shadow-sm border border-neutral-1 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-primary text-white">
            <tr><th className="px-6 py-3">Roll No</th><th className="px-6 py-3">Student Name</th><th className="px-6 py-3 text-center">Status</th></tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} className="border-b border-neutral-1 hover:bg-neutral-1 transition">
                <td className="px-6 py-4 font-bold text-primary">{s.rollNumber}</td>
                <td className="px-6 py-4 font-medium">{s.studentName}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => handleMark(s._id, "Present")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${attendance[s._id] === "Present" ? "bg-green-600 text-white shadow-md shadow-green-200" : "bg-white text-neutral-3/40 border hover:border-green-600 hover:text-green-600"}`}
                    >
                      <FiCheckCircle /> Present
                    </button>
                    <button 
                      onClick={() => handleMark(s._id, "Absent")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${attendance[s._id] === "Absent" ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-white text-neutral-3/40 border hover:border-red-600 hover:text-red-600"}`}
                    >
                      <FiXCircle /> Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAttendance;
