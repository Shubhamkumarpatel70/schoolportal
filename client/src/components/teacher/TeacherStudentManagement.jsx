import React, { useState } from "react";
import axios from "axios";
import { FiUserPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";

const TeacherStudentManagement = ({ students, classTeacher, fetchTeacherData }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    studentName: "",
    fathersName: "",
    mothersName: "",
    address: "",
    class: classTeacher?.className || "",
    rollNumber: "",
    enrollmentNumber: "",
    mobileNumber: "",
    studentType: "dayScholar",
    busRoute: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_BASE_URL}/api/students/${editing._id}`, form);
        alert("Student updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/students`, form);
        alert("Student added successfully!");
      }
      setShowForm(false);
      setEditing(null);
      fetchTeacherData();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving student");
    }
  };

  const filteredStudents = students.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.includes(searchTerm) ||
    s.enrollmentNumber.includes(searchTerm)
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Class Students ({classTeacher?.className})</h2>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-3/40" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FiUserPlus /> {showForm ? "Cancel" : "Add Student"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-2xl mb-6 shadow-sm border border-neutral-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Student Name" value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Roll Number" value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Enrollment Number" value={form.enrollmentNumber} onChange={e => setForm({...form, enrollmentNumber: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Father's Name" value={form.fathersName} onChange={e => setForm({...form, fathersName: e.target.value})} className="px-4 py-2 border rounded-lg" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Mobile" value={form.mobileNumber} onChange={e => setForm({...form, mobileNumber: e.target.value})} className="px-4 py-2 border rounded-lg" />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-bold md:col-span-3">
            {editing ? "Update Student" : "Register Student"}
          </button>
        </form>
      )}

      <div className="bg-neutral-2 rounded-2xl shadow-sm border border-neutral-1 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left">Roll</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Enrollment</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s._id} className="border-b border-neutral-1 hover:bg-neutral-1 transition">
                <td className="px-4 py-3 font-bold text-primary">{s.rollNumber}</td>
                <td className="px-4 py-3 font-medium">{s.studentName}</td>
                <td className="px-4 py-3 opacity-60 font-mono">{s.enrollmentNumber}</td>
                <td className="px-4 py-3">{s.mobileNumber}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(s); setForm(s); setShowForm(true); }} className="p-1.5 text-secondary hover:bg-secondary/10 rounded"><FiEdit /></button>
                  {/* Teachers usually shouldn't delete, but keeping if implemented */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherStudentManagement;
