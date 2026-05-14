import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBookOpen, FiAward, FiCalendar, FiClock } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const StudentExams = ({ studentData }) => {
  const [schedules, setSchedules] = useState([]);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("results");

  useEffect(() => {
    if (studentData) {
      fetchExams();
    }
  }, [studentData]);

  const fetchExams = async () => {
    try {
      const [schedRes, resRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/examSchedules`),
        axios.get(`${API_BASE_URL}/api/examResults/student/${studentData._id}`)
      ]);
      setSchedules(schedRes.data.filter(s => s.className === studentData.class));
      setResults(resRes.data);
    } catch (error) { console.error("Error fetching exam data", error); }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex space-x-4 mb-6 border-b border-neutral-1">
        <button 
          onClick={() => setActiveTab("results")}
          className={`pb-2 px-1 capitalize font-medium transition ${activeTab === "results" ? "text-primary border-b-2 border-primary" : "text-neutral-3/60 hover:text-neutral-3"}`}
        >
          My Results
        </button>
        <button 
          onClick={() => setActiveTab("schedules")}
          className={`pb-2 px-1 capitalize font-medium transition ${activeTab === "schedules" ? "text-primary border-b-2 border-primary" : "text-neutral-3/60 hover:text-neutral-3"}`}
        >
          Exam Datesheets
        </button>
      </div>

      {activeTab === "results" && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="py-20 text-center bg-neutral-2 rounded-2xl border-2 border-dashed border-neutral-1 text-neutral-3/40 italic">
              No results published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(r => (
                <div key={r._id} className="bg-neutral-2 p-5 rounded-2xl border border-neutral-1 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-neutral-3 capitalize">{r.examType} Exam</h3>
                    <p className="text-xs opacity-50">{formatDateDDMMYYYY(r.examDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${r.examPercent >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                      {r.examPercent}%
                    </p>
                    <p className="text-[10px] font-bold text-neutral-3/40 uppercase">Grade {r.remarks || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "schedules" && (
        <div className="space-y-4">
          {schedules.length === 0 ? (
            <div className="py-20 text-center bg-neutral-2 rounded-2xl border-2 border-dashed border-neutral-1 text-neutral-3/40 italic">
              No datesheets available for your class.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {schedules.map(s => (
                <div key={s._id} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 mb-6 bg-primary/5 p-3 rounded-xl border border-primary/10">
                    <div className="p-2 bg-primary text-white rounded-lg shadow-md"><FiCalendar /></div>
                    <h3 className="text-lg font-bold text-neutral-3">{s.examName}</h3>
                  </div>
                  <div className="space-y-3">
                    {s.subjects.map((sub, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-neutral-1 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center bg-neutral-1 rounded-full text-[10px] font-bold text-neutral-3">{i+1}</span>
                          <div>
                            <p className="text-sm font-bold text-neutral-3">{sub.subjectName}</p>
                            <p className="text-[10px] opacity-50 flex items-center gap-1"><FiCalendar /> {formatDateDDMMYYYY(sub.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-primary flex items-center gap-1"><FiClock /> {sub.startTime} - {sub.endTime}</p>
                          <p className="text-[10px] opacity-40">Max Marks: {sub.maxMarks}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentExams;
