import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
            <p className="text-xl text-white/90">
              Stay updated with our upcoming events
            </p>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-16 bg-neutral-1">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-3/70 text-lg">No events scheduled at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-neutral-2 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="bg-gradient-to-r from-secondary to-primary h-48 flex items-center justify-center">
                      <FiCalendar className="text-6xl text-white opacity-50" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-neutral-3">{event.title}</h3>
                      <p className="text-neutral-3/70 mb-4">{event.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-neutral-3/70">
                          <FiClock className="mr-2 text-secondary" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-neutral-3/70">
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

