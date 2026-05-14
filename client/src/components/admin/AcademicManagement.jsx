import React, { useState } from "react";
import axios from "axios";
import { FiUserPlus, FiEdit, FiTrash2, FiHash, FiTrendingUp } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import PromotionTool from "./PromotionTool";

const AcademicManagement = ({ 
  classes, 
  teachers, 
  classTeachers, 
  enrollmentNumbers, 
  fetchDashboardData, 
  handleDelete 
}) => {
  const [activeSubTab, setActiveSubTab] = useState("classes");

  return (
    <div>
      <div className="flex space-x-4 mb-6 border-b border-neutral-1">
        {["classes", "teachers", "classTeachers", "enrollments", "promotion"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-2 px-1 capitalize font-medium transition ${activeSubTab === tab ? "text-primary border-b-2 border-primary" : "text-neutral-3/60 hover:text-neutral-3"}`}
          >
            {tab.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {activeSubTab === "classes" && (
        <ClassList classes={classes} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
      {activeSubTab === "teachers" && (
        <TeacherList teachers={teachers} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
      {activeSubTab === "classTeachers" && (
        <ClassTeacherList classTeachers={classTeachers} teachers={teachers} classes={classes} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
      {activeSubTab === "enrollments" && (
        <EnrollmentList enrollmentNumbers={enrollmentNumbers} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
      {activeSubTab === "promotion" && (
        <PromotionTool classes={classes} />
      )}
    </div>
  );
};

const ClassList = ({ classes, fetchDashboardData, handleDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ className: "", section: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await axios.put(`${API_BASE_URL}/api/classes/${editing._id}`, form);
      else await axios.post(`${API_BASE_URL}/api/classes`, form);
      setShowForm(false);
      setEditing(null);
      setForm({ className: "", section: "", description: "" });
      fetchDashboardData();
    } catch (error) { alert("Error saving class"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-3">Classes</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiUserPlus /> {showForm ? "Cancel" : "Add Class"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Class Name" value={form.className} onChange={e => setForm({...form, className: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Section" value={form.section} onChange={e => setForm({...form, section: e.target.value})} className="px-4 py-2 border rounded-lg" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="px-4 py-2 border rounded-lg md:col-span-2" rows="2" />
          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">{editing ? "Update" : "Add"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-neutral-1 text-neutral-3 px-6 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      )}
      <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white">
            <tr><th className="px-4 py-3 text-left">Class Name</th><th className="px-4 py-3 text-left">Section</th><th className="px-4 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c._id} className="border-b border-neutral-1">
                <td className="px-4 py-3">{c.className}</td>
                <td className="px-4 py-3">{c.section || "N/A"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(c); setForm(c); setShowForm(true); }} className="text-secondary"><FiEdit /></button>
                  <button onClick={() => handleDelete("class", c._id)} className="text-red-600"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TeacherList = ({ teachers, fetchDashboardData, handleDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "", qualification: "", experience: "", specialization: "", role: "teacher" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await axios.put(`${API_BASE_URL}/api/teachers/${editing._id}`, form);
      else await axios.post(`${API_BASE_URL}/api/teachers`, form);
      setShowForm(false);
      fetchDashboardData();
      alert("Teacher saved!");
    } catch (error) { alert("Error saving teacher"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-3">Teachers & Accountants</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiUserPlus /> {showForm ? "Cancel" : "Add Staff"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editing} className="px-4 py-2 border rounded-lg" />
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="px-4 py-2 border rounded-lg">
            <option value="teacher">Teacher</option>
            <option value="accountant">Accountant</option>
          </select>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">{editing ? "Update" : "Add"}</button>
        </form>
      )}
      <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white text-left">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t._id} className="border-b border-neutral-1">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 capitalize">{t.role}</td>
                <td className="px-4 py-3">{t.email}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setEditing(t); setForm({...t, password: ""}); setShowForm(true); }} className="text-secondary"><FiEdit /></button>
                  <button onClick={() => handleDelete("teacher", t._id)} className="text-red-600"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const ClassTeacherList = ({ classTeachers, teachers, classes, fetchDashboardData, handleDelete }) => {
  const [form, setForm] = useState({ teacherId: "", className: "", section: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/classTeachers`, form);
      fetchDashboardData();
      alert("Assigned successfully!");
    } catch (error) { alert("Error assigning class teacher"); }
  };

  const selectedClassObj = classes.find(c => c.className === form.className);
  const sections = classes.filter(c => c.className === form.className).map(c => c.section);

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-bold text-neutral-3 mb-4">Assign Class Teachers</h3>
      <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})} required className="px-4 py-2 border rounded-lg">
          <option value="">Select Teacher</option>
          {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.role})</option>)}
        </select>
        <select value={form.className} onChange={e => {
          const name = e.target.value;
          const firstSection = classes.find(c => c.className === name)?.section || "";
          setForm({...form, className: name, section: firstSection});
        }} required className="px-4 py-2 border rounded-lg">
          <option value="">Select Class</option>
          {[...new Set(classes.map(c => c.className))].map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        <select value={form.section} onChange={e => setForm({...form, section: e.target.value})} className="px-4 py-2 border rounded-lg">
          <option value="">Select Section</option>
          {sections.map(s => <option key={s} value={s}>{s || "No Section"}</option>)}
        </select>
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Assign</button>
      </form>
      <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white text-left">
            <tr><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {classTeachers.map(ct => (
              <tr key={ct._id} className="border-b border-neutral-1">
                <td className="px-4 py-3 font-medium">{ct.teacherId?.name || "Deleted"}</td>
                <td className="px-4 py-3">{ct.className} {ct.section}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete("classTeacher", ct._id)} className="text-red-600"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EnrollmentList = ({ enrollmentNumbers, fetchDashboardData, handleDelete }) => {
  const [form, setForm] = useState({ prefix: "", startNumber: "", count: "" });

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/enrollmentNumbers/generate`, form);
      fetchDashboardData();
      alert("Enrollment numbers generated!");
    } catch (error) { alert("Error generating numbers"); }
  };

  return (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-bold text-neutral-3 mb-4">Enrollment Numbers</h3>
      <form onSubmit={handleGenerate} className="bg-neutral-2 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" placeholder="Prefix (e.g. SSS)" value={form.prefix} onChange={e => setForm({...form, prefix: e.target.value})} required className="px-4 py-2 border rounded-lg" />
        <input type="number" placeholder="Start From" value={form.startNumber} onChange={e => setForm({...form, startNumber: e.target.value})} required className="px-4 py-2 border rounded-lg" />
        <input type="number" placeholder="Count" value={form.count} onChange={e => setForm({...form, count: e.target.value})} required className="px-4 py-2 border rounded-lg" />
        <button type="submit" className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold">Generate</button>
      </form>
      <div className="bg-neutral-2 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white text-left">
            <tr><th className="px-4 py-3">Number</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Used By</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {enrollmentNumbers.slice(0, 50).map(en => (
              <tr key={en._id} className="border-b border-neutral-1">
                <td className="px-4 py-3 font-mono">{en.enrollmentNumber}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${en.isUsed ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                    {en.isUsed ? 'Used' : 'Available'}
                  </span>
                </td>
                <td className="px-4 py-3">{en.usedBy?.name || "-"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete("enrollmentNumber", en._id)} className="text-red-600"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enrollmentNumbers.length > 50 && <p className="p-4 text-center text-xs opacity-50">Showing first 50 records</p>}
      </div>
    </div>
  );
};

export default AcademicManagement;
