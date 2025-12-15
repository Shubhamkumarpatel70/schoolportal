import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

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
      await axios.post('http://localhost:5000/api/contacts', formData);
      setMessage('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/90">
              We'd love to hear from you
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-neutral-1">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-neutral-3">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <FiMapPin className="text-secondary text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-neutral-3">Address</h3>
                      <p className="text-neutral-3/70">
                        123 School Street<br />
                        City, State 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <FiPhone className="text-secondary text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-neutral-3">Phone</h3>
                      <p className="text-neutral-3/70">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <FiMail className="text-secondary text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-neutral-3">Email</h3>
                      <p className="text-neutral-3/70">info@schoolportal.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-neutral-3">Send us a Message</h2>
                {message && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    message.includes('Error') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {message}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-neutral-3 font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-3 font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-3 font-semibold mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-3 font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-neutral-2"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

