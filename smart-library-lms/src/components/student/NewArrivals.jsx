// components/student/NewArrivals.jsx
import React from 'react';

const NewArrivals = ({ compact = false }) => {
  const newBooks = [
    {
      id: 1,
      title: 'Python Crash Course',
      author: 'Eric Matthes',
      category: 'Programming',
      addedDate: '2024-01-25',
      available: true
    },
    {
      id: 2,
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell',
      category: 'AI',
      addedDate: '2024-01-24',
      available: true
    },
    {
      id: 3,
      title: 'The Linux Command Line',
      author: 'William Shotts',
      category: 'Operating Systems',
      addedDate: '2024-01-22',
      available: false
    },
    {
      id: 4,
      title: 'Deep Learning',
      author: 'Ian Goodfellow',
      category: 'Machine Learning',
      addedDate: '2024-01-20',
      available: true
    }
  ];

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">New Arrivals</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {newBooks.slice(0, 3).map(book => (
            <div key={book.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📘</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{book.title}</h4>
                <p className="text-xs text-gray-500">Added {new Date(book.addedDate).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${book.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {book.available ? 'Available' : 'Reserved'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-600">Recently added books to the library</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Subscribe to Notifications
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newBooks.map(book => (
            <div key={book.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📘</span>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  {book.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${book.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {book.available ? 'Available' : 'Reserved'}
                </span>
              </div>
              
              <p className="text-xs text-gray-500">
                Added on {new Date(book.addedDate).toLocaleDateString()}
              </p>
              
              <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Reserve Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;