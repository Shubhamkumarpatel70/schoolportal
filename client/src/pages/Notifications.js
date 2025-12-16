import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import { FiBell, FiInfo, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Notifications</h1>
            <p className="text-xl text-white/90">
              Stay informed with the latest updates
            </p>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="py-16 bg-neutral-1">
          <div className="container mx-auto px-4">
            {!user ? (
              <div className="max-w-2xl mx-auto bg-accent/10 border border-accent/30 rounded-lg p-6 text-center">
                <p className="text-neutral-3">
                  Please <a href="/login" className="text-primary font-semibold">login</a> to view notifications.
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <FiBell className="text-6xl text-neutral-3/40 mx-auto mb-4" />
                <p className="text-neutral-3/70 text-lg">No notifications at the moment.</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="bg-neutral-2 rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold mb-2 text-neutral-3">
                          {notification.title}
                        </h3>
                        <p className="text-neutral-3/70 mb-2">{notification.message}</p>
                        <p className="text-sm text-neutral-3/50">
                          {new Date(notification.createdAt).toLocaleDateString()}
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

