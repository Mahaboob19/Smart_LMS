// pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MinimalFooter from '../components/MinimalFooter';
import { authAPI } from '../api/auth';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  /* Navigation Arrays for Different Roles */
  const studentNavItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Books', id: 'books' },
    { name: 'Recommendations', id: 'recommendations' },
    { name: 'My Analytics', id: 'analytics' }
  ];

  const staffNavItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Books', id: 'books' },
    { name: 'My Requests', id: 'my-requests' },
    { name: 'Recommendations', id: 'recommendations' }
  ];

  const librarianNavItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Books', id: 'books' },
    { name: 'Transactions', id: 'transactions' },
    { name: 'Analytics', id: 'analytics' },
    { name: 'Messages', id: 'messages' }
  ];

  const hodNavItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Recommendations', id: 'recommendations' },
    { name: 'Analytics', id: 'analytics' },
    { name: 'Requests', id: 'requests' }, // For approvals
    { name: 'Messages', id: 'messages' }
  ];

  const principalNavItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Analytics', id: 'analytics' },
    { name: 'Requests', id: 'requests' },
    { name: 'Messages', id: 'messages' }
  ];

  const adminNavItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Users', id: 'users' },
    { name: 'Books', id: 'books' },
    { name: 'Transactions', id: 'transactions' },
    { name: 'Analytics', id: 'analytics' },
    { name: 'Settings', id: 'settings' }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      if (!authAPI.isAuthenticated()) {
        navigate('/login');
        return;
      }

      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        // Try to get user from server
        const result = await authAPI.getMe();
        if (result.success) {
          setUser(result.data.user);
        } else {
          navigate('/login');
        }
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  /* Helper to get current nav items based on role */
  const getNavItems = () => {
    switch (user.userType) {
      case 'student': return studentNavItems;
      case 'staff': return staffNavItems;
      case 'librarian': return librarianNavItems;
      case 'hod': return hodNavItems;
      case 'principal': return principalNavItems;
      case 'admin': return adminNavItems;
      default: return studentNavItems;
    }
  };

  const getUserTypeLabel = () => {
    const typeMap = {
      student: 'Student',
      staff: 'Staff',
      admin: 'Administrator',
      librarian: 'Librarian',
      hod: 'Head of Department',
      principal: 'Principal'
    };
    return typeMap[user.userType] || user.userType;
  };

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-gray-600">
              {getUserTypeLabel()} Dashboard
            </p>
          </div>
          <div className="text-right">
            {(user.userType === 'student' || user.userType === 'staff') && (
              <>
                <div className="text-sm text-gray-500">Library Card</div>
                <div className="text-lg font-semibold text-blue-600">
                  {user.libraryCardNumber || 'N/A'}
                </div>
              </>
            )}
            {/* Show something else for admins if needed, or nothing */}
            {['admin', 'librarian', 'principal', 'hod'].includes(user.userType) && (
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
                {getUserTypeLabel()} Access
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <span className="ml-2 font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2 font-medium text-gray-900">{user.email}</span>
            </div>
            {user.rollNumber && (
              <div>
                <span className="text-gray-500">Roll Number:</span>
                <span className="ml-2 font-medium text-gray-900">{user.rollNumber}</span>
              </div>
            )}
            {user.staffId && (
              <div>
                <span className="text-gray-500">Staff ID:</span>
                <span className="ml-2 font-medium text-gray-900">{user.staffId}</span>
              </div>
            )}
            {user.department && (
              <div>
                <span className="text-gray-500">Department:</span>
                <span className="ml-2 font-medium text-gray-900">{user.department}</span>
              </div>
            )}
            {user.year && (
              <div>
                <span className="text-gray-500">Year:</span>
                <span className="ml-2 font-medium text-gray-900">{user.year}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Type</h3>
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {getUserTypeLabel()}
            </div>
            <div className="text-sm text-gray-500">
              {user.userType === 'student' || user.userType === 'staff'
                ? 'Regular User'
                : 'Administrative Access'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="space-y-2">
            {(user.userType === 'student' || user.userType === 'staff' || user.userType === 'librarian' || user.userType === 'admin') && (
              <button
                onClick={() => setActiveSection('books')}
                className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Browse Books
              </button>
            )}

            {(user.userType === 'admin' || user.userType === 'principal') && (
              <button
                onClick={() => navigate('/admin/management')}
                className="w-full text-left px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
              >
                Admin Management
              </button>
            )}

            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">
          Welcome to your personalized dashboard. Use the navigation menu to access different sections.
        </p>
      </div>
    </div>
  );

  const renderBooks = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Books Library</h2>
        <p className="text-gray-600">Browse and search for books here.</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Book browsing interface coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended For You</h2>
        <p className="text-gray-600">Books tailored to your interests and course.</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Recommendations engine coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Stats</h2>
        <p className="text-gray-600">
          {['student', 'staff'].includes(user.userType)
            ? "Track your reading habits and library activity."
            : "View library usage statistics and reports."}
        </p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Analytics charts coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderMyRequests = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Requests</h2>
        <p className="text-gray-600">Status of your book requests.</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Requests list coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Requests</h2>
        <p className="text-gray-600">Approve or reject book requests from students/staff.</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Request approval interface coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Transactions</h2>
        <p className="text-gray-600">View and manage book issues and returns.</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Transaction log coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
        <p className="text-gray-600">Calculated fines, notifications, and communications.</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Messages interface coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
        <p className="text-gray-600">Manage students, staff, and faculty.</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">User management grid coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">System Settings</h2>
        <p className="text-gray-600">Configure global library settings.</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Settings panel coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'books':
        return renderBooks();
      case 'recommendations':
        return renderRecommendations();
      case 'analytics':
        return renderAnalytics();
      case 'my-requests':
        return renderMyRequests();
      case 'requests':
        return renderRequests();
      case 'transactions':
        return renderTransactions();
      case 'messages':
        return renderMessages();
      case 'users':
        return renderUsers();
      case 'settings':
        return renderSettings();
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Header
        customNavItems={getNavItems()}
        activeSection={activeSection}
        onNavClick={setActiveSection}
      />

      <div className="container mx-auto px-6 py-16">
        {renderContent()}
      </div>

      <MinimalFooter />
    </div>
  );
};

export default DashboardPage;
