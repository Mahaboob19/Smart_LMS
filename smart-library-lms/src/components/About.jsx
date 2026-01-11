// components/About.jsx
import React from 'react';

const About = () => {
  const teamMembers = [
    { id: '23BQ1A05E3', name: 'Team Member 1', role: 'Designer' },
    { id: '23BQ1A05H4', name: 'Team Member 2', role: 'Developer' },
    { id: '23BQ1A05I7', name: 'Team Member 3', role: 'Backend Developer' },
    { id: '23BQ1A05E6', name: 'Team Member 4', role: 'Frontend Developer' },
  ];

  return (
    <section id="about" className="container mx-auto px-6 py-16 bg-gray-50 rounded-3xl my-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          About Our Project
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          The Smart Online Library Management System addresses the challenges of traditional 
          library systems by providing a comprehensive digital solution that automates 
          operations and enhances user experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Problem Statement */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement</h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Traditional library systems suffer from manual management challenges including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Time-consuming book tracking and record maintenance</li>
              <li>High probability of data loss and duplication</li>
              <li>Inefficient manual fine calculation</li>
              <li>Difficulty in managing growing collections and users</li>
              <li>Lack of real-time availability information</li>
            </ul>
          </div>
        </div>

        {/* Solution */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Our system provides a smart, automated solution featuring:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>QR code-based book transactions</li>
              <li>Automatic fine calculation and notifications</li>
              <li>Real-time book availability tracking</li>
              <li>Dual role management (Admin & Members)</li>
              <li>Digital catalog with advanced search</li>
              <li>Book review and rating system</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Project Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h4 className="font-bold text-gray-900">{member.name}</h4>
              <p className="text-gray-600 text-sm mb-2">{member.role}</p>
              <p className="text-gray-500 text-xs">{member.id}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;