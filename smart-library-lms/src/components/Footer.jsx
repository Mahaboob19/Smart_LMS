// components/Footer.jsx
import React from 'react';

const Footer = () => {
  const footerLinks = {
    'Library Services': ['Book Search', 'Digital Repository', 'Journal Access', 'Remote Access'],
    'User Roles': ['Student Portal', 'Saff/Faculty', 'Librarian Admin', 'HOD Dashboard'],
    'Quick Links': ['Library Rules', 'New Arrivals', 'Opening Hours', 'FAQs'],
    'About VVIT': ['University Home', 'Library Team', 'Contact Us', 'Location']
  };

  // Team IDs from your abstract
  const teamMembers = [
    '23BQ1A05E3',
    '23BQ1A05H4',
    '23BQ1A05I7',
    '23BQ1A05E6'
  ];

  // SVG Icons
  const BookOpenIcon = () => (
    <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const QRCodeIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  );

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/VVIT_logo.png"
                alt="VVIT Logo"
                className="h-12 w-auto"
                onError={(e) => {
                  // Fallback to text if image doesn't load
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <span className="text-2xl font-bold">
                Smart<span className="text-blue-400">Library</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              A Smart Online Library Management System that digitizes and automates
              library operations. Featuring QR code transactions, automated fine calculation,
              and real-time tracking to replace traditional manual processes.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                <QRCodeIcon />
                <span className="text-sm">QR Code System</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm">Auto Fine Calc</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-4 text-blue-400">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Team Members Section */}
        <div className="mb-12">
          <h3 className="font-bold text-lg mb-6 text-blue-400 border-b border-gray-800 pb-2">
            Project Team Members
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teamMembers.map((id, index) => (
              <div key={id} className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-400 mb-1">Team Member {index + 1}</div>
                <div className="font-mono text-blue-300">{id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info & Copyright */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <LocationIcon />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">VVIT University</div>
                    <div className="text-sm">University Library, CS Department</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <PhoneIcon />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Phone</div>
                    <div className="text-sm">+91 994-941-7887</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <EmailIcon />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-sm">lms.cs@vvitu.ac.in</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-gray-400 text-sm mb-2">
                © 2026 Smart Online Library Management System
              </p>
              <p className="text-gray-500 text-xs">
                Academic Project | Computer Science Department
              </p>
              <div className="mt-4 flex justify-center lg:justify-end space-x-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Project Documentation</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;