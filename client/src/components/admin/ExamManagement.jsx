import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiPlus, FiTrash2, FiEdit, FiClock } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const ExamManagement = ({ classes }) => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    examName: "",
    className: "",
    subjects: [{ subjectName: "", date: "", startTime: "", endTime: "", maxMarks: "" }]
  });

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/examSchedules`);
      setSchedules(res.data);
    } catch (error) {
      console.error("Error fetching exam schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSubject = () => {
    setForm({
      ...form,
      subjects: [...form.subjects, { subjectName: "", date: "", startTime: "", endTime: "", maxMarks: "" }]
    });
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = form.subjects.filter((_, i) => i !== index);
    setForm({ ...form, subjects: newSubjects });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...form.subjects];
    newSubjects[index][field] = value;
    setForm({ ...form, subjects: newSubjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_BASE_URL}/api/examSchedules/${editing._id}`, form);
        alert("Schedule updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/examSchedules`, form);
        alert("Exam schedule created successfully!");
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchSchedules();
    } catch (error) {
      alert("Error saving exam schedule");
    }
  };

  const handleEdit = (schedule) => {
    setEditing(schedule);
    setForm({
      examName: schedule.examName,
      className: schedule.className,
      subjects: schedule.subjects.map(s => ({
        ...s,
        date: s.date ? new Date(s.date).toISOString().split('T')[0] : ""
      }))
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/examSchedules/${id}`);
      fetchSchedules();
    } catch (error) {
      alert("Error deleting schedule");
    }
  };

  const resetForm = () => {
    setForm({
      examName: "",
      className: "",
      subjects: [{ subjectName: "", date: "", startTime: "", endTime: "", maxMarks: "" }]
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-3">Exam Management</h2>
        <button
          onClick={() => {
            if (showForm) { resetForm(); setEditing(null); }
            setShowForm(!showForm);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FiPlus />
          <span>{showForm ? "Cancel" : "Create Datesheet"}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-2xl mb-6 shadow-sm border border-neutral-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neutral-3/70 mb-1">Exam Name</label>
              <input 
                type="text" 
                placeholder="e.g. Unit Test 1" 
                value={form.examName} 
                onChange={e => setForm({...form, examName: e.target.value})} 
                required 
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-3/70 mb-1">Target Class</label>
              <select 
                value={form.className} 
                onChange={e => setForm({...form, className: e.target.value})} 
                required 
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Class</option>
                {[...new Set(classes.map(c => c.className))].map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-neutral-3">Subjects & Dates</h3>
              <button type="button" onClick={handleAddSubject} className="text-primary hover:text-primary-700 text-sm font-bold flex items-center gap-1">
                <FiPlus /> Add Subject
              </button>
            </div>
            
            {form.subjects.map((sub, index) => (
              <div key={index} className="p-4 bg-white rounded-xl border border-neutral-1 grid grid-cols-1 md:grid-cols-5 gap-3 relative group">
                <input type="text" placeholder="Subject" value={sub.subjectName} onChange={e => handleSubjectChange(index, 'subjectName', e.target.value)} required className="px-3 py-1.5 border rounded text-sm" />
                <input type="date" value={sub.date} onChange={e => handleSubjectChange(index, 'date', e.target.value)} required className="px-3 py-1.5 border rounded text-sm" />
                <input type="time" value={sub.startTime} onChange={e => handleSubjectChange(index, 'startTime', e.target.value)} className="px-3 py-1.5 border rounded text-sm" />
                <input type="time" value={sub.endTime} onChange={e => handleSubjectChange(index, 'endTime', e.target.value)} className="px-3 py-1.5 border rounded text-sm" />
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Max Marks" value={sub.maxMarks} onChange={e => handleSubjectChange(index, 'maxMarks', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm" />
                  {form.subjects.length > 1 && (
                    <button type="button" onClick={() => handleRemoveSubject(index)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-white px-8 py-2 rounded-lg font-bold hover:bg-primary-700 transition">
              {editing ? "Update Datesheet" : "Publish Datesheet"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="bg-neutral-1 text-neutral-3 px-8 py-2 rounded-lg font-bold hover:bg-neutral-1/80">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-center py-10 opacity-50">Loading schedules...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((s) => (
            <div key={s._id} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-3">{s.examName}</h3>
                  <p className="text-sm font-bold text-primary">Class: {s.className}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(s)} className="p-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20"><FiEdit /></button>
                  <button onClick={() => handleDelete(s._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><FiTrash2 /></button>
                </div>
              </div>
              
              <div className="space-y-2">
                {s.subjects.map((sub, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-1 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-1 rounded-full flex items-center justify-center text-xs font-bold text-neutral-3">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-3">{sub.subjectName}</p>
                        <p className="text-[10px] opacity-50 flex items-center gap-1">
                          <FiCalendar /> {formatDateDDMMYYYY(sub.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-neutral-3 flex items-center justify-end gap-1">
                        <FiClock /> {sub.startTime || "--:--"} - {sub.endTime || "--:--"}
                      </p>
                      <p className="text-[10px] opacity-50">Max Marks: {sub.maxMarks || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {schedules.length === 0 && (
            <div className="md:col-span-2 py-20 text-center bg-neutral-2 rounded-2xl border-2 border-dashed border-neutral-1 text-neutral-3/40">
              No exam schedules found. Click "Create Datesheet" to start.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamManagement;
