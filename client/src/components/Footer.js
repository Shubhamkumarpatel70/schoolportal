import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">School Portal</h3>
            <p className="text-white/80">
              Empowering education through technology. Connecting students, teachers, and administrators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-white/80 hover:text-white transition">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/gallery" className="text-white/80 hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-white/80 hover:text-white transition">
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/80 hover:text-white transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <FiMapPin className="text-secondary" />
                <span className="text-white/80">123 School Street, City, State 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="text-secondary" />
                <span className="text-white/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-secondary" />
                <span className="text-white/80">info@schoolportal.com</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white/80 hover:text-secondary transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-secondary transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-secondary transition">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} School Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

