// // components/student/QuickStats.jsx
// import React from 'react';

// const QuickStats = () => {
//   const stats = [
//     {
//       title: 'Books Borrowed',
//       value: '5',
//       change: '+2 this month',
//       icon: '📚',
//       color: 'bg-blue-100 text-blue-600'
//     },
//     {
//       title: 'Pending Returns',
//       value: '2',
//       change: 'Due in 3 days',
//       icon: '⏰',
//       color: 'bg-amber-100 text-amber-600'
//     },
//     {
//       title: 'Books Read',
//       value: '24',
//       change: '+4 this semester',
//       icon: '📖',
//       color: 'bg-emerald-100 text-emerald-600'
//     },
//     {
//       title: 'Fine Due',
//       value: '₹0',
//       change: 'No pending fines',
//       icon: '💰',
//       color: 'bg-green-100 text-green-600'
//     }
//   ];

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Welcome back, John!</h2>
//           <p className="text-gray-600">Here's your library activity summary</p>
//         </div>
//         <div className="text-sm text-gray-500">
//           Last updated: Today, 10:30 AM
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-4">
//               <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
//                 <span className="text-2xl">{stat.icon}</span>
//               </div>
//               <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
//             </div>
//             <h3 className="font-medium text-gray-900 mb-1">{stat.title}</h3>
//             <p className="text-sm text-gray-600">{stat.change}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuickStats;


// components/student/QuickStats.jsx
import React, { useState, useEffect } from 'react';
import { authAPI } from '../../api/auth';

const QuickStats = ({ stats }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) return null;

  const defaultStats = [
    {
      title: 'Books Borrowed',
      value: stats?.totalBooksBorrowed || '0',
      change: 'Start borrowing!',
      icon: '📚',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Pending Returns',
      value: stats?.currentBooks || '0',
      change: 'No pending returns',
      icon: '⏰',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      title: 'Fine Due',
      value: `₹${stats?.currentFine || '0'}`,
      change: 'No fines',
      icon: '💰',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Library Card',
      value: user.libraryCardNumber?.slice(-4) || 'N/A',
      change: 'Active',
      icon: '💳',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-600">
            {user.year} • {user.department} • {user.rollNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {defaultStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{stat.title}</h3>
            <p className="text-sm text-gray-600">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;