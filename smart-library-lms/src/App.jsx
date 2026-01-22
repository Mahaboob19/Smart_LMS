// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminManagementPage from './pages/AdminManagementPage';
import ProtectedRoute from './components/ProtectedRoute';
import { authAPI } from './api/auth';

// Component to handle root route - show dashboard if logged in, landing if not
const RootRoute = () => {
  if (authAPI.isAuthenticated()) {
    return <DashboardPage />;
  }
  return <LandingPage />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/management" 
          element={
            <ProtectedRoute>
              <AdminManagementPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

