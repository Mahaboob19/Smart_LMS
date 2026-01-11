// components/student/RecentActivity.jsx
import React from 'react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'borrow',
      title: 'Borrowed "Data Structures and Algorithms"',
      time: '2 hours ago',
      icon: '📚',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'return',
      title: 'Returned "Clean Code" book',
      time: '1 day ago',
      icon: '✅',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      type: 'renew',
      title: 'Renewed "Introduction to Algorithms"',
      time: '3 days ago',
      icon: '🔄',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      id: 4,
      type: 'reserve',
      title: 'Reserved "Computer Networks"',
      time: '5 days ago',
      icon: '📌',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 5,
      type: 'fine',
      title: 'Paid overdue fine of ₹50',
      time: '1 week ago',
      icon: '💰',
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
          <p className="text-gray-600">Your library transactions and activities</p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`${activity.color} h-10 w-10 rounded-lg flex items-center justify-center`}>
              <span className="text-lg">{activity.icon}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;