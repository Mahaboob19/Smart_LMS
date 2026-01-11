// components/student/StudentSidebar.jsx
import React, { useState, useEffect } from 'react';
import { authAPI } from '../../api/auth';

const StudentSidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'search', icon: '🔍', label: 'Search Books' },
    { id: 'borrowed', icon: '📚', label: 'My Books' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'profile', icon: '👤', label: 'My Profile' },
  ];

  if (!user) return null;

  return (
    <aside className={`fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-30 ${isOpen ? 'w-64' : 'w-0 lg:w-16'}`}>
      <div className={`h-full overflow-y-auto ${isOpen ? 'px-4' : 'px-2'}`}>
        {/* Student Info */}
        <div className={`py-6 border-b border-gray-100 ${!isOpen && 'hidden lg:block'}`}>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            {isOpen && (
              <div>
                <h3 className="font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {user.year} • {user.department}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {user.rollNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-4">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {(isOpen || item.id === 'dashboard') && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {activeTab === item.id && (
                    <span className="ml-auto h-2 w-2 bg-blue-600 rounded-full"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default StudentSidebar;