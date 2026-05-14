import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUserPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const StudentManagement = ({ 
  students, 
  classes, 
  fetchDashboardData, 
  handleDelete 
}) => {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState("");

  const [studentForm, setStudentForm] = useState({
    studentName: "",
    fathersName: "",
    mothersName: "",
    address: "",
    class: "",
    rollNumber: "",
    enrollmentNumber: "",
    mobileNumber: "",
    studentType: "dayScholar",
    busRoute: "",
    email: "",
    transportOpted: false,
  });

  useEffect(() => {
    const fetchEnrollmentDetails = async () => {
      if (!studentForm.enrollmentNumber) {
        setEnrollmentDetails(null);
        setEnrollmentLoading(false);
        return;
      }
      setEnrollmentLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/enrollmentNumbers/details/${studentForm.enrollmentNumber}`);
        if (res.data) {
          setEnrollmentDetails(res.data);
          if (res.data.name) setStudentForm((prev) => ({ ...prev, studentName: res.data.name }));
        } else {
          setEnrollmentDetails(null);
        }
      } catch (error) {
        setEnrollmentDetails(null);
      } finally {
        setEnrollmentLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (showStudentForm) fetchEnrollmentDetails();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [studentForm.enrollmentNumber, showStudentForm]);

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(`${API_BASE_URL}/api/students/${editingStudent._id}`, studentForm);
        alert("Student updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/students`, studentForm);
        alert("Student added successfully!");
      }
      setShowStudentForm(false);
      resetStudentForm();
      fetchDashboardData();
    } catch (error) {
      console.error("Error saving student:", error);
      alert(error.response?.data?.message || "Error saving student");
    }
  };

  const handleEditStudent = async (student) => {
    setEditingStudent(student);
    setEnrollmentDetails(null);
    try {
      const userRes = await axios.get(`${API_BASE_URL}/api/users/${student.userId._id || student.userId}`);
      setStudentForm({
        studentName: student.studentName,
        fathersName: student.fathersName,
        mothersName: student.mothersName,
        address: student.address,
        class: student.class,
        rollNumber: student.rollNumber,
        enrollmentNumber: student.enrollmentNumber,
        mobileNumber: student.mobileNumber,
        studentType: student.studentType || "dayScholar",
        busRoute: student.busRoute || "",
        email: userRes.data.email || "",
        transportOpted: student.transportOpted || false,
      });
    } catch (error) {
      // Fallback if user email fetch fails
      setStudentForm({ ...student, email: "" });
    }
    setShowStudentForm(true);
  };

  const resetStudentForm = () => {
    setStudentForm({
      studentName: "",
      fathersName: "",
      mothersName: "",
      address: "",
      class: "",
      rollNumber: "",
      enrollmentNumber: "",
      mobileNumber: "",
      studentType: "dayScholar",
      busRoute: "",
      email: "",
      transportOpted: false,
    });
    setEditingStudent(null);
    setEnrollmentDetails(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Students</h2>
        <button
          onClick={() => {
            if (showStudentForm) resetStudentForm();
            setShowStudentForm(!showStudentForm);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FiUserPlus />
          <span>{showStudentForm ? "Cancel" : "Add Student"}</span>
        </button>
      </div>

      {showStudentForm && (
        <form onSubmit={handleSubmitStudent} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-3 mb-4">{editingStudent ? "Edit Student" : "Add Student"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm text-neutral-3/70 mb-1">Enrollment Number *</label>
              <input
                type="text"
                placeholder="Enter Enrollment Number"
                value={studentForm.enrollmentNumber}
                onChange={(e) => setStudentForm({ ...studentForm, enrollmentNumber: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              {enrollmentLoading && <p className="text-xs text-neutral-3/50 mt-1">Searching...</p>}
              {!enrollmentLoading && enrollmentDetails && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="text-blue-800 font-semibold">Enrollment Found: {enrollmentDetails.name || "Unnamed"}</p>
                  <p className={`text-xs ${enrollmentDetails.isUsed ? 'text-orange-600' : 'text-green-600'}`}>
                    Status: {enrollmentDetails.isUsed ? "Used" : "Available"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-neutral-3/70 mb-1">Student Name *</label>
              <input
                type="text"
                placeholder="Auto-filled from enrollment"
                value={studentForm.studentName}
                onChange={(e) => setStudentForm({ ...studentForm, studentName: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <input type="text" placeholder="Father's Name" value={studentForm.fathersName} onChange={(e) => setStudentForm({ ...studentForm, fathersName: e.target.value })} required className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Mother's Name" value={studentForm.mothersName} onChange={(e) => setStudentForm({ ...studentForm, mothersName: e.target.value })} required className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Address" value={studentForm.address} onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })} required className="px-4 py-2 border rounded-lg md:col-span-2" />
            <div>
              <label className="block text-sm text-neutral-3/70 mb-1">Class</label>
              <select value={studentForm.class} onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })} required className="w-full px-4 py-2 border rounded-lg">
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c.className}>{c.className} {c.section ? `- ${c.section}` : ""}</option>
                ))}
              </select>
            </div>
            <input type="text" placeholder="Roll Number" value={studentForm.rollNumber} onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })} required className="px-4 py-2 border rounded-lg" />
            <input type="tel" placeholder="Mobile Number" value={studentForm.mobileNumber} onChange={(e) => setStudentForm({ ...studentForm, mobileNumber: e.target.value })} required className="px-4 py-2 border rounded-lg" />
            <div>
              <label className="block text-sm text-neutral-3/70 mb-1">Student Type</label>
              <select value={studentForm.studentType} onChange={(e) => setStudentForm({ ...studentForm, studentType: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                <option value="dayScholar">Day Scholar</option>
                <option value="hosteler">Hosteler</option>
              </select>
            </div>
            {studentForm.studentType === "dayScholar" && (
              <>
                <input type="text" placeholder="Bus Route" value={studentForm.busRoute} onChange={(e) => setStudentForm({ ...studentForm, busRoute: e.target.value })} className="px-4 py-2 border rounded-lg" />
                <div className="flex items-center">
                  <input type="checkbox" id="transportOpted" checked={studentForm.transportOpted} onChange={(e) => setStudentForm({ ...studentForm, transportOpted: e.target.checked })} className="mr-2" />
                  <label htmlFor="transportOpted" className="text-sm text-neutral-3/70">Opt for Transport</label>
                </div>
              </>
            )}
            <input type="email" placeholder="Email (Optional)" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} className="px-4 py-2 border rounded-lg md:col-span-2" />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold transition hover:bg-primary-700">{editingStudent ? "Update" : "Add Student"}</button>
            <button type="button" onClick={() => { setShowStudentForm(false); resetStudentForm(); }} className="bg-neutral-1 text-neutral-3 px-6 py-2 rounded-lg font-semibold transition hover:bg-neutral-1/80">Cancel</button>
          </div>
        </form>
      )}

      {/* Class Filter */}
      <div className="mb-6 bg-neutral-2 p-4 rounded-lg shadow-sm">
        <label className="block text-sm font-semibold text-neutral-3 mb-2">Filter by Class</label>
        <select value={selectedClassForStudents} onChange={(e) => setSelectedClassForStudents(e.target.value)} className="px-4 py-2 border rounded-lg w-full md:w-64">
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls.className}>{cls.className} {cls.section ? `- ${cls.section}` : ""}</option>
          ))}
        </select>
      </div>

      <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Roll No</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students
                .filter((s) => !selectedClassForStudents || s.class === selectedClassForStudents)
                .map((s) => (
                  <tr key={s._id} className="border-b border-neutral-1 hover:bg-neutral-1/30 transition">
                    <td className="px-4 py-3 text-neutral-3 font-medium">{s.studentName}</td>
                    <td className="px-4 py-3 text-neutral-3">{s.class}</td>
                    <td className="px-4 py-3 text-neutral-3">{s.rollNumber}</td>
                    <td className="px-4 py-3 text-neutral-3">{s.mobileNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditStudent(s)} className="text-secondary hover:text-secondary-600 p-1 rounded hover:bg-secondary/10 transition"><FiEdit /></button>
                        <button onClick={() => handleDelete("student", s._id)} className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
