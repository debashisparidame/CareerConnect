import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/cpms.png';

function LandNavbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const loginLinks = [
    { label: 'Login as TPO', path: '/tpo/login' },
    { label: 'Login as Management', path: '/management/login' },
    { label: 'Login as Super Admin', path: '/admin' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg bg-white/90 backdrop-blur-md">
        <div className="container flex items-center justify-between px-4 py-3 mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-3 transition-transform cursor-pointer hover:scale-105" onClick={() => navigate('/')}>
            <img src={Logo} alt="Logo" className="w-10 h-12 rounded-lg shadow-md" />
            <span className="text-2xl font-bold tracking-wide text-orange-700">CareerConnect</span>
          </div>

          {/* Navigation Links - Enhanced */}
          <div className="flex items-center space-x-8">
            {/* Student Actions Group */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/student/login')}
                className="px-6 py-2.5 text-sm font-semibold text-blue-600 transition-all duration-300 border-2 border-blue-600 rounded-lg hover:bg-blue-50 hover:scale-105 shadow-md focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/student/signup')}
                className="px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-500 hover:scale-105 shadow-md focus:ring-2 focus:ring-blue-400"
              >
                Sign Up
              </button>
            </div>

            {/* Admin Portal Dropdown - Styled */}
            <div className="relative before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-gray-200">
              <button 
                className="px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-400 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Admin Portals
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 z-50 w-56 py-2 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl">
                  {loginLinks.map((link, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(link.path);
                        setShowDropdown(false);
                      }}
                      className="block w-full px-6 py-2.5 text-sm font-medium text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Copyright Bar - Enhanced */}
      <div className="fixed bottom-0 left-0 right-0 py-4 text-sm text-center text-gray-600 border-t border-gray-200 shadow-lg bg-white/90 backdrop-blur-md">
        <span className="font-medium">
          © 2025 <span className="font-bold text-blue-600">CareerConnect</span>. 
          Developed by <span className="font-bold text-orange-600">Debashis & Team</span> 
          <span className="mx-1">of</span> 
          <span className="font-bold text-blue-600">KIIT University</span>
        </span>
      </div>
    </>
  );
}

export default LandNavbar;
