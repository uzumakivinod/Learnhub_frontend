import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ openAuthModal }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LearnHub
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`font-semibold transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`font-semibold transition-colors ${
                isActive('/courses') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Courses
            </Link>
            <Link
              to="/learning-paths"
              className={`font-semibold transition-colors ${
                location.pathname.startsWith('/learning-paths') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Learning Paths
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`font-semibold transition-colors ${
                  location.pathname.startsWith('/admin') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;