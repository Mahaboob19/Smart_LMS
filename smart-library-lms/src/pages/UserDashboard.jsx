// pages/UserDashboard.jsx - Updated with blue
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">U</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">User Dashboard</h1>
                <p className="text-sm text-gray-600">Student/Staff Panel</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to User Panel</h2>
        <p className="text-gray-600">This is the user dashboard.</p>
      </div>
    </div>
  );
};

export default UserDashboard;