import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="relative mt-16 overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(80,170,220,0.35),transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(11,60,93,0.9),transparent_50%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">School Portal</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              A modern school operations platform that keeps academics, communication, and outcomes tightly connected.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[FiFacebook, FiTwitter, FiInstagram].map((Icon, index) => (
                <button
                  type="button"
                  key={index}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-200 transition hover:border-secondary hover:text-white"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-300 transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 transition hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-300 transition hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 transition hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Resources</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/gallery" className="text-slate-300 transition hover:text-white">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-slate-300 transition hover:text-white">
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-slate-300 transition hover:text-white">
                  Results
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 transition hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-300 transition hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-300">
                <FiMapPin className="mt-0.5 text-secondary" />
                <span>123 School Street, City, State 12345</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <FiPhone className="text-secondary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <FiMail className="text-secondary" />
                <span>info@schoolportal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>&copy; {new Date().getFullYear()} School Portal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="transition hover:text-white">About</Link>
            <Link to="/contact" className="transition hover:text-white">Support</Link>
            <Link to="/results" className="transition hover:text-white">Results</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

