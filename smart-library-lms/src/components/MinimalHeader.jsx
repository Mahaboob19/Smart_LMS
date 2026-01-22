// components/MinimalHeader.jsx
import React from 'react';

const MinimalHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img
                src="/VVIT_logo.png"
                alt="VVIT Logo"
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback-minimal');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-fallback-minimal" className="hidden items-center">
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
        </div>
      </nav>
    </header>
  );
};

export default MinimalHeader;
