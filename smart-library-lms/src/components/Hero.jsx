// components/Hero.jsx
import React from 'react';

const Hero = () => {
  // SVG Icons
  const ArrowRightIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );

  const BookOpenIcon = () => (
    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const UserGroupIcon = () => (
    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  return (
    <section className="container mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            VVIT University
            <span className="text-blue-600 block">Smart Library</span>
          </h1>
          <p className="text-gray-600 text-lg mt-6 mb-8 max-w-2xl">
            Access thousands of books, journals, and digital resources.
            Manage your borrowings and fines seamlessly with our digital smart system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg flex items-center justify-center gap-2">
              Learn More
              <ArrowRightIcon />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors duration-200 font-medium text-lg">
              Explore Features
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            University ID required for borrowing • 24/7 Digital Access
          </p>
        </div>

        {/* Right Image/Illustration */}
        <div className="md:w-1/2">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-1 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 md:p-8">
                <div className="space-y-4">
                  {/* Mock Dashboard */}
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpenIcon />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-500">Total Books</div>
                      <div className="text-2xl font-bold text-gray-900">12,458</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-500">Active Members</div>
                      <div className="text-2xl font-bold text-gray-900">2,847</div>
                    </div>
                  </div>
                  <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium text-gray-700">Recent Activity</div>
                      <div className="text-xs text-gray-500">Today</div>
                    </div>
                    <div className="space-y-3">
                      {['Book Returned', 'New Member Added', 'Book Reserved'].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                          <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Members Online</div>
                  <div className="font-bold">342</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;