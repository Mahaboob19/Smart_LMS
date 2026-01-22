// components/MinimalFooter.jsx
import React from 'react';

const MinimalFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2026 Smart Online Library Management System | VVIT University
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
