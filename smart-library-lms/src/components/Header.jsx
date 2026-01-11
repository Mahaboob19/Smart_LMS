// // components/Header.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const navItems = [
//     { name: 'Home', href: '/' },
//     { name: 'Features', href: '#features' },
//     { name: 'About', href: '#about' },
//     { name: 'Contact', href: '#contact' },
//   ];

//   const handleLoginClick = () => {
//     navigate('/login');
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
//       <nav className="container mx-auto px-6 py-3">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <img 
//                 src="/VVIT_logo.png" 
//                 alt="VVIT Logo" 
//                 className="h-12 w-auto"
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                   const fallback = document.getElementById('logo-fallback');
//                   if (fallback) fallback.style.display = 'flex';
//                 }}
//               />
//               <div id="logo-fallback" className="hidden items-center">
//                 <div className="h-12 w-12 bg-[#0a3d62] rounded-lg flex items-center justify-center mr-3">
//                   <span className="text-white font-bold text-lg">VVIT</span>
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold text-gray-900 leading-tight">VVIT University</div>
//                   <div className="text-xs text-gray-600">Library Management System</div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="hidden md:block h-8 w-px bg-gray-200"></div>
            
//             <div className="hidden md:block">
//               <span className="text-xl font-bold text-gray-800">
//                 Smart<span className="text-blue-600">Library</span>
//               </span>
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
//               >
//                 {item.name}
//                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
//               </a>
//             ))}
//             <button 
//               onClick={handleLoginClick}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
//             >
//               Login
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden mt-4 pb-4">
//             <div className="flex flex-col space-y-4">
//               {navItems.map((item) => (
//                 <a
//                   key={item.name}
//                   href={item.href}
//                   className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200 border-b border-gray-100 hover:border-blue-600"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.name}
//                 </a>
//               ))}
//               <button 
//                 onClick={() => {
//                   handleLoginClick();
//                   setIsMenuOpen(false);
//                 }}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium w-full"
//               >
//                 Login
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;


// components/Header.jsx - Updated with auth integration
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    authAPI.logout();
  };

  const isLoggedIn = authAPI.isAuthenticated();
  const currentUser = authAPI.getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img 
                src="/VVIT_logo.png" 
                alt="VVIT Logo" 
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-fallback" className="hidden items-center">
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">VVIT</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-tight">VVIT University</div>
                  <div className="text-xs text-gray-600">Library Management System</div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block h-8 w-px bg-gray-200"></div>
            
            <div className="hidden md:block">
              <span className="text-xl font-bold text-gray-800">
                Smart<span className="text-blue-600">Library</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser?.userType}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogoutClick}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200 border-b border-gray-100 hover:border-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {isLoggedIn ? (
                <>
                  <div className="py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{currentUser?.userType}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogoutClick();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    handleLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium w-full"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;