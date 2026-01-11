// components/LoginSelection.jsx
import React from 'react';

const LoginSelection = ({ onAdminSelect, onUserSelect, onSignupRedirect }) => {
  const adminOptions = [
    {
      id: 'librarian',
      title: 'Librarian Login',
      description: 'Access library management dashboard',
      icon: '📚',
      color: 'bg-blue-50 border-blue-100 hover:border-blue-300 hover:bg-blue-100'
    },
    {
      id: 'hod',
      title: 'HOD/Principal Login',
      description: 'Access administrative dashboard',
      icon: '👨‍🏫',
      color: 'bg-blue-50 border-blue-100 hover:border-blue-300 hover:bg-blue-100'
    }
  ];

  const userOptions = [
    {
      id: 'student',
      title: 'Student Login',
      description: 'Access student library portal',
      icon: '🎓',
      color: 'bg-blue-50 border-blue-100 hover:border-blue-300 hover:bg-blue-100'
    },
    {
      id: 'staff',
      title: 'Staff Login',
      description: 'Access staff library portal',
      icon: '👨‍💼',
      color: 'bg-blue-50 border-blue-100 hover:border-blue-300 hover:bg-blue-100'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Select Login Type
      </h2>

      <div className="space-y-8">
        {/* Admin Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className="h-8 w-1 bg-blue-600 rounded-r"></div>
            <h3 className="text-xl font-bold text-gray-900 ml-3">Administrator Access</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onAdminSelect(option.id)}
                className={`${option.color} p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{option.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className="h-8 w-1 bg-blue-500 rounded-r"></div>
            <h3 className="text-xl font-bold text-gray-900 ml-3">User Access</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onUserSelect(option.id)}
                className={`${option.color} p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{option.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Signup Option */}
        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-gray-600 mb-4">New to VVIT Library System?</p>
          <button
            onClick={onSignupRedirect}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Create New Account
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;