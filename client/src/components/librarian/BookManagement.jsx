import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiEdit, FiSearch, FiBook, FiHash, FiMapPin } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ title: "", author: "", isbn: "", category: "", quantity: 1, location: "" });

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`);
      setBooks(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/books`, form);
      alert("Book added to collection!");
      setShowForm(false);
      setForm({ title: "", author: "", isbn: "", category: "", quantity: 1, location: "" });
      fetchBooks();
    } catch (e) { alert("Error adding book"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this book?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/books/${id}`);
      setBooks(books.filter(b => b._id !== id));
    } catch (e) { alert("Error deleting book"); }
  };

  const filtered = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-3">Library Catalog</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
          <FiPlus /> {showForm ? "Cancel" : "Add New Book"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Book Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Author" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="ISBN" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Category (e.g. Science)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
            <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required className="px-4 py-3 border rounded-xl outline-none" />
            <input type="text" placeholder="Shelf Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-3 border rounded-xl outline-none" />
          </div>
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Add to Library</button>
        </form>
      )}

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-3/30" />
        <input 
          type="text" 
          placeholder="Search by title or author..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-neutral-2 border rounded-2xl outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(b => (
          <div key={b._id} className="bg-white p-6 rounded-2xl border border-neutral-1 group hover:border-primary/30 transition shadow-sm relative">
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl"><FiBook /></div>
               <button onClick={() => handleDelete(b._id)} className="text-red-600 opacity-0 group-hover:opacity-100 transition"><FiTrash2 /></button>
            </div>
            <h3 className="font-bold text-neutral-3 text-lg leading-tight mb-1">{b.title}</h3>
            <p className="text-xs font-bold text-neutral-3/40 uppercase tracking-widest mb-4">By {b.author}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-neutral-1 p-2 rounded-lg">
                    <p className="text-[10px] font-black uppercase opacity-40">Available</p>
                    <p className="text-sm font-bold text-primary">{b.available} / {b.quantity}</p>
                </div>
                <div className="bg-neutral-1 p-2 rounded-lg">
                    <p className="text-[10px] font-black uppercase opacity-40">Location</p>
                    <p className="text-sm font-bold">{b.location || "N/A"}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-3/60">
                <FiHash /> {b.isbn || "NO ISBN"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookManagement;
