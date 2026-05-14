import React, { useState } from "react";
import axios from "axios";
import { FiAward, FiEdit, FiTrash2, FiSave, FiX, FiActivity } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const TeacherExamResults = ({ examResults, students, classTeacher, fetchTeacherData }) => {
  const [editingResultId, setEditingResultId] = useState(null);
  const [editForm, setEditForm] = useState({ examPercent: 0 });
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryForm, setEntryForm] = useState({
    examType: "Unit Test",
    examDate: new Date().toISOString().split('T')[0],
    remarks: "",
    marks: {} // studentId: percent
  });

  const getGrade = (p) => {
    if (p >= 90) return "A+";
    if (p >= 80) return "A";
    if (p >= 70) return "B+";
    if (p >= 60) return "B";
    if (p >= 50) return "C+";
    if (p >= 40) return "C";
    return "F";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const results = Object.entries(entryForm.marks).map(([id, p]) => {
      const student = students.find(s => s._id === id);
      return {
        studentId: id,
        rollNumber: student?.rollNumber,
        studentName: student?.studentName,
        examPercent: p
      };
    });

    try {
      await axios.post(`${API_BASE_URL}/api/examResults`, {
        ...entryForm,
        className: classTeacher.className,
        results
      });
      alert("Results added successfully!");
      setShowEntryForm(false);
      fetchTeacherData();
    } catch (error) { alert("Error adding results"); }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/examResults/${id}`, editForm);
      setEditingResultId(null);
      fetchTeacherData();
    } catch (error) { alert("Error updating result"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Exam Results</h2>
        <button onClick={() => setShowEntryForm(!showEntryForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiAward /> {showEntryForm ? "Cancel" : "Enter Marks"}
        </button>
      </div>

      {showEntryForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-2xl mb-6 shadow-sm border border-neutral-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={entryForm.examType} onChange={e => setEntryForm({...entryForm, examType: e.target.value})} className="px-4 py-2 border rounded-lg">
              <option value="Unit Test">Unit Test</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Final">Final</option>
            </select>
            <input type="date" value={entryForm.examDate} onChange={e => setEntryForm({...entryForm, examDate: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Remarks" value={entryForm.remarks} onChange={e => setEntryForm({...entryForm, remarks: e.target.value})} className="px-4 py-2 border rounded-lg" />
          </div>
          <div className="bg-white rounded-xl overflow-hidden border border-neutral-1">
            <table className="w-full text-sm">
              <thead className="bg-neutral-1">
                <tr><th className="px-4 py-2 text-left">Roll</th><th className="px-4 py-2 text-left">Student</th><th className="px-4 py-2 text-left">Marks (%)</th></tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id} className="border-b border-neutral-1">
                    <td className="px-4 py-2 font-bold text-primary">{s.rollNumber}</td>
                    <td className="px-4 py-2">{s.studentName}</td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        max="100" 
                        min="0" 
                        onChange={e => setEntryForm({...entryForm, marks: {...entryForm.marks, [s._id]: e.target.value}})} 
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Submit Results</button>
        </form>
      )}

      {/* Results List */}
      <div className="space-y-6">
        {Object.entries(examResults.reduce((acc, r) => {
          const key = `${r.examType}_${r.examDate}`;
          if (!acc[key]) acc[key] = { type: r.examType, date: r.examDate, items: [] };
          acc[key].items.push(r);
          return acc;
        }, {})).map(([key, group]) => (
          <div key={key} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div>
                <h3 className="font-bold text-neutral-3">{group.type}</h3>
                <p className="text-xs opacity-50">{formatDateDDMMYYYY(group.date)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {group.items.map(item => (
                <div key={item._id} className="bg-white p-3 rounded-xl border border-neutral-1 text-center relative group">
                  <p className="text-[10px] font-bold text-primary">Roll {item.rollNumber}</p>
                  <p className="text-xs font-medium truncate">{item.studentName}</p>
                  <div className={`text-lg font-black my-1 ${item.examPercent >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {editingResultId === item._id ? (
                      <input type="number" value={editForm.examPercent} onChange={e => setEditForm({examPercent: e.target.value})} className="w-12 border rounded text-xs" />
                    ) : `${item.examPercent}%`}
                  </div>
                  <div className="text-[10px] font-bold opacity-40">Grade {getGrade(item.examPercent)}</div>
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                    {editingResultId === item._id ? (
                      <button onClick={() => handleUpdate(item._id)} className="text-green-600"><FiSave /></button>
                    ) : (
                      <button onClick={() => { setEditingResultId(item._id); setEditForm({examPercent: item.examPercent}); }} className="text-secondary"><FiEdit /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherExamResults;
