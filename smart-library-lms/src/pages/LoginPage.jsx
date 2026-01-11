// // pages/LoginPage.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import LoginSelection from '../components/LoginSelection';
// import AdminLogin from '../components/AdminLogin';
// import UserLogin from '../components/UserLogin';

// const LoginPage = () => {
//   const [activeTab, setActiveTab] = useState('selection'); // 'selection', 'admin', 'user'
//   const [loginType, setLoginType] = useState(''); // 'librarian', 'hod', 'student', 'staff'
//   const navigate = useNavigate();

//   const handleBackToSelection = () => {
//     setActiveTab('selection');
//     setLoginType('');
//   };

//   const handleAdminSelect = (type) => {
//     setLoginType(type);
//     setActiveTab('admin');
//   };

//   const handleUserSelect = (type) => {
//     setLoginType(type);
//     setActiveTab('user');
//   };

//   const handleSignupRedirect = () => {
//     navigate('/signup');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
//       <div className="container mx-auto px-6 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//               VVIT University LMS
//             </h1>
//             <p className="text-gray-600">Login to access library services</p>
//           </div>

//           {/* Login Card */}
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             {/* Progress Bar */}
//             <div className="h-1 bg-gray-100">
//               <div className={`h-full ${activeTab === 'selection' ? 'w-1/4' : activeTab === 'admin' ? 'w-2/4' : 'w-3/4'} bg-[#0a3d62] transition-all duration-300`}></div>
//             </div>

//             <div className="p-6 md:p-8">
//               {/* Back Button (when not in selection) */}
//               {activeTab !== 'selection' && (
//                 <button
//                   onClick={handleBackToSelection}
//                   className="flex items-center text-gray-600 hover:text-[#0a3d62] mb-6 transition-colors"
//                 >
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                   Back to Selection
//                 </button>
//               )}

//               {/* Render Active Component */}
//               {activeTab === 'selection' && (
//                 <LoginSelection 
//                   onAdminSelect={handleAdminSelect}
//                   onUserSelect={handleUserSelect}
//                   onSignupRedirect={handleSignupRedirect}
//                 />
//               )}
              
//               {activeTab === 'admin' && (
//                 <AdminLogin loginType={loginType} />
//               )}
              
//               {activeTab === 'user' && (
//                 <UserLogin loginType={loginType} />
//               )}
//             </div>
//           </div>

//           {/* Footer Note */}
//           <div className="text-center mt-8 text-gray-500 text-sm">
//             <p>Having trouble logging in? Contact library support at lms.cs@vvitu.ac.in</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// pages/LoginPage.jsx - Updated with backend integration
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginSelection from '../components/LoginSelection';
import AdminLogin from '../components/AdminLogin';
import UserLogin from '../components/UserLogin';
import { authAPI } from '../api/auth';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('selection');
  const [loginType, setLoginType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      const user = authAPI.getCurrentUser();
      // Redirect based on user type
      switch (user.userType) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'admin':
        case 'librarian':
        case 'hod':
          navigate('/admin-dashboard');
          break;
        case 'staff':
          navigate('/user-dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [navigate]);

  const handleBackToSelection = () => {
    setActiveTab('selection');
    setLoginType('');
    setError('');
  };

  const handleAdminSelect = (type) => {
    setLoginType(type);
    setActiveTab('admin');
  };

  const handleUserSelect = (type) => {
    setLoginType(type);
    setActiveTab('user');
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      let userType;
      switch(loginType) {
        case 'librarian':
          userType = 'librarian';
          break;
        case 'hod':
          userType = 'hod';
          break;
        case 'staff':
          userType = 'staff';
          break;
        case 'student':
          userType = 'student';
          break;
        default:
          userType = 'student';
      }
      
      const response = await authAPI.login(email, password, userType);
      
      if (response.success) {
        // Redirect based on user type
        switch (response.user.userType) {
          case 'student':
            navigate('/student-dashboard');
            break;
          case 'admin':
          case 'librarian':
          case 'hod':
            navigate('/admin-dashboard');
            break;
          case 'staff':
            navigate('/user-dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              VVIT University Library System
            </h1>
            <p className="text-gray-600">Login to access library services</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-100">
              <div className={`h-full ${activeTab === 'selection' ? 'w-1/4' : activeTab === 'admin' ? 'w-2/4' : 'w-3/4'} bg-blue-600 transition-all duration-300`}></div>
            </div>

            <div className="p-6 md:p-8">
              {/* Back Button (when not in selection) */}
              {activeTab !== 'selection' && (
                <button
                  onClick={handleBackToSelection}
                  className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Selection
                </button>
              )}

              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Logging in...</p>
                  </div>
                </div>
              )}

              {/* Render Active Component */}
              {activeTab === 'selection' && (
                <LoginSelection 
                  onAdminSelect={handleAdminSelect}
                  onUserSelect={handleUserSelect}
                  onSignupRedirect={handleSignupRedirect}
                />
              )}
              
              {activeTab === 'admin' && (
                <AdminLogin 
                  loginType={loginType} 
                  onLogin={handleLogin}
                  loading={loading}
                />
              )}
              
              {activeTab === 'user' && (
                <UserLogin 
                  loginType={loginType} 
                  onLogin={handleLogin}
                  loading={loading}
                />
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Having trouble logging in? Contact library support at library@vvit.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;