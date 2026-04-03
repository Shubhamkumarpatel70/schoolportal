import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await axios.post(`${API_BASE_URL}/api/contacts`, formData);
      setMessage('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ui-shell">
      <Header />

      <div className="flex-grow">
        <section className="ui-hero">
          <div className="ui-container relative text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Contact Us</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 sm:text-lg">
              Reach out for admissions, academic support, or general school inquiries.
            </p>
          </div>
        </section>

        <section className="ui-section">
          <div className="ui-container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="ui-card p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Get in Touch</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Our team is available during working hours for student and parent assistance.
                </p>
                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3">
                      <FiMapPin className="text-lg text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Address</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        123 School Street<br />
                        City, State 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3">
                      <FiPhone className="text-lg text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Phone</h3>
                      <p className="mt-1 text-sm text-slate-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3">
                      <FiMail className="text-lg text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Email</h3>
                      <p className="mt-1 text-sm text-slate-600">info@schoolportal.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ui-card p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Send a Message</h2>
                <p className="mt-2 text-sm text-slate-600">Use this form and our team will respond shortly.</p>
                {message && (
                  <div className={`mb-5 mt-5 ${
                    message.includes('Error') 
                      ? 'ui-status-error' 
                      : 'ui-status-success'
                  }`}>
                    {message}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="ui-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="ui-input"
                    />
                  </div>
                  <div>
                    <label className="ui-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="ui-input"
                    />
                  </div>
                  <div>
                    <label className="ui-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="ui-input"
                    />
                  </div>
                  <div>
                    <label className="ui-label">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="ui-textarea"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ui-btn-primary"
                  >
                    <FiSend />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;

