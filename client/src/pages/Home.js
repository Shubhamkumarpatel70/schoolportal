import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { FiBook, FiUsers, FiAward, FiTrendingUp, FiChevronLeft, FiChevronRight, FiCalendar, FiBell } from 'react-icons/fi';

const Home = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchCarousel();
    fetchEvents();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (carouselImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselImages.length]);

  const fetchCarousel = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/carousel`);
      setCarouselImages(res.data);
    } catch (error) {
      console.error('Error fetching carousel:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(res.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Notifications endpoint requires auth, so we'll catch the error gracefully
      const res = await axios.get(`${API_BASE_URL}/api/notifications`).catch(() => ({ data: [] }));
      setNotifications(res.data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Carousel Section */}
      {carouselImages.length > 0 && (
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          {carouselImages.map((item, index) => (
            <div
              key={item._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: item.image ? `url(${item.image})` : 'linear-gradient(to right, #0B3C5D, #328CC1)',
                }}
              >
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    {item.title && <h2 className="text-3xl md:text-5xl font-bold mb-4">{item.title}</h2>}
                    {item.description && <p className="text-xl md:text-2xl">{item.description}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {carouselImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
              >
                <FiChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Hero Section */}
      {carouselImages.length === 0 && (
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to School Portal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Empowering Education Through Technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-neutral-1">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-3">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-neutral-2 p-6 rounded-lg shadow-md text-center">
              <FiBook className="text-4xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-neutral-3">Quality Education</h3>
              <p className="text-neutral-3/70">
                Comprehensive curriculum designed for excellence
              </p>
            </div>
            <div className="bg-neutral-2 p-6 rounded-lg shadow-md text-center">
              <FiUsers className="text-4xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-neutral-3">Expert Faculty</h3>
              <p className="text-neutral-3/70">
                Experienced teachers dedicated to student success
              </p>
            </div>
            <div className="bg-neutral-2 p-6 rounded-lg shadow-md text-center">
              <FiAward className="text-4xl text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-neutral-3">Award Winning</h3>
              <p className="text-neutral-3/70">
                Recognized for academic excellence and innovation
              </p>
            </div>
            <div className="bg-neutral-2 p-6 rounded-lg shadow-md text-center">
              <FiTrendingUp className="text-4xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-neutral-3">Modern Facilities</h3>
              <p className="text-neutral-3/70">
                State-of-the-art infrastructure and technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events and Notifications Section */}
      <section className="py-16 bg-neutral-2">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-3 flex items-center space-x-2">
                  <FiCalendar className="text-secondary" />
                  <span>Upcoming Events</span>
                </h2>
                <Link to="/events" className="text-secondary hover:underline text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-neutral-3/70 text-center py-8">No upcoming events</p>
                ) : (
                  events.map((event) => (
                    <div key={event._id} className="bg-neutral-1 p-4 rounded-lg border-l-4 border-secondary">
                      <h3 className="font-semibold text-neutral-3 mb-1">{event.title}</h3>
                      <p className="text-sm text-neutral-3/70 mb-2">{event.description}</p>
                      <p className="text-xs text-neutral-3/50">
                        {new Date(event.date).toLocaleDateString()}
                        {event.location && ` • ${event.location}`}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Notifications */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-3 flex items-center space-x-2">
                  <FiBell className="text-secondary" />
                  <span>Recent Notifications</span>
                </h2>
                <Link to="/notifications" className="text-secondary hover:underline text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-neutral-3/70 text-center py-8">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification._id} className="bg-neutral-1 p-4 rounded-lg border-l-4 border-secondary">
                      <h3 className="font-semibold text-neutral-3 mb-1">{notification.title}</h3>
                      <p className="text-sm text-neutral-3/70 mb-2">{notification.message}</p>
                      <p className="text-xs text-neutral-3/50">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join our community and experience the future of education
          </p>
          <Link
            to="/register"
            className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition shadow-lg inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

