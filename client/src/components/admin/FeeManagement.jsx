import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDollarSign, FiEdit, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const FeeManagement = ({ 
  fees, 
  students, 
  classes, 
  fetchDashboardData, 
  handleDelete 
}) => {
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [feeStudentSearchQuery, setFeeStudentSearchQuery] = useState("");
  const [feeSearchResults, setFeeSearchResults] = useState([]);

  const [feeForm, setFeeForm] = useState({
    selectedClass: "",
    selectedStudent: "",
    studentName: "",
    amount: "",
    feesType: "monthly",
    month: "",
    installmentNumber: "",
    dueDate: "",
    remarks: "",
    feeCategory: "regular",
    transportAmount: "",
  });

  const [feeFilters, setFeeFilters] = useState({
    class: "",
    status: "",
    feeCategory: "",
    feesType: "",
    studentSearch: "",
  });

  const fetchStudentsByClass = async (className) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/fees/class/${className}`);
      setClassStudents(res.data);
    } catch (error) {
      console.error("Error fetching students by class:", error);
      setClassStudents([]);
    }
  };

  const searchStudentsForFee = async (query) => {
    if (!query || query.length < 2) {
      setFeeSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/students/search?q=${encodeURIComponent(query)}`
      );
      setFeeSearchResults(res.data);
    } catch (error) {
      console.error("Error searching students:", error);
      setFeeSearchResults([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchStudentsForFee(feeStudentSearchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [feeStudentSearchQuery]);

  const handleSubmitFee = async (e) => {
    e.preventDefault();
    try {
      const feeData = {
        studentId: feeForm.selectedStudent,
        amount: feeForm.amount,
        feesType: feeForm.feesType,
        month: feeForm.month,
        installmentNumber: feeForm.installmentNumber,
        dueDate: feeForm.dueDate,
        remarks: feeForm.remarks,
        feeCategory: feeForm.feeCategory,
      };

      if (editingFee) {
        await axios.put(`${API_BASE_URL}/api/fees/${editingFee._id}`, feeData);
        setEditingFee(null);
        alert("Fee updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/fees`, feeData);

        if (feeForm.feeCategory === "regular" && feeForm.transportAmount) {
          const selectedStudent = students.find(
            (s) => s._id.toString() === feeForm.selectedStudent
          );
          if (
            selectedStudent &&
            selectedStudent.studentType === "dayScholar" &&
            selectedStudent.transportOpted
          ) {
            await axios.post(`${API_BASE_URL}/api/fees`, {
              studentId: feeForm.selectedStudent,
              amount: feeForm.transportAmount,
              feesType: feeForm.feesType,
              month: feeForm.month,
              installmentNumber: feeForm.installmentNumber,
              dueDate: feeForm.dueDate,
              remarks: "Transport Fee",
              feeCategory: "transport",
            });
          }
        }
        alert("Fee added successfully!");
      }
      setShowFeeForm(false);
      resetFeeForm();
      fetchDashboardData();
    } catch (error) {
      console.error("Error saving fee:", error);
      alert(error.response?.data?.message || "Error saving fee");
    }
  };

  const handleEditFee = (fee) => {
    setEditingFee(fee);
    const student = students.find(
      (s) =>
        s._id.toString() === (fee.studentId?._id || fee.studentId).toString()
    );
    if (student) {
      setFeeForm({
        selectedClass: student.class,
        selectedStudent: student._id,
        studentName: student.studentName,
        amount: fee.amount,
        feesType: fee.feesType || "monthly",
        month: fee.month || "",
        installmentNumber: fee.installmentNumber || "",
        dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split("T")[0] : "",
        remarks: fee.remarks || "",
        feeCategory: fee.feeCategory || "regular",
        transportAmount: "",
      });
      fetchStudentsByClass(student.class);
    }
    setShowFeeForm(true);
  };

  const resetFeeForm = () => {
    setFeeForm({
      selectedClass: "",
      selectedStudent: "",
      studentName: "",
      amount: "",
      feesType: "monthly",
      month: "",
      installmentNumber: "",
      dueDate: "",
      remarks: "",
      feeCategory: "regular",
      transportAmount: "",
    });
    setFeeStudentSearchQuery("");
    setFeeSearchResults([]);
    setClassStudents([]);
  };

  const filteredFees = fees.filter((f) => {
    const student = students.find(
      (s) => s._id.toString() === (f.studentId?._id || f.studentId).toString()
    );

    if (feeFilters.class && (!student || student.class !== feeFilters.class)) return false;
    if (feeFilters.status && f.status !== feeFilters.status) return false;
    if (feeFilters.feeCategory && f.feeCategory !== feeFilters.feeCategory) return false;
    if (feeFilters.feesType && f.feesType !== feeFilters.feesType) return false;

    if (feeFilters.studentSearch) {
      const searchTerm = feeFilters.studentSearch.toLowerCase();
      if (!student) return false;
      return (
        student.studentName.toLowerCase().includes(searchTerm) ||
        (student.rollNumber && student.rollNumber.toString().toLowerCase().includes(searchTerm)) ||
        (student.enrollmentNumber && student.enrollmentNumber.toString().toLowerCase().includes(searchTerm))
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Fees Management</h2>
        <button
          onClick={() => {
            if (showFeeForm) resetFeeForm();
            setShowFeeForm(!showFeeForm);
            setEditingFee(null);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FiDollarSign />
          <span>{showFeeForm ? "Cancel" : "Add Fee"}</span>
        </button>
      </div>

      {showFeeForm && (
        <form onSubmit={handleSubmitFee} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-3 mb-4">
            {editingFee ? "Edit Fee" : "Add Fee"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-3/70 mb-1">Select Class</label>
              <select
                value={feeForm.selectedClass}
                onChange={async (e) => {
                  setFeeForm({ ...feeForm, selectedClass: e.target.value, selectedStudent: "", studentName: "" });
                  if (e.target.value) await fetchStudentsByClass(e.target.value);
                  else setClassStudents([]);
                }}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c.className}>{c.className} {c.section ? `- ${c.section}` : ""}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm text-neutral-3/70 mb-1">Select Student (Search)</label>
              <input
                type="text"
                placeholder="Name, Roll No, Enrollment, or Mobile"
                value={feeStudentSearchQuery}
                onChange={(e) => {
                  setFeeStudentSearchQuery(e.target.value);
                  if (!e.target.value) {
                    setFeeSearchResults([]);
                    setFeeForm({ ...feeForm, selectedStudent: "", studentName: "", transportAmount: "" });
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {(feeSearchResults.length > 0 || (feeStudentSearchQuery.length >= 2 && feeSearchResults.length === 0)) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {feeSearchResults.length > 0 ? (
                    feeSearchResults.map((s) => (
                      <div
                        key={s._id}
                        onClick={() => {
                          setFeeForm({ ...feeForm, selectedStudent: s._id, studentName: s.studentName, transportAmount: "" });
                          setFeeStudentSearchQuery(`${s.rollNumber || 'N/A'} / ${s.enrollmentNumber} - ${s.studentName}`);
                          setFeeSearchResults([]);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {s.rollNumber || 'N/A'} / {s.enrollmentNumber} - {s.studentName} ({s.class})
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">No students found</div>
                  )}
                </div>
              )}
              {!feeStudentSearchQuery && (
                <select
                  value={feeForm.selectedStudent}
                  onChange={(e) => {
                    const student = classStudents.find((s) => s._id === e.target.value);
                    setFeeForm({ ...feeForm, selectedStudent: e.target.value, studentName: student ? student.studentName : "", transportAmount: "" });
                  }}
                  disabled={!feeForm.selectedClass || classStudents.length === 0}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100 mt-2 text-sm"
                >
                  <option value="">Or select from class list</option>
                  {classStudents.map((s) => (
                    <option key={s._id} value={s._id}>{s.rollNumber || 'N/A'} / {s.enrollmentNumber} - {s.studentName}</option>
                  ))}
                </select>
              )}
            </div>
            {feeForm.studentName && (
              <div className="md:col-span-2">
                <label className="block text-sm text-neutral-3/70 mb-1">Student Name</label>
                <input type="text" value={feeForm.studentName} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
              </div>
            )}
            <div>
              <label className="block text-sm text-neutral-3/70 mb-1">Fees Type</label>
              <select
                value={feeForm.feesType}
                onChange={(e) => setFeeForm({ ...feeForm, feesType: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="monthly">Monthly</option>
                <option value="installment">Installment</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            {feeForm.feesType === "monthly" && (
              <div>
                <label className="block text-sm text-neutral-3/70 mb-1">Month</label>
                <input
                  type="text"
                  placeholder="e.g., January 2024"
                  value={feeForm.month}
                  onChange={(e) => setFeeForm({ ...feeForm, month: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            )}
            {feeForm.feesType === "installment" && (
              <div>
                <label className="block text-sm text-neutral-3/70 mb-1">Installment Number</label>
                <input
                  type="number"
                  placeholder="e.g., 1, 2, 3"
                  value={feeForm.installmentNumber}
                  onChange={(e) => setFeeForm({ ...feeForm, installmentNumber: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-neutral-3/70 mb-1">Amount</label>
              <input
                type="number"
                placeholder="Fee Amount"
                value={feeForm.amount}
                onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            {feeForm.selectedStudent && (() => {
              const selectedStudent = students.find((s) => s._id === feeForm.selectedStudent);
              if (selectedStudent?.studentType === "dayScholar" && selectedStudent?.transportOpted) {
                return (
                  <div>
                    <label className="block text-sm text-neutral-3/70 mb-1">Transport Fee (Optional)</label>
                    <input
                      type="number"
                      placeholder="Transport Fee"
                      value={feeForm.transportAmount}
                      onChange={(e) => setFeeForm({ ...feeForm, transportAmount: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <p className="text-xs text-blue-500 mt-1">Student has opted for transport</p>
                  </div>
                );
              }
              return null;
            })()}
            <div>
              <label className="block text-sm text-neutral-3/70 mb-1">Due Date</label>
              <input
                type="date"
                value={feeForm.dueDate}
                onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-neutral-3/70 mb-1">Remarks (Optional)</label>
              <textarea
                value={feeForm.remarks}
                onChange={(e) => setFeeForm({ ...feeForm, remarks: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows="2"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold transition hover:bg-primary-700">
              {editingFee ? "Update Fee" : "Submit Fee"}
            </button>
            <button type="button" onClick={() => { setShowFeeForm(false); resetFeeForm(); }} className="bg-neutral-1 text-neutral-3 px-6 py-2 rounded-lg font-semibold transition hover:bg-neutral-1/80">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter Section */}
      <div className="bg-neutral-2 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-3 mb-4">Filter Fees</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <select value={feeFilters.class} onChange={(e) => setFeeFilters({ ...feeFilters, class: e.target.value })} className="px-4 py-2 border rounded-lg">
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c._id} value={c.className}>{c.className} {c.section ? `- ${c.section}` : ""}</option>
            ))}
          </select>
          <select value={feeFilters.status} onChange={(e) => setFeeFilters({ ...feeFilters, status: e.target.value })} className="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <select value={feeFilters.feeCategory} onChange={(e) => setFeeFilters({ ...feeFilters, feeCategory: e.target.value })} className="px-4 py-2 border rounded-lg">
            <option value="">All Categories</option>
            <option value="regular">Regular</option>
            <option value="transport">Transport</option>
            <option value="fine">Fine</option>
          </select>
          <select value={feeFilters.feesType} onChange={(e) => setFeeFilters({ ...feeFilters, feesType: e.target.value })} className="px-4 py-2 border rounded-lg">
            <option value="">All Types</option>
            <option value="monthly">Monthly</option>
            <option value="installment">Installment</option>
            <option value="annual">Annual</option>
          </select>
          <input
            type="text"
            placeholder="Search Name/Roll/Enroll"
            value={feeFilters.studentSearch}
            onChange={(e) => setFeeFilters({ ...feeFilters, studentSearch: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setFeeFilters({ class: "", status: "", feeCategory: "", feesType: "", studentSearch: "" })}
            className="px-4 py-1 text-sm bg-neutral-1 text-neutral-3 rounded hover:bg-neutral-1/80 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredFees.map((f) => {
                const student = students.find(s => s._id.toString() === (f.studentId?._id || f.studentId).toString());
                return (
                  <tr key={f._id} className="border-b border-neutral-1 hover:bg-neutral-1/30 transition">
                    <td className="px-4 py-3 text-neutral-3">
                      <div className="font-medium">{f.studentId?.studentName || student?.studentName || "N/A"}</div>
                      <div className="text-xs text-neutral-3/50">{student?.enrollmentNumber || 'No Enroll'}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-3">{student?.class || "N/A"}</td>
                    <td className="px-4 py-3 text-neutral-3 capitalize">{f.feesType || "monthly"}</td>
                    <td className="px-4 py-3 text-neutral-3 capitalize">{f.feeCategory || "regular"}</td>
                    <td className="px-4 py-3 text-neutral-3 font-semibold text-lg">₹{f.amount}</td>
                    <td className="px-4 py-3 text-neutral-3">{formatDateDDMMYYYY(f.dueDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        f.status === "paid" ? "bg-green-100 text-green-800 border border-green-300" :
                        f.status === "overdue" ? "bg-red-100 text-red-800 border border-red-300" :
                        "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      }`}>
                        {f.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditFee(f)} className="text-secondary hover:text-secondary-600 p-1 rounded hover:bg-secondary/10 transition" title="Edit">
                          <FiEdit />
                        </button>
                        <button onClick={() => handleDelete("fee", f._id)} className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition" title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredFees.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-neutral-3/50 italic">No fees matching current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeeManagement;
