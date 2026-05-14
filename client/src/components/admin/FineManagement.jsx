import React, { useState } from "react";
import axios from "axios";
import { FiDollarSign, FiEdit, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const FineManagement = ({ 
  fines, 
  students, 
  classes, 
  fetchDashboardData, 
  handleDelete 
}) => {
  const [showFineForm, setShowFineForm] = useState(false);
  const [editingFine, setEditingFine] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [fineStudentSearchQuery, setFineStudentSearchQuery] = useState("");
  const [fineSearchResults, setFineSearchResults] = useState([]);

  const [fineForm, setFineForm] = useState({
    selectedClass: "",
    selectedStudent: "",
    studentName: "",
    amount: "",
    reason: "",
    dueDate: "",
    remarks: "",
  });

  const fetchStudentsByClass = async (className) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/fees/class/${className}`);
      setClassStudents(res.data);
    } catch (error) {
      setClassStudents([]);
    }
  };

  const searchStudentsForFine = async (query) => {
    if (!query || query.length < 2) {
      setFineSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students/search?q=${encodeURIComponent(query)}`);
      setFineSearchResults(res.data);
    } catch (error) {
      setFineSearchResults([]);
    }
  };

  const handleSubmitFine = async (e) => {
    e.preventDefault();
    try {
      const fineData = {
        studentId: fineForm.selectedStudent,
        amount: fineForm.amount,
        reason: fineForm.reason,
        dueDate: fineForm.dueDate,
        remarks: fineForm.remarks,
      };

      if (editingFine) {
        await axios.put(`${API_BASE_URL}/api/fines/${editingFine._id}`, fineData);
      } else {
        await axios.post(`${API_BASE_URL}/api/fines`, fineData);
      }
      setShowFineForm(false);
      resetFineForm();
      fetchDashboardData();
      alert(`Fine ${editingFine ? "updated" : "added"} successfully!`);
    } catch (error) {
      alert("Error saving fine");
    }
  };

  const handleEditFine = (fine) => {
    setEditingFine(fine);
    const studentId = fine.studentId?._id || fine.studentId;
    const student = students.find(s => s._id.toString() === studentId.toString());
    
    setFineForm({
      selectedClass: student?.class || "",
      selectedStudent: studentId,
      studentName: fine.studentId?.studentName || student?.studentName || "N/A",
      amount: fine.amount,
      reason: fine.reason,
      dueDate: fine.dueDate ? new Date(fine.dueDate).toISOString().split("T")[0] : "",
      remarks: fine.remarks || "",
    });
    if (student?.class) fetchStudentsByClass(student.class);
    setShowFineForm(true);
  };

  const resetFineForm = () => {
    setFineForm({
      selectedClass: "",
      selectedStudent: "",
      studentName: "",
      amount: "",
      reason: "",
      dueDate: "",
      remarks: "",
    });
    setFineStudentSearchQuery("");
    setFineSearchResults([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Fine Management</h2>
        <button
          onClick={() => {
            if (showFineForm) resetFineForm();
            setShowFineForm(!showFineForm);
            setEditingFine(null);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FiDollarSign />
          <span>{showFineForm ? "Cancel" : "Add Fine"}</span>
        </button>
      </div>

      {showFineForm && (
        <form onSubmit={handleSubmitFine} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingFine ? "Edit Fine" : "Add Fine"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-3/70 mb-1">Class</label>
              <select value={fineForm.selectedClass} onChange={(e) => { setFineForm({ ...fineForm, selectedClass: e.target.value }); fetchStudentsByClass(e.target.value); }} className="w-full px-4 py-2 border rounded-lg">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm text-neutral-3/70 mb-1">Student Search</label>
              <input
                type="text"
                placeholder="Search..."
                value={fineStudentSearchQuery}
                onChange={(e) => {
                  setFineStudentSearchQuery(e.target.value);
                  searchStudentsForFine(e.target.value);
                }}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {fineSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                  {fineSearchResults.map(s => (
                    <div key={s._id} onClick={() => { setFineForm({ ...fineForm, selectedStudent: s._id, studentName: s.studentName }); setFineSearchResults([]); setFineStudentSearchQuery(s.studentName); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                      {s.studentName} ({s.class})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input type="number" placeholder="Amount" value={fineForm.amount} onChange={(e) => setFineForm({ ...fineForm, amount: e.target.value })} required className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Reason" value={fineForm.reason} onChange={(e) => setFineForm({ ...fineForm, reason: e.target.value })} required className="px-4 py-2 border rounded-lg" />
            <input type="date" value={fineForm.dueDate} onChange={(e) => setFineForm({ ...fineForm, dueDate: e.target.value })} required className="px-4 py-2 border rounded-lg" />
            <textarea placeholder="Remarks" value={fineForm.remarks} onChange={(e) => setFineForm({ ...fineForm, remarks: e.target.value })} className="px-4 py-2 border rounded-lg md:col-span-2" rows="2" />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">{editingFine ? "Update" : "Add"}</button>
            <button type="button" onClick={() => setShowFineForm(false)} className="bg-neutral-1 text-neutral-3 px-6 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {fines.map((f) => {
                const studentId = f.studentId?._id || f.studentId;
                const student = students.find(s => s._id.toString() === studentId.toString());
                return (
                  <tr key={f._id} className="border-b border-neutral-1 hover:bg-neutral-1/30 transition">
                    <td className="px-4 py-3 text-neutral-3">
                      <div className="font-medium">{f.studentId?.studentName || student?.studentName || "N/A"}</div>
                      <div className="text-xs opacity-50">{student?.class || "N/A"}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-3">{f.reason}</td>
                    <td className="px-4 py-3 text-neutral-3 font-semibold text-lg">₹{f.amount}</td>
                    <td className="px-4 py-3 text-neutral-3">{formatDateDDMMYYYY(f.dueDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${f.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {f.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditFine(f)} className="text-secondary hover:text-secondary-600 p-1"><FiEdit /></button>
                        <button onClick={() => handleDelete("fine", f._id)} className="text-red-600 hover:text-red-700 p-1"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FineManagement;
