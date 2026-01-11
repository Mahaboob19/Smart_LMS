// components/student/BorrowedBooks.jsx
import React, { useState } from 'react';

const BorrowedBooks = ({ compact = false }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      borrowedDate: '2024-01-15',
      dueDate: '2024-02-15',
      returnDate: null,
      status: 'active',
      fine: 0,
      canRenew: true
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      borrowedDate: '2024-01-10',
      dueDate: '2024-02-10',
      returnDate: '2024-02-05',
      status: 'returned',
      fine: 0,
      canRenew: false
    },
    {
      id: 3,
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      borrowedDate: '2024-01-20',
      dueDate: '2024-02-20',
      returnDate: null,
      status: 'active',
      fine: 0,
      canRenew: true
    },
    {
      id: 4,
      title: 'Database System Concepts',
      author: 'Abraham Silberschatz',
      borrowedDate: '2024-01-05',
      dueDate: '2024-02-05',
      returnDate: null,
      status: 'overdue',
      fine: 50,
      canRenew: false
    }
  ]);

  const handleRenew = (bookId) => {
    alert(`Book ID ${bookId} renewal requested`);
    // In real app, this would call an API
  };

  const handleReturn = (bookId) => {
    alert(`Book ID ${bookId} return initiated`);
    // In real app, this would call an API
  };

  const activeBooks = borrowedBooks.filter(book => book.status === 'active' || book.status === 'overdue');
  const returnedBooks = borrowedBooks.filter(book => book.status === 'returned');

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Borrowed Books</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {activeBooks.slice(0, 3).map(book => (
            <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📘</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{book.title}</h4>
                  <p className="text-xs text-gray-500">Due: {new Date(book.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${book.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                {book.status === 'overdue' ? 'Overdue' : 'Active'}
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
            <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
            <p className="text-gray-600">Manage your borrowed books and check due dates</p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Borrow New Book
            </button>
          </div>
        </div>

        {/* Active Books */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Currently Borrowed ({activeBooks.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Book</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Borrowed Date</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Due Date</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Fine</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeBooks.map(book => (
                  <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📘</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{book.title}</h4>
                          <p className="text-sm text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-900">{new Date(book.borrowedDate).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4">
                      <p className={`font-medium ${book.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(book.dueDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {book.status === 'overdue' ? 'Overdue' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className={`font-medium ${book.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {book.fine > 0 ? `₹${book.fine}` : 'No Fine'}
                      </p>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        {book.canRenew && (
                          <button
                            onClick={() => handleRenew(book.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium hover:bg-blue-200"
                          >
                            Renew
                          </button>
                        )}
                        <button
                          onClick={() => handleReturn(book.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200"
                        >
                          Return
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Returned Books */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-4">Recently Returned</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Book</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Borrowed Date</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Returned Date</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {returnedBooks.map(book => (
                  <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📘</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{book.title}</h4>
                          <p className="text-sm text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-900">{new Date(book.borrowedDate).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-900">{new Date(book.returnDate).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                        Returned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooks;