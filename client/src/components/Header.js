import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    const role = user.role;
    return `/${role}/dashboard`;
  };

  return (
    <header className="bg-neutral-2 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            School Portal
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-neutral-3 hover:text-secondary transition">
              Home
            </Link>
            <Link to="/about" className="text-neutral-3 hover:text-secondary transition">
              About
            </Link>
            <Link to="/contact" className="text-neutral-3 hover:text-secondary transition">
              Contact
            </Link>
            <Link to="/gallery" className="text-neutral-3 hover:text-secondary transition">
              Gallery
            </Link>
            <Link to="/results" className="text-neutral-3 hover:text-secondary transition">
              Results
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 text-neutral-3 hover:text-secondary transition"
                >
                  <FiUser />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-neutral-3 hover:text-secondary transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-3"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              to="/"
              className="block text-neutral-3 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-neutral-3 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-neutral-3 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/gallery"
              className="block text-neutral-3 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/results"
              className="block text-neutral-3 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Results
            </Link>
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 text-neutral-3 hover:text-secondary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition w-full"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-neutral-3 hover:text-secondary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

