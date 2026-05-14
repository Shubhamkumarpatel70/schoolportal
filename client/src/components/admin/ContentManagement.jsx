import React, { useState } from "react";
import axios from "axios";
import { FiImage, FiEdit, FiTrash2, FiCalendar, FiUpload } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";
import { formatDateDDMMYYYY } from "../../utils/date";

const ContentManagement = ({ 
  carouselImages, 
  galleryImages, 
  events, 
  fetchDashboardData, 
  handleDelete 
}) => {
  const [activeSubTab, setActiveSubTab] = useState("carousel");

  return (
    <div>
      <div className="flex space-x-4 mb-6 border-b border-neutral-1">
        {["carousel", "gallery", "events"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-2 px-1 capitalize font-medium transition ${activeSubTab === tab ? "text-primary border-b-2 border-primary" : "text-neutral-3/60 hover:text-neutral-3"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === "carousel" && (
        <CarouselList images={carouselImages} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
      {activeSubTab === "gallery" && (
        <GalleryList images={galleryImages} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
      {activeSubTab === "events" && (
        <EventList events={events} fetchDashboardData={fetchDashboardData} handleDelete={handleDelete} />
      )}
    </div>
  );
};

const CarouselList = ({ images, fetchDashboardData, handleDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image: "", title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/carousel`, form);
      setShowForm(false);
      setForm({ image: "", title: "", description: "" });
      fetchDashboardData();
    } catch (error) { alert("Error saving carousel image"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-3">Home Carousel</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiImage /> {showForm ? "Cancel" : "Add Image"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 space-y-4">
          <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Upload</button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map(img => (
          <div key={img._id} className="bg-neutral-2 p-2 rounded-lg border border-neutral-1">
            <img src={img.image} alt={img.title} className="w-full h-32 object-cover rounded mb-2" />
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium truncate flex-1 mr-2">{img.title || "Untitled"}</span>
              <button onClick={() => handleDelete("carousel", img._id)} className="text-red-600"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GalleryList = ({ images, fetchDashboardData, handleDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image: "", galleryName: "", title: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/gallery`, form);
      setShowForm(false);
      fetchDashboardData();
    } catch (error) { alert("Error saving gallery image"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-3">Photo Gallery</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiUpload /> {showForm ? "Cancel" : "Upload Photo"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Gallery Category" value={form.galleryName} onChange={e => setForm({...form, galleryName: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Post</button>
        </form>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map(img => (
          <div key={img._id} className="relative group">
            <img src={img.image} alt="" className="w-full h-40 object-cover rounded-lg" />
            <button onClick={() => handleDelete("gallery", img._id)} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventList = ({ events, fetchDashboardData, handleDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/events`, form);
      setShowForm(false);
      fetchDashboardData();
    } catch (error) { alert("Error saving event"); }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-neutral-3">Events</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiCalendar /> {showForm ? "Cancel" : "New Event"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-neutral-2 p-6 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Event Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required className="px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-2 border rounded-lg md:col-span-2" />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">Create Event</button>
        </form>
      )}
      <div className="space-y-3">
        {events.map(e => (
          <div key={e._id} className="bg-neutral-2 p-4 rounded-lg border border-neutral-1 flex justify-between items-center">
            <div>
              <h4 className="font-bold">{e.title}</h4>
              <p className="text-xs opacity-50">{formatDateDDMMYYYY(e.date)} • {e.location}</p>
            </div>
            <button onClick={() => handleDelete("event", e._id)} className="text-red-600"><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManagement;
