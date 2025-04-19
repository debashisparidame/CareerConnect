// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaBars, 
  FaBriefcase, 
  FaHome, 
  FaUser, 
  FaCog, 
  FaListAlt, 
  FaBuilding, 
  FaGraduationCap,
  FaChartLine,
  FaSun,
  FaCloudSun,
  FaMoon
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function Navbar({ isSidebarVisible, toggleSidebar }) {
  const location = useLocation();
  const [greeting, setGreeting] = useState('');

  // Page name extraction and formatting
  let pageName = location.pathname.split('/').filter(Boolean).pop();
  if (pageName === 'dashboard') pageName = "home";
  if (pageName === 'tpo') pageName = "TPO";
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Get current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get icon for current page
  const getPageIcon = () => {
    const path = location.pathname.toLowerCase();
    
    if (path.includes('home') || path.includes('dashboard')) {
      return <FaHome className="w-4 h-4 text-blue-500" />;
    } else if (path.includes('profile')) {
      return <FaUser className="w-4 h-4 text-blue-500" />;
    } else if (path.includes('setting')) {
      return <FaCog className="w-4 h-4 text-blue-500" />;
    } else if (path.includes('job')) {
      return <FaListAlt className="w-4 h-4 text-blue-500" />;
    } else if (path.includes('company')) {
      return <FaBuilding className="w-4 h-4 text-blue-500" />;
    } else if (path.includes('student')) {
      return <FaGraduationCap className="w-4 h-4 text-blue-500" />;
    } else if (path.includes('analytics')) {
      return <FaChartLine className="w-4 h-4 text-blue-500" />;
    } else {
      return <FaBriefcase className="w-4 h-4 text-blue-500" />;
    }
  };

  // Get greeting icon
  const getGreetingIcon = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return <FaSun className="w-4 h-4 mr-1.5 text-yellow-500" />;
    } else if (currentHour >= 12 && currentHour < 17) {
      return <FaCloudSun className="w-4 h-4 mr-1.5 text-orange-400" />;
    } else {
      return <FaMoon className="w-4 h-4 mr-1.5 text-indigo-400" />;
    }
  };

  // Update greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good Morning');
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    // Set initial greeting
    updateGreeting();

    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={`h-16 sticky top-0 z-10 flex items-center justify-between px-4 
      bg-gradient-to-r from-white/90 to-slate-50/90 backdrop-blur-lg border-b border-slate-100 
      transition-all duration-300 shadow-sm ${
      isSidebarVisible ? 'md:ml-60' : 'ml-0'
    }`}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 transition-all rounded-lg text-slate-600 bg-slate-100/70 hover:bg-blue-50 hover:text-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="Toggle Sidebar"
        >
          <FaBars className="w-5 h-5" />
        </button>

        <div>
          {/* Modified this section to move the page name down by ~0.5cm */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mt-3"> {/* Added mt-2 for spacing */}
              {getPageIcon()}
              <h1 className="mt-2 text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600">
                {pageName}
              </h1>
            </div>
            <p className="text-xs font-medium text-slate-500">
              {getCurrentDate()}
            </p>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="items-center hidden text-center md:flex">
        <div className="items-center px-3 py-1 border rounded-full shadow-sm bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-indigo-100/40 backdrop-blur-sm">
          <p className="flex items-center text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
            {getGreetingIcon()}
            {greeting}
            <span className="ml-1.5 opacity-90">
              {greeting === 'Good Morning' && '☀️'}
              {greeting === 'Good Afternoon' && '🌤️'}
              {greeting === 'Good Evening' && '🌙'}
            </span>
          </p>
        </div>
      </div>

      {/* Right Section - Logo Only */}
      <div className="flex items-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center transition-all shadow-md w-9 h-9 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-105">
            <FaBriefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
            CareerConnect
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
