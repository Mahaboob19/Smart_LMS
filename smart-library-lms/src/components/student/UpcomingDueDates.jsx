// components/student/UpcomingDueDates.jsx
import React from 'react';

const UpcomingDueDates = () => {
  const upcomingBooks = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      dueDate: '2024-02-15',
      daysLeft: 5,
      status: 'due_soon'
    },
    {
      id: 2,
      title: 'The Pragmatic Programmer',
      dueDate: '2024-02-20',
      daysLeft: 10,
      status: 'due_later'
    },
    {
      id: 3,
      title: 'Database System Concepts',
      dueDate: '2024-02-05',
      daysLeft: -2,
      status: 'overdue'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'overdue': return 'bg-red-100 text-red-600';
      case 'due_soon': return 'bg-amber-100 text-amber-600';
      case 'due_later': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (daysLeft) => {
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft <= 7) return 'Due Soon';
    return 'Due Later';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Upcoming Due Dates</h3>
          <p className="text-gray-600">Books to return soon</p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Set Reminders
        </button>
      </div>

      <div className="space-y-4">
        {upcomingBooks.map(book => {
          const status = book.daysLeft < 0 ? 'overdue' : book.daysLeft <= 7 ? 'due_soon' : 'due_later';
          const statusColor = getStatusColor(status);
          
          return (
            <div key={book.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📘</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{book.title}</h4>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(book.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                  {getStatusText(book.daysLeft)}
                </span>
                <p className={`text-sm mt-1 ${book.daysLeft < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {Math.abs(book.daysLeft)} {book.daysLeft < 0 ? 'days overdue' : 'days left'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm font-medium">
            Request Extension
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
            View All Dates
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingDueDates;