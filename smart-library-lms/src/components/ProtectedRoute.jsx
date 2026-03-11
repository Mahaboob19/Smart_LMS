// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/auth';

const ProtectedRoute = ({ children }) => {
  if (!authAPI.isAuthenticated()) {
    return <Navigate to="/landing" replace />;
  }
  return children;
};

export default ProtectedRoute;
