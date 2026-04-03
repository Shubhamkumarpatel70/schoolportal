import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import { formatDateDDMMYYYY } from '../utils/date';
import { FiBell, FiInfo, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications`);
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'academic':
        return <FiCheckCircle className="text-secondary" />;
      case 'event':
        return <FiBell className="text-secondary" />;
      case 'fee':
        return <FiAlertCircle className="text-accent" />;
      default:
        return <FiInfo className="text-secondary" />;
    }
  };

  return (
    <div className="ui-shell">
      <Header />

      <div className="flex-grow">
        <section className="ui-hero">
          <div className="ui-container relative text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Notifications</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 sm:text-lg">
              Important academic and administrative updates in one place.
            </p>
          </div>
        </section>

        <section className="ui-section">
          <div className="ui-container">
            {!user ? (
              <div className="mx-auto max-w-2xl ui-card p-8 text-center">
                <p className="text-slate-700">
                  Please{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    login
                  </Link>{' '}
                  to view notifications.
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-secondary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="ui-card p-12 text-center">
                <FiBell className="mx-auto mb-4 text-6xl text-slate-300" />
                <p className="text-base text-slate-600">No notifications at the moment.</p>
              </div>
            ) : (
              <div className="mx-auto max-w-5xl space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="ui-card p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-2xl">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {notification.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{notification.message}</p>
                        <p className="mt-3 text-xs font-medium text-slate-500">
                          {formatDateDDMMYYYY(notification.createdAt)}
                        </p>
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

export default Notifications;

