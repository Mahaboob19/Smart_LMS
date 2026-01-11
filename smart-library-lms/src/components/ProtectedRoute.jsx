// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../api/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  const currentUser = authAPI.getCurrentUser();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && currentUser) {
    // Check if user has required role
    if (!allowedRoles.includes(currentUser.userType)) {
      // Redirect to appropriate dashboard based on user type
      switch (currentUser.userType) {
        case 'student':
          return <Navigate to="/student-dashboard" replace />;
        case 'admin':
        case 'librarian':
        case 'hod':
          return <Navigate to="/admin-dashboard" replace />;
        case 'staff':
          return <Navigate to="/user-dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;