// pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import Header from '../components/Header';
import MinimalFooter from '../components/MinimalFooter';
import { authAPI } from '../services/auth';
import { librarianAPI } from '../services/librarian';
import { hodAPI } from '../services/hod';
import { studentAPI } from '../services/student';
const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [generatedQRCodes, setGeneratedQRCodes] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    department: '',
    totalCopies: '',
    description: ''
  });

  // Transactions State
  const [showIssueBookForm, setShowIssueBookForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // New state for fetched users
  const [newTransaction, setNewTransaction] = useState({
    qrCode: '',
    userIdentifier: '',
    issueDays: 15 // Default 15 days
  });

  // Analytics & Messages State
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipientRole: 'principal',
    subject: '',
    content: ''
  });

  // HOD State
  const [hodAnalyticsStats, setHodAnalyticsStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showAddRecommendationForm, setShowAddRecommendationForm] = useState(false);
  const [showEditBookForm, setShowEditBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [newRecommendation, setNewRecommendation] = useState({
    title: '',
    author: '',
    description: ''
  });
  const [bookRequests, setBookRequests] = useState([]);

  // Student State
  const [studentAnalyticsStats, setStudentAnalyticsStats] = useState(null);
  const [showRequestBookModal, setShowRequestBookModal] = useState(false);
  const [selectedBookForRequest, setSelectedBookForRequest] = useState(null);
  const [requestReason, setRequestReason] = useState('');

  /* Navigation Arrays for Different Roles */
  const studentNavItems = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Books', id: 'books' },
    { name: 'My Requests', id: 'my-requests' },
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

  useEffect(() => {
    if (user?.userType === 'librarian') {
      if (activeSection === 'dashboard' || activeSection === 'analytics') {
        fetchAnalytics();
      }
      if (activeSection === 'books') {
        fetchBooks();
      } else if (activeSection === 'transactions') {
        fetchTransactions();
      } else if (activeSection === 'messages') {
        fetchMessages();
      }
    } else if (user?.userType === 'hod') {
      if (activeSection === 'dashboard' || activeSection === 'analytics') {
        fetchHodAnalytics();
      }
      if (activeSection === 'recommendations') {
        fetchRecommendations();
      } else if (activeSection === 'requests') {
        fetchBookRequests();
      } else if (activeSection === 'messages') {
        fetchMessages();
      }
    } else if (user?.userType === 'student') {
      if (activeSection === 'dashboard' || activeSection === 'analytics') {
        fetchStudentAnalytics();
      }
      if (activeSection === 'books') {
        fetchStudentBooks();
      } else if (activeSection === 'recommendations') {
        fetchStudentRecommendations();
      } else if (activeSection === 'my-requests') {
        fetchStudentRequests();
      }
    }
  }, [activeSection, searchQuery, user]);

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

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await librarianAPI.addBook({
        ...newBook,
        totalCopies: parseInt(newBook.totalCopies)
      });
      if (response.success) {
        alert('Book added successfully!');
        setNewBook({ title: '', author: '', department: '', totalCopies: '', description: '' });
        setShowAddBookForm(false);
        fetchBooks(); // Refresh books list
        fetchAnalytics(); // Refresh analytics
        if (response.book && response.book.qrCodes) {
            setGeneratedQRCodes({ title: response.book.title, codes: response.book.qrCodes });
        }
      } else {
        alert(response.message || 'Failed to add book');
      }
    } catch (error) {
      alert('An error occurred while adding the book');
    }
  };

  const handleEditBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await librarianAPI.updateBook(editingBook._id, {
        title: editingBook.title,
        author: editingBook.author,
        totalCopies: parseInt(editingBook.totalCopies),
        description: editingBook.description
      });
      if (response.success) {
        alert('Book updated successfully!');
        setEditingBook(null);
        setShowEditBookForm(false);
        fetchBooks(); // Refresh books list
        fetchAnalytics(); // Refresh analytics
        if (response.book && response.book.qrCodes && parseInt(editingBook.totalCopies) > editingBook.originalCopies) {
            setGeneratedQRCodes({ title: response.book.title, codes: response.book.qrCodes });
        }
      } else {
        alert(response.message || 'Failed to update book');
      }
    } catch (error) {
      alert('An error occurred while updating the book');
    }
  };

  const handleDeleteBook = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      const response = await librarianAPI.deleteBook(id);
      if (response.success) {
        alert('Book deleted successfully!');
        fetchBooks(); // Auto-refresh table
        fetchAnalytics(); // Auto-refresh metrics
      } else {
        alert(response.message || 'Failed to delete book');
      }
    } catch (error) {
      alert('An error occurred while deleting the book');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await librarianAPI.getBooks(searchQuery);
      if (response.success) {
        setBooks(response.books);
      }
    } catch (error) {
      console.error('Failed to fetch books', error);
    }
  };


  const fetchTransactions = async () => {
    try {
      const response = await librarianAPI.getTransactions();
      if (response.success) {
        setTransactions(response.transactions);
      }
      
      // Fetch users for the dropdown when entering transactions view
      if (allUsers.length === 0) {
        const usersResponse = await librarianAPI.getUsers();
        if (usersResponse.success) {
          setAllUsers(usersResponse.users);
        }
      }
    } catch (error) {
      console.error('Failed to fetch transactions or users', error);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      // Calculate dueDate based on issueDays
      const dueDateStr = new Date(Date.now() + newTransaction.issueDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const payload = {
        qrCode: newTransaction.qrCode,
        userIdentifier: newTransaction.userIdentifier,
        dueDate: dueDateStr
      };

      const response = await librarianAPI.issueBook(payload);
      if (response.success) {
        alert('Book issued successfully!');
        setNewTransaction({ qrCode: '', userIdentifier: '', issueDays: 15 });
        setShowIssueBookForm(false);
        fetchTransactions();
      } else {
        alert(response.message || 'Failed to issue book');
      }
    } catch (error) {
      alert('An error occurred while issuing the book');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await librarianAPI.getAnalytics();
      if (response.success) {
        setAnalyticsStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await librarianAPI.getMessages();
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const result = await hodAPI.sendMessage(newMessage);
      if (result.success) {
        alert('Message sent successfully!');
        setShowMessageForm(false);
        setNewMessage({ recipientRole: 'principal', subject: '', content: '' });
        fetchMessages();
      } else {
        alert(result.message || 'Error sending message');
      }
    } catch (error) {
      alert('An error occurred while sending the message');
    }
  };

  const handleRequestBook = async (e) => {
    e.preventDefault();
    if (!selectedBookForRequest) return;

    const result = await studentAPI.requestBook(selectedBookForRequest._id, requestReason);
    if (result.success) {
      alert('Book request submitted successfully!');
      setShowRequestBookModal(false);
      setSelectedBookForRequest(null);
      setRequestReason('');
    } else {
      alert(result.message || 'Error submitting book request');
    }
  };

  const fetchHodAnalytics = async () => {
    try {
      const response = await hodAPI.getAnalytics();
      if (response.success) {
        setHodAnalyticsStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to fetch HOD analytics', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await hodAPI.getRecommendations();
      if (response.success) {
        setRecommendations(response.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    }
  };

  const handleAddRecommendation = async (e) => {
    e.preventDefault();
    try {
      const response = await hodAPI.addRecommendation(newRecommendation);
      if (response.success) {
        alert('Recommendation added successfully!');
        setNewRecommendation({ title: '', author: '', description: '' });
        setShowAddRecommendationForm(false);
        fetchRecommendations();
      } else {
        alert(response.message || 'Failed to add recommendation');
      }
    } catch (error) {
      alert('An error occurred while adding the recommendation');
    }
  };

  const fetchBookRequests = async () => {
    try {
      const response = await hodAPI.getRequests();
      if (response.success) {
        setBookRequests(response.requests);
      }
    } catch (error) {
      console.error('Failed to fetch book requests', error);
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      const response = await hodAPI.updateRequestStatus(requestId, status);
      if (response.success) {
        alert(`Request ${status.toLowerCase()} successfully!`);
        fetchBookRequests();
      } else {
        alert(response.message || 'Failed to update request');
      }
    } catch (error) {
      alert('An error occurred while updating the request');
    }
  };

  const fetchStudentAnalytics = async () => {
    try {
      const response = await studentAPI.getAnalytics();
      if (response.success) {
        setStudentAnalyticsStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to fetch student analytics', error);
    }
  };

  const fetchStudentBooks = async () => {
    try {
      const response = await studentAPI.getBooks(searchQuery);
      if (response.success) {
        setBooks(response.books);
      }
    } catch (error) {
      console.error('Failed to fetch student books', error);
    }
  };

  const fetchStudentRecommendations = async () => {
    try {
      const response = await studentAPI.getRecommendations();
      if (response.success) {
        setRecommendations(response.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch student recommendations', error);
    }
  };

  const fetchStudentRequests = async () => {
    try {
      const response = await studentAPI.getRequests();
      if (response.success) {
        setBookRequests(response.requests);
      }
    } catch (error) {
      console.error('Failed to fetch student requests', error);
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

  const renderDashboard = () => {
    if (user.userType === 'student') {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Student Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Currently Issued</h4>
                <span className="text-3xl font-bold text-gray-900">{studentAnalyticsStats?.currentlyIssued || 0}</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Overdue Books</h4>
                <span className="text-3xl font-bold text-red-600">{studentAnalyticsStats?.overdue || 0}</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Fine</h4>
                <span className="text-3xl font-bold text-gray-900">${studentAnalyticsStats?.totalFine || 0}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div onClick={() => setActiveSection('books')} className="bg-gray-50 rounded-lg p-6 border border-gray-100 cursor-pointer hover:shadow-sm transition-shadow">
                <h4 className="text-lg font-medium text-gray-900 mb-1">Browse Books</h4>
                <p className="text-gray-500 text-sm">Search and browse available books</p>
              </div>
              <div onClick={() => setActiveSection('recommendations')} className="bg-gray-50 rounded-lg p-6 border border-gray-100 cursor-pointer hover:shadow-sm transition-shadow">
                <h4 className="text-lg font-medium text-gray-900 mb-1">Recommendations</h4>
                <p className="text-gray-500 text-sm">View recommended books</p>
              </div>
              <div onClick={() => setActiveSection('analytics')} className="bg-gray-50 rounded-lg p-6 border border-gray-100 cursor-pointer hover:shadow-sm transition-shadow">
                <h4 className="text-lg font-medium text-gray-900 mb-1">My Analytics</h4>
                <p className="text-gray-500 text-sm">View your library usage statistics</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
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

        {/* Librarian Dashboard Specific Layout */}
        {user.userType === 'librarian' && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Books */}
              <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-start border border-gray-200">
                <div className="flex items-center space-x-2 text-gray-500 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  <span className="text-sm font-medium">Total Books</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{analyticsStats?.totalBooks || 0}</span>
              </div>

              {/* Issued Books */}
              <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-start border border-gray-200">
                <div className="flex items-center space-x-2 text-gray-500 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <span className="text-sm font-medium">Issued Books</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{analyticsStats?.totalIssuesCount || 0}</span>
              </div>

              {/* Student Issues */}
              <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-start border border-gray-200">
                <div className="flex items-center space-x-2 text-gray-500 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  <span className="text-sm font-medium">Student Issues</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{analyticsStats?.studentIssuesCount || 0}</span>
              </div>

              {/* Staff Issues */}
              <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-start border border-gray-200">
                <div className="flex items-center space-x-2 text-gray-500 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span className="text-sm font-medium">Staff Issues</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{analyticsStats?.staffIssuesCount || 0}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Manage Books Action */}
              <div onClick={() => setActiveSection('books')} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Manage Books</h4>
                <p className="text-gray-500 text-sm">Add, update, and manage library books</p>
              </div>

              {/* Transactions Action */}
              <div onClick={() => setActiveSection('transactions')} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Transactions</h4>
                <p className="text-gray-500 text-sm">Issue and return books</p>
              </div>

              {/* Analytics Action */}
              <div onClick={() => setActiveSection('analytics')} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Analytics</h4>
                <p className="text-gray-500 text-sm">View library usage statistics</p>
              </div>
            </div>
          </div>
        )}

        {/* HOD Dashboard Specific Layout */}
        {user.userType === 'hod' && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Department Students</h4>
                <span className="text-3xl font-bold text-gray-900">{hodAnalyticsStats?.studentCount || 0}</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h4>
                <span className="text-3xl font-bold text-gray-900">{hodAnalyticsStats?.totalTransactions || 0}</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Pending Requests</h4>
                <span className="text-3xl font-bold text-gray-900">{bookRequests?.filter(r => r.status === 'Pending').length || 0}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div onClick={() => setActiveSection('recommendations')} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Recommendations</h4>
                <p className="text-gray-500 text-sm">Recommend books for department students</p>
              </div>
              <div onClick={() => setActiveSection('analytics')} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Analytics</h4>
                <p className="text-gray-500 text-sm">View department analytics</p>
              </div>
              <div onClick={() => setActiveSection('requests')} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Staff Requests</h4>
                <p className="text-gray-500 text-sm">Approve staff book requests</p>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for future features for other roles */}
        {!['librarian', 'hod', 'student'].includes(user.userType) && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
            <p className="text-gray-600">
              Welcome to your personalized dashboard. Use the navigation menu to access different sections.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderBooks = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        {!showAddBookForm && !showEditBookForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {user.userType === 'student' ? 'Browse Books' : 'Books Management'}
              </h3>
              {user.userType !== 'student' && (
                <button
                  onClick={() => setShowAddBookForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Book
                </button>
              )}
            </div>
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={user.userType === 'student' ? 'Search books by title, author, or ISBN...' : 'Search books by title...'}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Available / Total</th>
                    {['student', 'admin', 'librarian'].includes(user.userType) && (
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.length > 0 ? (
                    books.map((book) => (
                      <tr key={book._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{book.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {book.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <span className={`${book.availableCopies === 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {book.availableCopies}
                          </span>
                          <span className="text-gray-500"> / {book.totalCopies}</span>
                        </td>
                        {['student', 'admin', 'librarian'].includes(user.userType) && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {user.userType === 'student' ? (
                              <button
                                onClick={() => {
                                  setSelectedBookForRequest(book);
                                  setShowRequestBookModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors"
                              >
                                Request
                              </button>
                            ) : (
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingBook({
                                      ...book,
                                      originalCopies: book.totalCopies
                                    });
                                    setShowEditBookForm(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors"
                                  title="Edit Book"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteBook(book._id, book.title)}
                                  className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors"
                                  title="Delete Book"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                        No books found. Try adjusting your search or add a new book.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : showEditBookForm && editingBook ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Edit Book: {editingBook.title}</h3>
            <form className="space-y-4" onSubmit={handleEditBookSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingBook.title}
                    onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Book Title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={editingBook.author}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Author Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={editingBook.department}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none"
                    required
                  >
                    <option value={editingBook.department}>{editingBook.department}</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Department cannot be changed as QR codes are linked to it.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min={editingBook.originalCopies}
                    value={editingBook.totalCopies}
                    onChange={(e) => setEditingBook({ ...editingBook, totalCopies: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of copies"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">You can only increase total copies. Decreasing is not allowed.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Book description..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditBookForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Add New Book</h3>
            <form className="space-y-4" onSubmit={handleAddBook}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Book Title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Author Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newBook.department}
                    onChange={(e) => setNewBook({ ...newBook, department: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={newBook.totalCopies}
                    onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of copies"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Book description..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBookForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Request Book Modal */}
        {showRequestBookModal && selectedBookForRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 relative">
              <button
                onClick={() => {
                  setShowRequestBookModal(false);
                  setSelectedBookForRequest(null);
                  setRequestReason('');
                }}
                className="absolute p-2 top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Request Book</h3>
              <p className="text-gray-500 text-sm mb-6">
                You are requesting <span className="font-semibold text-gray-800">{selectedBookForRequest.title}</span>.
              </p>

              <form onSubmit={handleRequestBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for request</label>
                  <textarea
                    rows="3"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Why do you need this book?"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestBookModal(false);
                      setSelectedBookForRequest(null);
                      setRequestReason('');
                    }}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Codes Modal */}
        {generatedQRCodes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setGeneratedQRCodes(null)}
                className="absolute p-2 top-4 right-4 text-gray-400 hover:text-gray-600 no-print"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-2 no-print">QR Codes for {generatedQRCodes.title}</h3>
              <p className="text-gray-500 text-sm mb-6 no-print">
                These are the unique QR codes for each copy of the book. Print them now to attach to the physical books.
              </p>

              <div id="printable-qr-codes" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4 bg-white">
                {generatedQRCodes.codes.map((code, index) => (
                  <div key={index} className="flex flex-col items-center p-4 border rounded-lg page-break-inside-avoid shadow-sm qr-item" style={{ width: '180px' }}>
                    <QRCode value={code} size={120} />
                    <p className="mt-3 font-mono text-sm font-semibold text-center">{code}</p>
                    <p className="text-xs text-gray-500 text-center mt-1 truncate w-full" title={generatedQRCodes.title}>{generatedQRCodes.title}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t no-print">
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank', 'width=800,height=600');
                    const content = document.getElementById('printable-qr-codes').innerHTML;
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Print QR Codes - ${generatedQRCodes.title}</title>
                          <style>
                            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
                            .grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: flex-start; }
                            .qr-item { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; width: 160px; page-break-inside: avoid; }
                            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 13px; font-weight: 600; margin-top: 12px; margin-bottom: 0; text-align: center; }
                            .text-xs { font-size: 11px; color: #6b7280; margin-top: 4px; margin-bottom: 0; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
                            svg { width: 120px; height: 120px; display: block; }
                          </style>
                        </head>
                        <body>
                          <h2 style="margin-bottom: 20px; color: #111827;">QR Codes for: ${generatedQRCodes.title}</h2>
                          <div class="grid">
                            ${content}
                          </div>
                          <script>
                            window.onload = function() {
                              setTimeout(function() {
                                window.print();
                                window.close();
                              }, 250);
                            };
                          </script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  Print to PDF
                </button>
                <button
                  onClick={() => setGeneratedQRCodes(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );


  const renderRecommendations = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        {!showAddRecommendationForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {user.userType === 'student' ? 'Recommended Books' : 'Book Recommendations'}
              </h3>
              {user.userType === 'hod' && (
                <button
                  onClick={() => setShowAddRecommendationForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Recommendation
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recommendations.length > 0 ? (
                    recommendations.map((rec) => (
                      <tr key={rec._id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{rec.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{rec.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{rec.description || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{rec.recommendedBy?.firstName} {rec.recommendedBy?.lastName}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50 rounded-lg mt-4">
                        {user.userType === 'student' ? 'No recommendations available' : 'No recommendations found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Add Recommendation</h3>
            <form className="space-y-4" onSubmit={handleAddRecommendation}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                  <input
                    type="text"
                    value={newRecommendation.title}
                    onChange={(e) => setNewRecommendation({ ...newRecommendation, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={newRecommendation.author}
                    onChange={(e) => setNewRecommendation({ ...newRecommendation, author: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  rows="3"
                  value={newRecommendation.description}
                  onChange={(e) => setNewRecommendation({ ...newRecommendation, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRecommendationForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Add Recommendation
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => {
    if (user.userType === 'student') {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">My Library Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Books issued</h4>
                <span className="text-3xl font-bold text-gray-900">{studentAnalyticsStats?.totalIssued || 0}</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Currently Issued</h4>
                <span className="text-3xl font-bold text-gray-900">{studentAnalyticsStats?.currentlyIssued || 0}</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Overdue</h4>
                <span className="text-3xl font-bold text-red-600">{studentAnalyticsStats?.overdue || 0}</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Fine</h4>
                <span className="text-3xl font-bold text-gray-900">${studentAnalyticsStats?.totalFine || 0}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (user.userType === 'hod') {
      if (!hodAnalyticsStats) return <div className="text-center py-10">Loading analytics...</div>;
      return (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Department Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Department</h4>
                <span className="text-xl font-bold text-gray-900">{hodAnalyticsStats.department}</span>
              </div>
              <div className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Students</h4>
                <span className="text-xl font-bold text-gray-900">{hodAnalyticsStats.studentCount}</span>
              </div>
              <div className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h4>
                <span className="text-xl font-bold text-gray-900">{hodAnalyticsStats.totalTransactions}</span>
              </div>
              <div className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Active Issues</h4>
                <span className="text-xl font-bold text-gray-900">{hodAnalyticsStats.activeIssues}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!analyticsStats) return <div className="text-center py-10">Loading analytics...</div>;

    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Overview</h2>
          <p className="text-gray-600 mb-8">View library and user statistics.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-6 rounded-lg text-center border border-blue-100">
              <div className="text-3xl font-bold text-blue-600">{analyticsStats.totalBooks || 0}</div>
              <div className="text-sm text-gray-600 mt-2">Total Unique Books</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center border border-green-100">
              <div className="text-3xl font-bold text-green-600">{analyticsStats.totalIssuesCount || 0}</div>
              <div className="text-sm text-gray-600 mt-2">Currently Issued</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center border border-purple-100">
              <div className="text-3xl font-bold text-purple-600">{analyticsStats.studentIssuesCount || 0}</div>
              <div className="text-sm text-gray-600 mt-2">Student Issues</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg text-center border border-orange-100">
              <div className="text-3xl font-bold text-orange-600">{analyticsStats.staffIssuesCount || 0}</div>
              <div className="text-sm text-gray-600 mt-2">Staff Issues</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Total Physical Copies</h4>
              <span className="text-3xl font-bold text-gray-900">{analyticsStats.totalCopies || 0}</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Available Physical Copies</h4>
              <span className="text-3xl font-bold text-green-600">{analyticsStats.availableCopies || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMyRequests = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">My Book Requests</h3>

        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookRequests.length > 0 ? (
                bookRequests.map((req) => (
                  <tr key={req._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {req.book ? req.book.title : req.title}
                      {req.author && <span className="text-xs text-gray-500 block">by {req.author}</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    You have not made any book requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Book Requests</h3>

        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookRequests.length > 0 ? (
                bookRequests.map((req) => (
                  <tr key={req._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {req.book ? req.book.title : req.title}
                      {req.author && <span className="text-xs text-gray-500 block">by {req.author}</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {req.user?.firstName} {req.user?.lastName}
                      <span className="block text-xs">{req.user?.staffId}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {req.status === 'Pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateRequestStatus(req._id, 'Approved')}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"
                            title="Approve"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          </button>
                          <button
                            onClick={() => handleUpdateRequestStatus(req._id, 'Rejected')}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                            title="Reject"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        {!showIssueBookForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Transactions</h3>
              <button
                onClick={() => setShowIssueBookForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Issue Book
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BOOK</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISSUED DATE</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DUE DATE</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FINE</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr key={tx._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tx.book?.title} <br/>
                          <span className="text-xs text-gray-500 font-mono mt-1">QR: {tx.qrCode}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.user?.firstName} {tx.user?.lastName} <br/>
                          <span className="text-xs mt-1">ID: {tx.user?.rollNumber || tx.user?.libraryCardNumber || tx.user?.staffId || tx.user?.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.issuedDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.dueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.status === 'Returned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tx.fine}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Issue Book</h3>
            <form className="space-y-4" onSubmit={handleIssueBook}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book QR Code (Scan with Mobile/Cable)</label>
                  <input
                    type="text"
                    value={newTransaction.qrCode}
                    onChange={(e) => setNewTransaction({ ...newTransaction, qrCode: e.target.value.trim() })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="Scan or enter QR Code"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">Scan physical book's QR code</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Library Card Number / User ID</label>
                  <input
                    type="text"
                    list="userSearchList"
                    value={newTransaction.userIdentifier}
                    onChange={(e) => setNewTransaction({ ...newTransaction, userIdentifier: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search name, roll no, or library card..."
                    required
                    autoComplete="off"
                  />
                  <datalist id="userSearchList">
                    {allUsers.map((u) => (
                      <option key={u._id} value={u.libraryCardNumber || u.rollNumber || u.staffId || u.email}>
                        {u.firstName} {u.lastName} ({u.userType})
                      </option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={newTransaction.issueDays}
                    onChange={(e) => setNewTransaction({ ...newTransaction, issueDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Due Date will be calculated automatically</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowIssueBookForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Issue
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        {!showMessageForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Messages</h3>
              <button
                onClick={() => setShowMessageForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Send Message
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {messages.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {messages.map((msg) => (
                    <li key={msg._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{msg.subject}</p>
                          <p className="text-sm text-gray-500 mt-1">{msg.content}</p>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-600">
                        To: {msg.recipientRole.toUpperCase()} | From: {msg.sender?.firstName} {msg.sender?.lastName}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-6 text-center text-gray-500">No messages found.</p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Send Message</h3>
            <form className="space-y-4" onSubmit={handleSendMessage}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To (Role)</label>
                <select
                  value={newMessage.recipientRole}
                  onChange={(e) => setNewMessage({ ...newMessage, recipientRole: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="principal">Principal</option>
                  <option value="hod">HOD</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Message subject"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows="4"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMessageForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
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
