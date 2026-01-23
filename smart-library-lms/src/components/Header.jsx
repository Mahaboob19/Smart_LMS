// components/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';

const Header = ({ customNavItems, activeSection, onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        setUser(authAPI.getCurrentUser());
      }
    };
    checkAuth();
  }, []);

  const defaultNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const displayNavItems = customNavItems || defaultNavItems;

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/landing');
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    // Navigate to profile page or show profile modal
    // For now, just close dropdown
  };

  const handleNavItemClick = (e, item) => {
    if (customNavItems && onNavClick) {
      e.preventDefault();
      onNavClick(item.id);
      setIsMenuOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img
                src="/VVIT_logo.png"
                alt="VVIT Logo"
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-fallback" className="hidden items-center">
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">VVIT</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-tight">VVIT University</div>
                  <div className="text-xs text-gray-600">Library Management System</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block h-8 w-px bg-gray-200"></div>

            <div className="hidden md:block">
              <span className="text-xl font-bold text-gray-800">
                Smart<span className="text-blue-600">Library</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(isLoggedIn || !customNavItems) && displayNavItems.map((item) => (
              <a
                key={item.name}
                href={item.href || '#'}
                onClick={(e) => handleNavItemClick(e, item)}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group cursor-pointer ${activeSection && activeSection === item.id ? 'text-blue-600' : ''
                  }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${activeSection && activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </a>
            ))}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="User Menu"
                >
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button - Only show when not logged in OR if customNavItems exist */}
          {(!isLoggedIn || customNavItems) && (
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* User Icon for Mobile when logged in and NO custom items (default behavior) */}
          {isLoggedIn && !customNavItems && (
            <div className="md:hidden relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="User Menu"
              >
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {(isLoggedIn || !customNavItems) && displayNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href || '#'}
                  onClick={(e) => handleNavItemClick(e, item)}
                  className={`text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200 border-b border-gray-100 hover:border-blue-600 ${activeSection === item.id ? 'text-blue-600 border-blue-600' : ''
                    }`}
                >
                  {item.name}
                </a>
              ))}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleProfileClick}
                    className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium w-full"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;