// pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MinimalHeader from '../components/MinimalHeader';
import { authAPI } from '../api/auth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authAPI.login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to root (dashboard)
        navigate('/');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <MinimalHeader />
      
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          {/* Logo and College Name */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/VVIT_logo.png"
                alt="VVIT Logo"
                className="h-16 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback-login');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-fallback-login" className="hidden items-center">
                <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">VVIT</span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              VVIT University
            </h1>
            <p className="text-gray-600">
              Smart<span className="text-blue-600 font-semibold">Library</span> Management System
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Login to Your Account
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                  placeholder="Enter your password"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Signup Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">
                Don't have an account? Sign up as:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/signup?type=student-staff')}
                  className="flex-1 text-center px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-sm"
                >
                  Student/Staff
                </button>
                <button
                  onClick={() => navigate('/signup?type=admin')}
                  className="flex-1 text-center px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium text-sm"
                >
                  Principal/HOD/Librarian
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Need help? <a href="#contact" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
