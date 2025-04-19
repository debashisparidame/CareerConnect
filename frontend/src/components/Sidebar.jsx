import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import axios from 'axios';
import Logo from '../assets/CPMS.png';
import SubMenu from './Submenu';
import { BASE_URL } from '../config/backend_url';

const Sidebar = ({ isSidebarVisible }) => {
  const [sidebar, setSidebar] = useState(isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebar(isSidebarVisible);
  }, [isSidebarVisible]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (loadData.role === 'student') navigate('../student/login');
    else if (loadData.role === 'tpo_admin') navigate('../tpo/login');
    else if (loadData.role === 'management_admin') navigate('../management/login');
    else if (loadData.role === 'superuser') navigate('../admin');
  };

  const [loadData, setLoadData] = useState({
    name: 'Not Found',
    email: 'Not Found',
    profile: 'Profile Img',
    role: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setLoadData({
          name: `${res.data?.first_name} ${res.data?.middle_name || ''} ${res.data?.last_name || ''}`.trim(),
          email: res.data.email,
          profile: res.data.profile,
          role: res.data.role,
        });
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: err.response.data.msg,
          };
          navigate('../', { state: dataToPass });
        }
      });
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [SidebarData, setSidebarData] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const fetchSidebarData = async () => {
    if (loadData.role === 'superuser') {
      const { SidebarData } = await import('./SuperUser/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'management_admin') {
      const { SidebarData } = await import('./Management/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'tpo_admin') {
      const { SidebarData } = await import('./TPO/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'student') {
      const { SidebarData } = await import('./Students/SidebarData');
      setSidebarData(SidebarData);
    }
  };

  useEffect(() => {
    if (loadData.role) {
      fetchSidebarData();
    }
  }, [loadData.role]);

  // Function to get role-specific colors
  const getRoleColors = () => {
    switch(loadData.role) {
      case 'superuser': 
        return {
          primary: 'from-purple-600 to-purple-800',
          secondary: 'purple-50',
          highlight: 'purple-100',
          active: 'purple-700',
          text: 'purple-900'
        };
      case 'management_admin': 
        return {
          primary: 'from-blue-600 to-blue-800',
          secondary: 'blue-50',
          highlight: 'blue-100',
          active: 'blue-700',
          text: 'blue-900'
        };
      case 'tpo_admin': 
        return {
          primary: 'from-green-600 to-green-800',
          secondary: 'green-50',
          highlight: 'green-100',
          active: 'green-700',
          text: 'green-900'
        };
      case 'student': 
        return {
          primary: 'from-blue-500 to-blue-700',
          secondary: 'blue-50',
          highlight: 'blue-100',
          active: 'blue-600',
          text: 'blue-900'
        };
      default: 
        return {
          primary: 'from-gray-600 to-gray-800',
          secondary: 'gray-50',
          highlight: 'gray-100',
          active: 'gray-700',
          text: 'gray-900'
        };
    }
  };

  const colors = getRoleColors();
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <nav className={`bg-white w-[260px] min-h-screen h-full z-20 flex flex-col fixed top-0 transition-all duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-full'} shadow-lg`}>
        {/* Header/Logo section */}
        <div className={`px-5 py-6 bg-gradient-to-r ${colors.primary} text-white`}>
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white rounded-lg shadow-md">
              <img src={Logo} alt="CareerConnect Logo" width="40" height="40" className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold leading-none">
                <Link to={`/${loadData.role === 'superuser' ? 'admin' : loadData.role === 'management_admin' ? 'management' : loadData.role === 'tpo_admin' ? 'tpo' : 'student'}/dashboard`} className="text-white no-underline">
                  CareerConnect
                </Link>
              </h1>
              <div className="flex items-center text-xs text-white/80">
                <span className="px-2 py-0.5 bg-white/20 rounded-full capitalize">
                  {loadData.role === 'superuser' ? 'Admin' : 
                   loadData.role === 'management_admin' ? 'Management' : 
                   loadData.role === 'tpo_admin' ? 'TPO' : 'Student'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className={`mx-4 -mt-5 bg-white rounded-lg shadow-md border border-${colors.highlight} overflow-hidden`}>
          <div className="flex items-center gap-3 p-4">
            {loadData.profile === 'Profile Img' ? (
              <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${colors.primary} flex items-center justify-center text-white font-semibold`}>
                {getInitials(loadData.name)}
              </div>
            ) : (
              <img 
                src={loadData.profile} 
                alt={loadData.name} 
                className="object-cover w-16 border-2 border-white rounded-full shadow h-15 "
              />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">{loadData.name}</h2>
              <p className="text-xs text-gray-500 truncate">{loadData.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-grow px-3 py-5 overflow-y-auto sidebar-content">
          <div className="space-y-1">
            {SidebarData.length > 0 ? (
              SidebarData.map((item, index) => (
                <SubMenu 
                  item={item} 
                  key={index} 
                  currentPath={location.pathname} 
                  roleColor={colors.active}
                />
              ))
            ) : (
              <div className="flex justify-center py-8">
                <div className="flex space-x-2 animate-pulse">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-auto">
          {/* Quick Actions */}
          <div className={`mx-3 mb-3 grid grid-cols-2 gap-2`}>
            <Link 
              to={`/${loadData.role === 'superuser' ? 'admin' : loadData.role === 'management_admin' ? 'management' : loadData.role === 'tpo_admin' ? 'tpo' : 'student'}/account`}
              className={`flex flex-col items-center justify-center p-3 rounded-lg bg-${colors.secondary} hover:bg-${colors.highlight} transition-colors text-${colors.text} no-underline`}
            >
              <FaCog className="mb-1 text-lg" />
              <span className="text-xs font-medium">Settings</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex flex-col items-center justify-center p-3 text-red-700 transition-colors rounded-lg bg-red-50 hover:bg-red-100"
            >
              <FaSignOutAlt className="mb-1 text-lg" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>

          {/* App Version */}
          <div className="px-4 py-3 text-center border-t border-gray-100 bg-gray-50">
            <p className="flex items-center justify-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
              CareerConnect v1.0.1
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
