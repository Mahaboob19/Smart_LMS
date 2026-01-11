// // components/UserLogin.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const UserLogin = ({ loginType }) => {
//   const [formData, setFormData] = useState({
//     id: '',
//     password: '',
//     rememberMe: false
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const getTitle = () => {
//     switch(loginType) {
//       case 'student': return 'Student Login';
//       case 'staff': return 'Staff Login';
//       default: return 'User Login';
//     }
//   };

//   const getPlaceholder = () => {
//     switch(loginType) {
//       case 'student': return 'Enter your Roll Number';
//       case 'staff': return 'Enter your Employee ID';
//       default: return 'Enter your ID';
//     }
//   };

//   const getDescription = () => {
//     switch(loginType) {
//       case 'student': return 'Access your library account, borrow books, and view history.';
//       case 'staff': return 'Access staff library services and resources.';
//       default: return 'User access portal.';
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     setTimeout(() => {
//       setIsLoading(false);
//       navigate('/user-dashboard');
//     }, 1500);
//   };

//   return (
//     <div>
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
//         <p className="text-gray-600 mt-2">{getDescription()}</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             {loginType === 'student' ? 'Roll Number' : 'Employee ID'}
//           </label>
//           <input
//             type="text"
//             name="id"
//             value={formData.id}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
//             placeholder={getPlaceholder()}
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
//             placeholder="Enter your password"
//             required
//           />
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="rememberMe"
//               checked={formData.rememberMe}
//               onChange={handleChange}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
//               id="rememberUser"
//             />
//             <label htmlFor="rememberUser" className="ml-2 text-sm text-gray-700">
//               Remember me
//             </label>
//           </div>
//           <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200">
//             Forgot password?
//           </a>
//         </div>

//         {error && (
//           <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-600 text-sm">{error}</p>
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
//             isLoading 
//               ? 'bg-blue-500 cursor-not-allowed' 
//               : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {isLoading ? (
//             <span className="flex items-center justify-center">
//               <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//               </svg>
//               Logging in...
//             </span>
//           ) : (
//             'Login'
//           )}
//         </button>
//       </form>

//       <div className="mt-6 pt-6 border-t border-gray-100">
//         <div className="text-center">
//           <p className="text-gray-600 text-sm">
//             {loginType === 'student' 
//               ? 'Demo: 23BQ1A05E3 / student123' 
//               : 'Demo: EMP001 / staff123'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserLogin;


// components/UserLogin.jsx - Updated with backend integration
import React, { useState } from 'react';

const UserLogin = ({ loginType, onLogin, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const getTitle = () => {
    switch(loginType) {
      case 'student': return 'Student Login';
      case 'staff': return 'Staff Login';
      default: return 'User Login';
    }
  };

  const getDescription = () => {
    switch(loginType) {
      case 'student': return 'Access your library account, borrow books, and view history.';
      case 'staff': return 'Access staff library services and resources.';
      default: return 'User access portal.';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onLogin(formData.email, formData.password);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
        <p className="text-gray-600 mt-2">{getDescription()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
            disabled={loading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
              id="rememberUser"
              disabled={loading}
            />
            <label htmlFor="rememberUser" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
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
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Demo Credentials for testing:
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {loginType === 'student' 
              ? 'Email: student@vvit.edu | Password: student123' 
              : 'Email: staff@vvit.edu | Password: staff123'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;