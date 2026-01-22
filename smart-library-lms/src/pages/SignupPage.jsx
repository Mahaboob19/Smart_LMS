// pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import MinimalHeader from '../components/MinimalHeader';
import { authAPI } from '../api/auth';
import { departments } from '../utils/departments';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'student-staff';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentStaffType: 'student', // Student or Staff selection
    rollNumber: '',
    staffId: '',
    department: '',
    year: '',
    adminCode: '', // For admin authentication
    adminType: 'admin', // For admin role selection
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Reset form when user type changes
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      studentStaffType: 'student',
      rollNumber: '',
      staffId: '',
      department: '',
      year: '',
      adminCode: '',
      adminType: 'admin',
    });
    setError('');
    setSuccess('');
  }, [userType]);

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
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Admin code validation for admin users
    if (userType === 'admin' && !formData.adminCode) {
      setError('Admin authentication code is required');
      return;
    }

    // Department validation for HOD
    if (userType === 'admin' && formData.adminType === 'hod' && !formData.department) {
      setError('Department is required for HOD');
      return;
    }

    // Department validation for student/staff
    if (userType === 'student-staff' && !formData.department) {
      setError('Department is required');
      return;
    }

    setIsLoading(true);

    try {
      // Determine userType based on selection
      let finalUserType = 'student';
      if (userType === 'admin') {
        // Use the selected admin type (admin, librarian, hod, principal)
        finalUserType = formData.adminType || 'admin';
      } else if (userType === 'student-staff') {
        // Use student or staff based on selection
        finalUserType = formData.studentStaffType || 'student';
      }

      const result = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType: finalUserType,
        rollNumber: formData.studentStaffType === 'student' ? formData.rollNumber || undefined : undefined,
        staffId: formData.studentStaffType === 'staff' ? formData.staffId || undefined : undefined,
        department: formData.department || undefined,
        year: formData.studentStaffType === 'student' ? formData.year || undefined : undefined,
        adminCode: formData.adminCode || undefined,
      });

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isStudentStaff = userType === 'student-staff';
  const isAdmin = userType === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <MinimalHeader />
      
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Logo and College Name */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/VVIT_logo.png"
                alt="VVIT Logo"
                className="h-16 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback-signup');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-fallback-signup" className="hidden items-center">
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

          {/* User Type Indicator */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`px-4 py-2 rounded-lg ${isStudentStaff ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                <span className="font-medium">Student/Staff</span>
              </div>
              <div className={`px-4 py-2 rounded-lg ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                <span className="font-medium">Principal/HOD/Librarian</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">
              Currently signing up as: <span className="font-semibold text-gray-900">
                {isStudentStaff ? 'Student/Staff' : 'Principal/HOD/Librarian'}
              </span>
            </p>
          </div>

          {/* Signup Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Create Your Account
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
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

              {/* Student/Staff Specific Fields */}
              {isStudentStaff && (
                <>
                  {/* Student/Staff Type Selection */}
                  <div>
                    <label htmlFor="studentStaffType" className="block text-sm font-medium text-gray-700 mb-2">
                      I am a *
                    </label>
                    <select
                      id="studentStaffType"
                      name="studentStaffType"
                      value={formData.studentStaffType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>

                  {/* Department - Common for both */}
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Student-specific fields */}
                  {formData.studentStaffType === 'student' && (
                    <>
                      <div>
                        <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          id="rollNumber"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                          placeholder="Enter roll number"
                        />
                      </div>
                      <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                          Year
                        </label>
                        <select
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Staff-specific fields */}
                  {formData.studentStaffType === 'staff' && (
                    <div>
                      <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-2">
                        Staff ID
                      </label>
                      <input
                        type="text"
                        id="staffId"
                        name="staffId"
                        value={formData.staffId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                        placeholder="Enter staff ID"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Admin Specific Fields */}
              {isAdmin && (
                <>
                  <div>
                    <label htmlFor="adminType" className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      id="adminType"
                      name="adminType"
                      value={formData.adminType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 outline-none"
                    >
                      <option value="admin">Administrator</option>
                      <option value="librarian">Librarian</option>
                      <option value="hod">Head of Department (HOD)</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>
                  
                  {/* Department field for HOD */}
                  {formData.adminType === 'hod' && (
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                        Department * (Required for HOD)
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 outline-none"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Select the department you will be managing as HOD.
                      </p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Authentication Code *
                    </label>
                    <input
                      type="password"
                      id="adminCode"
                      name="adminCode"
                      value={formData.adminCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 outline-none"
                      placeholder="Enter admin authentication code"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This code is required to prevent unauthorized access. Contact the system administrator if you don't have it.
                    </p>
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                    placeholder="Confirm password"
                  />
                </div>
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
