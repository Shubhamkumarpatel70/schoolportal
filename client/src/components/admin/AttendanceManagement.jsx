import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const AttendanceManagement = ({ classes }) => {
  const [attendanceClass, setAttendanceClass] = useState("");
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().getMonth() + 1);
  const [attendanceYear, setAttendanceYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");
  
  const [holidayForm, setHolidayForm] = useState({ date: "", title: "", description: "" });
  const [attendanceHolidays, setAttendanceHolidays] = useState([]);
  const [holidayActionLoading, setHolidayActionLoading] = useState(false);

  const [attendanceDateInput, setAttendanceDateInput] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceRollNumber, setAttendanceRollNumber] = useState("");
  const [attendanceStudentResult, setAttendanceStudentResult] = useState(null);
  const [attendanceSelectedStatus, setAttendanceSelectedStatus] = useState("");
  const [attendanceActionLoading, setAttendanceActionLoading] = useState(false);

  const fetchHolidays = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/holidays`);
      setAttendanceHolidays(res.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleAttendanceFetch = async (e) => {
    if (e) e.preventDefault();
    if (!attendanceClass) return;
    setAttendanceLoading(true);
    setAttendanceError("");
    setAttendanceStudentResult(null);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/attendance/class/${attendanceClass}/month/${attendanceMonth}/year/${attendanceYear}`
      );
      setAttendanceData(res.data);
    } catch (error) {
      setAttendanceError("Failed to fetch attendance data.");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    setHolidayActionLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/holidays`, holidayForm);
      setHolidayForm({ date: "", title: "", description: "" });
      fetchHolidays();
      alert("Holiday added successfully!");
    } catch (error) {
      alert("Error adding holiday");
    } finally {
      setHolidayActionLoading(false);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!window.confirm("Delete this holiday?")) return;
    setHolidayActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/holidays/${id}`);
      fetchHolidays();
    } catch (error) {
      alert("Error deleting holiday");
    } finally {
      setHolidayActionLoading(false);
    }
  };

  const attendanceHolidaysForDisplay = useMemo(() => {
    const manual = attendanceHolidays.filter((h) => {
      const d = new Date(h.date);
      return d.getMonth() + 1 === attendanceMonth && d.getFullYear() === attendanceYear;
    });
    const daysInMonth = new Date(attendanceYear, attendanceMonth, 0).getDate();
    const weeklyOffs = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(attendanceYear, attendanceMonth - 1, d);
      if (date.getDay() === 0) {
        const dateStr = `${attendanceYear}-${String(attendanceMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        if (!manual.some((h) => h.date.startsWith(dateStr))) {
          weeklyOffs.push({ _id: `sunday-${d}`, date: dateStr, title: "Sunday Off", isWeeklyOff: true });
        }
      }
    }
    return [...manual, ...weeklyOffs].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [attendanceHolidays, attendanceMonth, attendanceYear]);

  const attendanceCalendarHolidayMap = useMemo(() => {
    const map = {};
    attendanceHolidaysForDisplay.forEach((h) => {
      const key = h.date.split("T")[0];
      map[key] = h;
    });
    return map;
  }, [attendanceHolidaysForDisplay]);

  const attendanceStudentCards = useMemo(() => {
    if (!attendanceData.length) return [];
    return attendanceData.map((record) => {
      const totalDays = new Date(attendanceYear, attendanceMonth, 0).getDate();
      let present = 0, absent = 0;
      record.records.forEach((r) => {
        if (r.status === "Present") present++;
        else if (r.status === "Absent") absent++;
      });
      const holidaysCount = attendanceHolidaysForDisplay.length;
      const workingDays = totalDays - holidaysCount;
      const percent = workingDays > 0 ? Math.round((present / workingDays) * 100) : null;
      return {
        _id: record.studentId?._id || record.studentId,
        studentName: record.studentId?.studentName || "N/A",
        rollNumber: record.studentId?.rollNumber || "N/A",
        class: record.studentId?.class || "N/A",
        presentCount: present,
        absentCount: absent,
        attendancePercent: percent,
      };
    });
  }, [attendanceData, attendanceHolidaysForDisplay, attendanceMonth, attendanceYear]);

  const selectAttendanceStudentFromMonthRecords = (student, data) => {
    const record = data.find((r) => (r.studentId?._id || r.studentId) === student._id);
    setAttendanceStudentResult(student);
    if (record) {
      const dayRecord = record.records.find((r) => r.date.startsWith(attendanceDateInput));
      setAttendanceSelectedStatus(dayRecord ? dayRecord.status : "");
    } else {
      setAttendanceSelectedStatus("");
    }
  };

  const attendanceStudentStatusByDate = useMemo(() => {
    if (!attendanceStudentResult || !attendanceData.length) return {};
    const record = attendanceData.find((r) => (r.studentId?._id || r.studentId) === attendanceStudentResult._id);
    if (!record) return {};
    const map = {};
    record.records.forEach((r) => { map[r.date.split("T")[0]] = r.status; });
    return map;
  }, [attendanceStudentResult, attendanceData]);

  const handleMarkSingleAttendance = async (status) => {
    if (!attendanceStudentResult) return;
    setAttendanceActionLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/attendance`, {
        studentId: attendanceStudentResult._id,
        date: attendanceDateInput,
        status: status,
        class: attendanceStudentResult.class,
      });
      setAttendanceSelectedStatus(status);
      handleAttendanceFetch(); // Refresh data
    } catch (error) {
      alert("Error marking attendance");
    } finally {
      setAttendanceActionLoading(false);
    }
  };

  const daysInMonth = new Date(attendanceYear, attendanceMonth, 0).getDate();
  const firstDayOfMonth = new Date(attendanceYear, attendanceMonth - 1, 1).getDay();
  const calendarCells = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-3 mb-6">Attendance</h2>
      <form className="flex flex-wrap gap-4 items-end mb-6" onSubmit={handleAttendanceFetch}>
        <div>
          <label className="block mb-1 text-sm">Class</label>
          <select className="border rounded px-3 py-2" value={attendanceClass} onChange={(e) => setAttendanceClass(e.target.value)} required>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>{cls.className} {cls.section}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Month</label>
          <select className="border rounded px-3 py-2" value={attendanceMonth} onChange={(e) => setAttendanceMonth(Number(e.target.value))} required>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Year</label>
          <input type="number" className="border rounded px-3 py-2 w-24" value={attendanceYear} onChange={(e) => setAttendanceYear(Number(e.target.value))} min="2000" max={new Date().getFullYear()} required />
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-700 font-semibold transition">Fetch Attendance</button>
      </form>

      <div className="bg-neutral-2 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-3 mb-4">Manage Holidays</h3>
        <form onSubmit={handleAddHoliday} className="flex flex-wrap gap-3 items-end mb-6">
          <input type="date" className="border rounded px-3 py-2" value={holidayForm.date} onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })} required />
          <input type="text" className="border rounded px-3 py-2 flex-1" placeholder="Holiday Title" value={holidayForm.title} onChange={(e) => setHolidayForm({ ...holidayForm, title: e.target.value })} required />
          <button type="submit" disabled={holidayActionLoading} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50">Add Holiday</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {attendanceHolidaysForDisplay.map((holiday) => (
            <div key={holiday._id} className={`p-3 rounded-lg border flex justify-between items-center ${holiday.isWeeklyOff ? "bg-slate-50 border-slate-200" : "bg-amber-50 border-amber-200"}`}>
              <div>
                <p className="font-semibold text-sm">{holiday.title} {holiday.isWeeklyOff && <span className="text-xs opacity-50">(Auto)</span>}</p>
                <p className="text-xs opacity-70">{formatDateDDMMYYYY(holiday.date)}</p>
              </div>
              {!holiday.isWeeklyOff && (
                <button onClick={() => handleDeleteHoliday(holiday._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
              )}
            </div>
          ))}
        </div>
      </div>

      {attendanceLoading && <p className="text-center py-4">Loading attendance data...</p>}
      {attendanceError && <p className="text-red-500 text-center py-4">{attendanceError}</p>}

      {attendanceData.length > 0 && (
        <div className="bg-neutral-2 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-neutral-3 mb-4">Step 2: Student Details & Calendar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {attendanceStudentCards.map((card) => (
                <button
                  key={card._id}
                  onClick={() => selectAttendanceStudentFromMonthRecords(card, attendanceData)}
                  className={`w-full p-3 rounded-lg border text-left transition ${attendanceStudentResult?._id === card._id ? "border-primary bg-primary/5" : "border-neutral-1 hover:border-primary"}`}
                >
                  <p className="font-semibold">{card.studentName}</p>
                  <p className="text-xs opacity-70">Roll: {card.rollNumber} | Present: {card.presentCount} | Absent: {card.absentCount}</p>
                  {card.attendancePercent !== null && <p className="text-xs font-medium text-primary mt-1">Attendance: {card.attendancePercent}%</p>}
                </button>
              ))}
            </div>

            <div className="md:col-span-2">
              {attendanceStudentResult ? (
                <div className="border border-neutral-1 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-lg">{attendanceStudentResult.studentName}</h4>
                      <p className="text-sm opacity-70">Roll No: {attendanceStudentResult.rollNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <input type="date" value={attendanceDateInput} onChange={(e) => setAttendanceDateInput(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                      <button onClick={() => handleMarkSingleAttendance("Present")} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Mark Present</button>
                      <button onClick={() => handleMarkSingleAttendance("Absent")} className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">Mark Absent</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold opacity-50">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((day, i) => {
                      if (!day) return <div key={`empty-${i}`} className="h-14 border border-transparent" />;
                      const dateKey = `${attendanceYear}-${String(attendanceMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const status = attendanceStudentStatusByDate[dateKey];
                      const holiday = attendanceCalendarHolidayMap[dateKey];
                      return (
                        <div key={dateKey} className={`h-14 border rounded p-1 text-[10px] flex flex-col justify-between ${
                          holiday ? "bg-amber-50 border-amber-200" :
                          status === "Present" ? "bg-green-50 border-green-200" :
                          status === "Absent" ? "bg-red-50 border-red-200" : "bg-white border-neutral-1"
                        }`}>
                          <span className="font-bold">{day}</span>
                          <span className={`text-[9px] font-semibold truncate ${
                            holiday ? "text-amber-700" :
                            status === "Present" ? "text-green-700" :
                            status === "Absent" ? "text-red-700" : "text-neutral-300"
                          }`}>
                            {holiday ? "Holiday" : status || "N/A"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-neutral-1 rounded-lg text-neutral-3/50 italic">
                  Select a student to view calendar and mark attendance
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
