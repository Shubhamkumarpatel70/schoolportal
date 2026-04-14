import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiChevronRight, FiGrid, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/announcements`);
        setAnnouncements(res.data || []);
      } catch (error) {
        setAnnouncements([]);
      }
    };
    fetchAnnouncements();
    const intervalId = setInterval(fetchAnnouncements, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    const role = user.role;
    return `/${role}/dashboard`;
  };

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/events', label: 'Events' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/results', label: 'Results' },
    { to: '/contact', label: 'Contact' }
  ];

  const getNavClass = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-primary text-white shadow-md'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group inline-flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white shadow-lg shadow-primary/20">
            S
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              School Portal
            </span>
            <span className="text-xs font-medium text-slate-500">Academic Management</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {publicLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={getNavClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <FiGrid />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                    isActive ? 'text-primary' : 'text-slate-600 hover:text-slate-900'
                  ].join(' ')
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/30 transition hover:bg-primary-600"
              >
                Register
                <FiChevronRight />
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {publicLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="my-1 h-px bg-slate-200" />
            {user ? (
              <>
                <NavLink
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <FiUser />
                  <span>Go to Dashboard</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <NavLink
                  to="/login"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
      {location.pathname === '/' && announcements.length > 0 && (
        <div className="border-t border-slate-200 bg-amber-50/90">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-hidden px-4 py-2 text-xs font-medium text-amber-900 sm:px-6 lg:px-8 sm:text-sm">
            <span className="shrink-0 font-semibold">Announcements:</span>
            <div className="relative w-full overflow-hidden">
              <div className="inline-block min-w-full whitespace-nowrap animate-[marquee_25s_linear_infinite]">
                {announcements
                  .map((item) => `${item.title}: ${item.message}`)
                  .join('   |   ')}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </header>
  );
};

export default Header;

