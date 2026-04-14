import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { formatDateDDMMYYYY } from '../utils/date';
import {
  FiAlertCircle,
  FiArrowRight,
  FiAward,
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiLayout,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchCarousel();
    fetchEvents();
    fetchNotifications();
    fetchNotices();
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

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notices`);
      setNotices(res.data.slice(0, 5)); // Show latest 5 notices
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const spotlightStats = [
    { label: 'Upcoming Events', value: events.length.toString(), icon: FiCalendar },
    { label: 'Active Notices', value: notices.length.toString(), icon: FiAlertCircle },
    { label: 'Notifications', value: notifications.length.toString(), icon: FiBell },
    { label: 'Portal Access', value: user ? 'Member' : 'Open', icon: FiUsers }
  ];  

  const getNoticeCardClasses = (tag) => {
    if (tag === 'urgent') return 'border-red-200 bg-red-50';
    if (tag === 'new') return 'border-emerald-200 bg-emerald-50';
    if (tag === 'festival') return 'border-purple-200 bg-purple-50';
    if (tag === 'holiday') return 'border-amber-200 bg-amber-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getNoticeBadgeClasses = (tag) => {
    if (tag === 'urgent') return 'bg-red-100 text-red-700';
    if (tag === 'new') return 'bg-emerald-100 text-emerald-700';
    if (tag === 'festival') return 'bg-purple-100 text-purple-700';
    if (tag === 'holiday') return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="ui-shell">
      <Header />

      {carouselImages.length > 0 && (
        <section className="relative h-[320px] overflow-hidden sm:h-[420px] lg:h-[520px]">
          {carouselImages.map((item, index) => (
            <div
              key={item._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: item.image ? `url(${item.image})` : 'linear-gradient(to right, #0B3C5D, #328CC1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-primary/70 to-primary/40">
                  <div className="ui-container flex h-full items-center">
                    <div className="max-w-2xl text-white">
                      <p className="mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        Welcome to School Portal
                      </p>
                      {item.title && <h1 className="text-2xl font-bold sm:text-4xl lg:text-5xl">{item.title}</h1>}
                      {item.description && (
                        <p className="mt-3 line-clamp-3 text-xs text-white/90 sm:mt-4 sm:text-base lg:text-lg">{item.description}</p>
                      )}
                      <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                        <Link to="/register" className="ui-btn-primary bg-accent text-primary hover:bg-accent-600">
                          Start Enrollment
                        </Link>
                        <Link to="/about" className="ui-btn-secondary border-white/70 bg-white/15 text-white hover:bg-white/20">
                          Discover Campus
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {carouselImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/20 p-1.5 text-white transition hover:bg-black/40 sm:left-4 sm:p-2"
                aria-label="Previous slide"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/20 p-1.5 text-white transition hover:bg-black/40 sm:right-4 sm:p-2"
                aria-label="Next slide"
              >
                <FiChevronRight size={20} />
              </button>
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 w-8 rounded-full transition ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {carouselImages.length === 0 && (
        <section className="ui-hero">
          <div className="ui-container relative text-center">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">Education, Operations, and Outcomes in One Place</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base text-white/90 sm:text-xl">
              A connected digital campus for students, teachers, and administration teams.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="ui-btn-primary bg-accent text-primary hover:bg-accent-600">
                Get Started
              </Link>
              <Link to="/about" className="ui-btn-secondary border-white/70 bg-white/15 text-white hover:bg-white/20">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="ui-section py-8 sm:py-10">
        <div className="ui-container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {spotlightStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.label}
                  className="ui-stat-card ui-fade-up p-4 sm:p-5"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                      {item.label}
                    </span>
                    <Icon className="mt-0.5 shrink-0 text-base text-secondary sm:text-lg" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-900 sm:mt-4 sm:text-3xl">{item.value}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ui-section">
        <div className="ui-container">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 sm:text-4xl">Why Parents Trust Us</h2>
            <p className="ui-subtitle mx-auto max-w-2xl">
              Clear communication, strong academics, and measurable student progress.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="ui-card ui-fade-up p-6">
              <FiBookOpen className="text-3xl text-secondary" />
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Academic Excellence</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Structured curriculum and outcomes-focused teaching standards.</p>
            </div>
            <div className="ui-card ui-fade-up p-6" style={{ animationDelay: '70ms' }}>
              <FiUsers className="text-3xl text-secondary" />
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Experienced Faculty</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Subject specialists committed to mentoring and performance.</p>
            </div>
            <div className="ui-card ui-fade-up p-6" style={{ animationDelay: '140ms' }}>
              <FiAward className="text-3xl text-accent" />
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Recognized Standards</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Consistent benchmarks across academics, activities, and discipline.</p>
            </div>
            <div className="ui-card ui-fade-up p-6" style={{ animationDelay: '210ms' }}>
              <FiTrendingUp className="text-3xl text-secondary" />
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Growth Dashboard</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Transparent student and institutional progress tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {notices.length > 0 && (
        <section className="ui-section pt-4">
          <div className="ui-container">
            <div className="ui-card overflow-hidden">
              <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  <FiAlertCircle className="text-secondary" />
                  Campus Notices
                </h2>
              </div>
              <div className="space-y-4 px-5 py-6 sm:px-8">
                {notices.map((notice) => (
                  <article
                    key={notice._id}
                    className={`rounded-xl border p-5 ${getNoticeCardClasses(notice.tag)}`}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{notice.title}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getNoticeBadgeClasses(notice.tag)}`}
                      >
                        {notice.tag || 'normal'}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">{notice.message}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <FiCalendar />
                        {formatDateDDMMYYYY(notice.createdAt)}
                      </span>
                      <span>{notice.createdBy?.name ? `Posted by ${notice.createdBy.name}` : 'School Administration'}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="ui-section">
        <div className="ui-container">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="ui-card p-5 sm:p-8">
              <div className="mb-5 flex items-start justify-between gap-2 sm:mb-6 sm:gap-3">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-2xl">
                  <FiCalendar className="text-secondary" />
                  Upcoming Events
                </h2>
                <Link to="/events" className="shrink-0 whitespace-nowrap pt-1 text-sm font-semibold leading-tight text-secondary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                    No upcoming events.
                  </p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event._id}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-secondary/40"
                    >
                      <h3 className="text-base font-semibold text-slate-900">{event.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{event.description}</p>
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        {formatDateDDMMYYYY(event.date)}
                        {event.location ? ` • ${event.location}` : ''}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="ui-card p-5 sm:p-8">
              <div className="mb-5 flex items-start justify-between gap-2 sm:mb-6 sm:gap-3">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-2xl">
                  <FiBell className="text-secondary" />
                  Notifications
                </h2>
                <Link to="/notifications" className="shrink-0 whitespace-nowrap pt-1 text-sm font-semibold leading-tight text-secondary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                    No notifications available.
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-secondary/40"
                    >
                      <h3 className="text-base font-semibold text-slate-900">{notification.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        {formatDateDDMMYYYY(notification.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ui-section pt-4">
        <div className="ui-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-secondary px-6 py-10 text-white shadow-xl shadow-primary/30 sm:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_35%)]" />
            <div className="relative max-w-3xl">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to Move Forward?</h2>
              <p className="mt-4 text-base text-white/90 sm:text-lg">
                {user
                  ? `Welcome back, ${user.name}! Access your dashboard to continue.`
                  : 'Join our school community and start your academic journey today.'}
              </p>
              <div className="mt-8">
                {user ? (
                  <button
                    onClick={() => {
                      const role = user.role || 'student';
                      navigate(`/${role}/dashboard`);
                    }}
                    className="ui-btn-primary bg-accent text-primary hover:bg-accent-600"
                  >
                    <FiLayout />
                    <span>Go to Dashboard</span>
                  </button>
                ) : (
                  <Link to="/register" className="ui-btn-primary bg-accent text-primary hover:bg-accent-600">
                    Register Now
                    <FiArrowRight />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

