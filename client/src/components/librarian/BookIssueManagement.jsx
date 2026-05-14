import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiCornerDownLeft, FiClock, FiUser, FiBook, FiCheckCircle } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const BookIssueManagement = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bookId: "", userId: "", dueDate: "" });
  const [searchCriteria, setSearchCriteria] = useState({ className: "", rollNumber: "" });
  const [autofilledName, setAutofilledName] = useState("");

  useEffect(() => {
    fetchIssues();
    fetchBooks();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookIssues`);
      setIssues(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`);
      setBooks(res.data.filter(b => b.available > 0));
    } catch (e) { console.error(e); }
  };

  const handleStudentSearch = async (roll) => {
    setSearchCriteria({ ...searchCriteria, rollNumber: roll });
    if (roll && searchCriteria.className) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/students/search-specific?className=${searchCriteria.className}&rollNumber=${roll}`);
        if (res.data) {
          setForm({ ...form, userId: res.data.userId?._id });
          setAutofilledName(res.data.studentName);
        }
      } catch (e) { 
        setAutofilledName("Student not found");
        setForm({ ...form, userId: "" });
      }
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/bookIssues`, form);
      alert("Book issued successfully!");
      setShowForm(false);
      setForm({ bookId: "", userId: "", dueDate: "" });
      setSearchCriteria({ className: "", rollNumber: "" });
      setAutofilledName("");
      fetchIssues();
      fetchBooks();
    } catch (e) { alert("Error issuing book"); }
  };

  const handleReturn = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/bookIssues/${id}/return`);
      fetchIssues();
      fetchBooks();
    } catch (e) { alert("Error returning book"); }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-3">Book Issue & Return</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
          <FiPlus /> {showForm ? "Cancel" : "New Issue"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleIssue} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40">Select Book</label>
              <select value={form.bookId} onChange={e => setForm({...form, bookId: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none bg-white">
                <option value="">Choose a book...</option>
                {books.map(b => <option key={b._id} value={b._id}>{b.title} ({b.available} available)</option>)}
              </select>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-40">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required className="w-full px-4 py-3 border rounded-xl outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40">Class</label>
              <select 
                value={searchCriteria.className} 
                onChange={e => { setSearchCriteria({...searchCriteria, className: e.target.value}); setAutofilledName(""); }} 
                required 
                className="w-full px-4 py-3 border rounded-xl outline-none bg-white"
              >
                <option value="">Select Class</option>
                {["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40">Roll Number</label>
              <input 
                type="text" 
                placeholder="Enter Roll No" 
                value={searchCriteria.rollNumber}
                onChange={e => handleStudentSearch(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-40">Student Name</label>
              <div className={`w-full px-4 py-3 border rounded-xl bg-neutral-1 font-bold ${autofilledName === 'Student not found' ? 'text-red-500' : 'text-neutral-3'}`}>
                {autofilledName || "Auto-fills..."}
              </div>
            </div>
          </div>
          <button type="submit" disabled={!form.userId || !form.bookId} className="bg-primary text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50">Issue Book</button>
        </form>
      )}

      <div className="bg-neutral-2 rounded-2xl border border-neutral-1 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4">Borrower</th>
              <th className="px-6 py-4">Book Title</th>
              <th className="px-6 py-4">Issue Date</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(i => (
              <tr key={i._id} className="border-b border-neutral-1 hover:bg-neutral-1 transition">
                <td className="px-6 py-4">
                    <p className="font-bold text-neutral-3">{i.user?.name}</p>
                    <p className="text-[10px] opacity-40 uppercase font-black">{i.user?.role}</p>
                </td>
                <td className="px-6 py-4 font-medium">{i.book?.title}</td>
                <td className="px-6 py-4 opacity-60">{formatDateDDMMYYYY(i.issueDate)}</td>
                <td className={`px-6 py-4 font-bold ${new Date(i.dueDate) < new Date() && i.status === 'issued' ? 'text-red-600' : 'opacity-60'}`}>{formatDateDDMMYYYY(i.dueDate)}</td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${i.status === 'returned' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {i.status}
                    </span>
                </td>
                <td className="px-6 py-4">
                    {i.status === 'issued' && (
                        <button onClick={() => handleReturn(i._id)} className="bg-white border border-neutral-1 p-2 rounded-lg text-primary hover:bg-primary hover:text-white transition shadow-sm">
                            <FiCornerDownLeft />
                        </button>
                    )}
                    {i.status === 'returned' && <FiCheckCircle className="text-green-600 text-lg ml-2" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {issues.length === 0 && <div className="p-10 text-center opacity-30 italic">No book issues on record</div>}
      </div>
    </div>
  );
};

export default BookIssueManagement;
