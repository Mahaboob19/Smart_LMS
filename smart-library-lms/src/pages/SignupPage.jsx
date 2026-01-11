// // pages/SignupPage.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const SignupPage = () => {
//   const [userType, setUserType] = useState('student'); // 'student', 'staff'
//   const [formData, setFormData] = useState({
//     // Common fields
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
    
//     // Student specific
//     rollNumber: '',
//     department: '',
//     year: '',
    
//     // Staff specific
//     employeeId: '',
//     designation: '',
//     departmentStaff: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const departments = [
//     'Computer Science & Engineering',
//     'Electronics & Communication',
//     'Mechanical Engineering',
//     'Civil Engineering',
//     'Electrical Engineering',
//     'Information Technology'
//   ];

//   const years = ['I Year', 'II Year', 'III Year', 'IV Year'];
//   const designations = ['Professor', 'Assistant Professor', 'Lab Assistant', 'Technical Staff', 'Administrative Staff'];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       alert('Account created successfully! Please login.');
//       navigate('/login');
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
//       <div className="container mx-auto px-6 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//               Create New Account
//             </h1>
//             <p className="text-gray-600">Join VVIT University L</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="p-6 md:p-8">
//               {/* User Type Selection */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Select Account Type</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <button
//                     onClick={() => setUserType('student')}
//                     className={`p-4 rounded-xl border-2 text-left transition-all ${
//                       userType === 'student'
//                         ? 'border-[#38ada9] bg-green-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
//                         userType === 'student' ? 'bg-[#38ada9]' : 'bg-gray-100'
//                       }`}>
//                         <span className="text-lg">🎓</span>
//                       </div>
//                       <div>
//                         <h4 className="font-bold text-gray-900">Student Account</h4>
//                         <p className="text-gray-600 text-sm">For VVIT University students</p>
//                       </div>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => setUserType('staff')}
//                     className={`p-4 rounded-xl border-2 text-left transition-all ${
//                       userType === 'staff'
//                         ? 'border-[#0a3d62] bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
//                         userType === 'staff' ? 'bg-[#0a3d62]' : 'bg-gray-100'
//                       }`}>
//                         <span className="text-lg">👨‍💼</span>
//                       </div>
//                       <div>
//                         <h4 className="font-bold text-gray-900">Staff Account</h4>
//                         <p className="text-gray-600 text-sm">For VVIT University staff</p>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Signup Form */}
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Common Fields */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                       placeholder="Enter first name"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                       placeholder="Enter last name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                       placeholder="Enter VVIT email"
//                       required
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Use your VVIT email address</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                       placeholder="Enter phone number"
//                     />
//                   </div>
//                 </div>

//                 {/* Conditional Fields */}
//                 {userType === 'student' ? (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Roll Number *
//                       </label>
//                       <input
//                         type="text"
//                         name="rollNumber"
//                         value={formData.rollNumber}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38ada9] focus:border-[#38ada9] outline-none transition"
//                         placeholder="e.g., 23BQ1A05E3"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Department *
//                       </label>
//                       <select
//                         name="department"
//                         value={formData.department}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38ada9] focus:border-[#38ada9] outline-none transition"
//                         required
//                       >
//                         <option value="">Select Department</option>
//                         {departments.map(dept => (
//                           <option key={dept} value={dept}>{dept}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Year *
//                       </label>
//                       <select
//                         name="year"
//                         value={formData.year}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38ada9] focus:border-[#38ada9] outline-none transition"
//                         required
//                       >
//                         <option value="">Select Year</option>
//                         {years.map(year => (
//                           <option key={year} value={year}>{year}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Employee ID *
//                       </label>
//                       <input
//                         type="text"
//                         name="employeeId"
//                         value={formData.employeeId}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                         placeholder="e.g., EMP001"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Designation *
//                       </label>
//                       <select
//                         name="designation"
//                         value={formData.designation}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                         required
//                       >
//                         <option value="">Select Designation</option>
//                         {designations.map(desg => (
//                           <option key={desg} value={desg}>{desg}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Department *
//                       </label>
//                       <select
//                         name="departmentStaff"
//                         value={formData.departmentStaff}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                         required
//                       >
//                         <option value="">Select Department</option>
//                         {departments.map(dept => (
//                           <option key={dept} value={dept}>{dept}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 )}

//                 {/* Password Fields */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Password *
//                     </label>
//                     <input
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                       placeholder="Create password"
//                       required
//                     />
//                     <ul className="text-xs text-gray-500 mt-2 space-y-1">
//                       <li>• At least 8 characters</li>
//                       <li>• One uppercase letter</li>
//                       <li>• One number</li>
//                     </ul>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Confirm Password *
//                     </label>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none transition"
//                       placeholder="Confirm password"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                     <p className="text-red-600 text-sm">{error}</p>
//                   </div>
//                 )}

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="terms"
//                     className="h-4 w-4 text-[#0a3d62] focus:ring-[#0a3d62] border-gray-300 rounded"
//                     required
//                   />
//                   <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
//                     I agree to the{' '}
//                     <a href="#" className="text-[#0a3d62] hover:underline">Terms of Service</a>
//                     {' '}and{' '}
//                     <a href="#" className="text-[#0a3d62] hover:underline">Privacy Policy</a>
//                   </label>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
//                       isLoading 
//                         ? 'bg-[#3c6382] cursor-not-allowed' 
//                         : userType === 'student'
//                           ? 'bg-[#38ada9] hover:bg-[#2d8c87]'
//                           : 'bg-[#0a3d62] hover:bg-[#083354]'
//                     }`}
//                   >
//                     {isLoading ? (
//                       <span className="flex items-center justify-center">
//                         <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                         </svg>
//                         Creating Account...
//                       </span>
//                     ) : (
//                       'Create Account'
//                     )}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => navigate('/login')}
//                     className="flex-1 py-3 px-4 rounded-lg font-medium border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors"
//                   >
//                     Already have an account? Login
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

// pages/SignupPage.jsx - Updated with backend integration
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';

const SignupPage = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Student fields
    rollNumber: '',
    department: '',
    year: '',
    section: '',
    semester: '',
    // Staff fields
    employeeId: '',
    designation: '',
    departmentStaff: '',
    joiningDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Artificial Intelligence',
    'Data Science',
    'Administration',
    'Library'
  ];

  const years = ['I Year', 'II Year', 'III Year', 'IV Year'];
  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Head of Department',
    'Principal',
    'Lab Assistant',
    'Technical Staff',
    'Administrative Staff',
    'Library Staff'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    // Student specific validations
    if (userType === 'student') {
      if (!formData.rollNumber) newErrors.rollNumber = 'Roll number is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.year) newErrors.year = 'Year is required';
    }
    
    // Staff specific validations
    if (userType === 'staff' || userType === 'hod' || userType === 'librarian') {
      if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
      if (!formData.designation) newErrors.designation = 'Designation is required';
      if (!formData.departmentStaff) newErrors.departmentStaff = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType: userType,
      };
      
      // Add type-specific fields
      if (userType === 'student') {
        userData.rollNumber = formData.rollNumber;
        userData.department = formData.department;
        userData.year = formData.year;
        userData.section = formData.section;
        userData.semester = formData.semester;
      } else {
        userData.employeeId = formData.employeeId;
        userData.designation = formData.designation;
        userData.department = formData.departmentStaff;
        if (formData.joiningDate) {
          userData.joiningDate = formData.joiningDate;
        }
      }
      
      const response = await authAPI.register(userData);
      
      if (response.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Create New Account
            </h1>
            <p className="text-gray-600">Join VVIT University Library System</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600">{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              {/* User Type Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Account Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      userType === 'student'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        userType === 'student' ? 'bg-blue-600' : 'bg-gray-100'
                      }`}>
                        <span className="text-white text-lg">🎓</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Student Account</h4>
                        <p className="text-gray-600 text-sm">For VVIT University students</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserType('staff')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      userType === 'staff'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        userType === 'staff' ? 'bg-blue-600' : 'bg-gray-100'
                      }`}>
                        <span className="text-white text-lg">👨‍💼</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Staff Account</h4>
                        <p className="text-gray-600 text-sm">For VVIT University staff</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter first name"
                      disabled={loading}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter last name"
                      disabled={loading}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter VVIT email"
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Use your VVIT email address</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                      placeholder="Enter phone number"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Conditional Fields */}
                {userType === 'student' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Roll Number *
                        </label>
                        <input
                          type="text"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                            errors.rollNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 23BQ1A05E3"
                          disabled={loading}
                        />
                        {errors.rollNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department *
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                            errors.department ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={loading}
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        {errors.department && (
                          <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year *
                        </label>
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                            errors.year ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={loading}
                        >
                          <option value="">Select Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.year && (
                          <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section
                        </label>
                        <select
                          name="section"
                          value={formData.section}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                          disabled={loading}
                        >
                          <option value="">Select Section</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Semester
                        </label>
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                          disabled={loading}
                        >
                          <option value="">Select Semester</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                          errors.employeeId ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., EMP001"
                        disabled={loading}
                      />
                      {errors.employeeId && (
                        <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation *
                      </label>
                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                          errors.designation ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      >
                        <option value="">Select Designation</option>
                        {designations.map(desg => (
                          <option key={desg} value={desg}>{desg}</option>
                        ))}
                      </select>
                      {errors.designation && (
                        <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <select
                        name="departmentStaff"
                        value={formData.departmentStaff}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                          errors.departmentStaff ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.departmentStaff && (
                        <p className="mt-1 text-sm text-red-600">{errors.departmentStaff}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Create password"
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                      <li>• At least 6 characters</li>
                      <li>• Must contain letters and numbers</li>
                    </ul>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                      disabled={loading}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                      loading 
                        ? 'bg-blue-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="flex-1 py-3 px-4 rounded-lg font-medium border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors"
                    disabled={loading}
                  >
                    Already have an account? Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;