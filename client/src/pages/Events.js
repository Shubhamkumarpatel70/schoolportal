import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { formatDateDDMMYYYY } from '../utils/date';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => formatDateDDMMYYYY(dateString);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const matchesTimeline = viewMode === 'all'
        ? true
        : viewMode === 'upcoming'
        ? eventDate >= today
        : eventDate < today;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query
        || event.title?.toLowerCase().includes(query)
        || event.description?.toLowerCase().includes(query)
        || event.location?.toLowerCase().includes(query);
      return matchesTimeline && matchesSearch;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="ui-shell">
      <Header />

      <div className="flex-grow">
        <section className="ui-hero">
          <div className="ui-container relative text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">School Events</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 sm:text-lg">
              Track important activities, programs, and campus milestones.
            </p>
          </div>
        </section>

        <section className="ui-section">
          <div className="ui-container">
            <div className="ui-card mb-6 p-5 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setViewMode('upcoming')}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      viewMode === 'upcoming' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setViewMode('past')}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      viewMode === 'past' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Past
                  </button>
                  <button
                    onClick={() => setViewMode('all')}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      viewMode === 'all' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>
                </div>
                <div className="w-full md:w-72">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ui-input"
                    placeholder="Search event, location..."
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-secondary" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="ui-card p-12 text-center">
                <p className="text-base text-slate-600">No events found for the selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-44 overflow-hidden bg-gradient-to-br from-secondary to-primary">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FiCalendar className="text-6xl text-white/70 transition group-hover:scale-110" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
                      <div className="mt-5 space-y-2 text-sm text-slate-600">
                        <div className="flex items-center">
                          <FiClock className="mr-2 text-secondary" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <FiMapPin className="mr-2 text-secondary" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Events;

