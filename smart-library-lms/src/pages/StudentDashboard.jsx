
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import StudentHeader from '../components/student/StudentHeader';
// import StudentSidebar from '../components/student/StudentSidebar';
// import QuickStats from '../components/student/QuickStats';
// import RecentActivity from '../components/student/RecentActivity';
// import BorrowedBooks from '../components/student/BorrowedBooks';
// import NewArrivals from '../components/student/NewArrivals';
// import LibraryAnalytics from '../components/student/LibraryAnalytics';
// import UpcomingDueDates from '../components/student/UpcomingDueDates';
// import { authAPI } from '../api/auth';
// import { studentAPI } from '../api/student';

// const StudentDashboard = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check authentication
//     if (!authAPI.isAuthenticated()) {
//       console.log('Not authenticated, redirecting to login');
//       navigate('/login');
//       return;
//     }

//     const user = authAPI.getCurrentUser();
//     console.log('Current user:', user);
    
//     if (user?.userType !== 'student') {
//       console.log('Not a student, redirecting');
//       navigate('/');
//       return;
//     }

//     // Fetch dashboard data
//     fetchDashboardData();
//   }, [navigate]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('Fetching dashboard data...');
      
//       const response = await studentAPI.getDashboard();
//       console.log('Dashboard response:', response);
      
//       if (response.success) {
//         setDashboardData(response.dashboard);
//         // Update user data if returned
//         if (response.user) {
//           localStorage.setItem('user', JSON.stringify(response.user));
//         }
//       } else {
//         setError(response.message || 'Failed to fetch dashboard data');
//       }
//     } catch (err) {
//       console.error('Dashboard fetch error:', err);
//       setError(err.message || 'Failed to load dashboard. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//           </div>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <div className="flex items-center mb-4">
//             <svg className="h-5 w-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p className="text-red-600 font-medium">Error loading dashboard</p>
//           </div>
//           <p className="text-red-600 mb-4">{error}</p>
//           <div className="flex space-x-3">
//             <button
//               onClick={fetchDashboardData}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//             >
//               Go Home
//             </button>
//           </div>
//         </div>
//       );
//     }

//     // Use mock data if no dashboard data
//     const dataToUse = dashboardData || {
//       stats: {
//         totalBooksBorrowed: 0,
//         currentBooks: 0,
//         overdueBooks: 0,
//         currentFine: 0,
//         totalFinePaid: 0
//       },
//       activeBooks: [],
//       upcomingDueDates: [],
//       recentActivity: []
//     };

//     switch(activeTab) {
//       case 'search':
//         return <BookSearch />;
//       case 'borrowed':
//         return <BorrowedBooks />;
//       case 'analytics':
//         return <LibraryAnalytics />;
//       case 'notifications':
//         return <NewArrivals />;
//       default:
//         return (
//           <div className="space-y-6">
//             <QuickStats stats={dataToUse.stats} />
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 space-y-6">
//                 <RecentActivity activities={dataToUse.recentActivity || []} />
//                 <BorrowedBooks 
//                   compact={true} 
//                   books={dataToUse.activeBooks || []} 
//                 />
//               </div>
//               <div className="space-y-6">
//                 <UpcomingDueDates dueDates={dataToUse.upcomingDueDates || []} />
//                 <NewArrivals compact={true} />
//               </div>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <StudentHeader 
//         onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         activeTab={activeTab}
//       />
      
//       <div className="flex">
//         <StudentSidebar 
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           isOpen={isSidebarOpen}
//         />
        
//         <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'}`}>
//           <div className="container mx-auto px-4 py-6">
//             {renderContent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;

// StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentHeader from '../components/student/StudentHeader';
import StudentSidebar from '../components/student/StudentSidebar';
import QuickStats from '../components/student/QuickStats';
import RecentActivity from '../components/student/RecentActivity';
import BorrowedBooks from '../components/student/BorrowedBooks';
import NewArrivals from '../components/student/NewArrivals';
import LibraryAnalytics from '../components/student/LibraryAnalytics';
import UpcomingDueDates from '../components/student/UpcomingDueDates';
import BookSearch from '../components/student/BookSearch'; // Add this import

// Create a simple auth check if you don't have authAPI yet
const checkAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user:', error);
    return null;
  }
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!checkAuth()) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    const user = getCurrentUser();
    console.log('Current user from localStorage:', user);
    
    if (!user || user.userType !== 'student') {
      console.log('Not a student or no user data');
      navigate('/login');
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching dashboard data...');
      
      const token = localStorage.getItem('token');
      console.log('Using token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
      
      // Direct API call for now
      const response = await fetch('http://localhost:5000/api/student/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dashboard response data:', data);
      
      if (data.success) {
        setDashboardData(data.dashboard);
        // Update user data if returned
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your renderContent function remains the same ...

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg className="h-5 w-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 font-medium">Error loading dashboard</p>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    // Use mock data if no dashboard data
    const dataToUse = dashboardData || {
      stats: {
        totalBooksBorrowed: 0,
        currentBooks: 0,
        overdueBooks: 0,
        currentFine: 0,
        totalFinePaid: 0
      },
      activeBooks: [],
      upcomingDueDates: [],
      recentActivity: []
    };

    switch(activeTab) {
      case 'search':
        return <BookSearch />;
      case 'borrowed':
        return <BorrowedBooks />;
      case 'analytics':
        return <LibraryAnalytics />;
      case 'notifications':
        return <NewArrivals />;
      default:
        return (
          <div className="space-y-6">
            <QuickStats stats={dataToUse.stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <RecentActivity activities={dataToUse.recentActivity || []} />
                <BorrowedBooks 
                  compact={true} 
                  books={dataToUse.activeBooks || []} 
                />
              </div>
              <div className="space-y-6">
                <UpcomingDueDates dueDates={dataToUse.upcomingDueDates || []} />
                <NewArrivals compact={true} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
      />
      
      <div className="flex">
        <StudentSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'}`}>
          <div className="container mx-auto px-4 py-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;