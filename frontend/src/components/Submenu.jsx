import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Enhanced sidebar link component
const SidebarLink = ({ to, onClick, active, children, hasSubnav, roleColor = "blue-600" }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      flex items-center justify-between w-full px-4 py-2.5 rounded-lg mb-1
      text-gray-700 text-sm font-medium no-underline transition-all duration-200
      ${hasSubnav ? 'cursor-pointer' : ''}
      ${active 
        ? `bg-${roleColor}/10 text-${roleColor} font-semibold` 
        : 'hover:bg-gray-100'
      }
    `}
  >
    {children}
  </Link>
);

// Enhanced sidebar label component
const SidebarLabel = ({ children }) => (
  <span className="ml-3 truncate">{children}</span>
);

// Enhanced dropdown link component
const DropdownLink = ({ to, active, children, roleColor = "blue-600" }) => (
  <Link
    to={to}
    className={`
      flex items-center w-full px-3 py-2 rounded-lg mb-0.5
      text-gray-600 text-sm no-underline transition-all duration-200
      ${active 
        ? `bg-${roleColor}/10 text-${roleColor} font-medium` 
        : 'hover:bg-gray-100'
      }
    `}
  >
    {children}
  </Link>
);

const SubMenu = ({ item, currentPath, roleColor = "blue-600" }) => {
  const [subnav, setSubnav] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if current path is active or any subnavs are active
  const isActive = currentPath === item.path;
  const hasActiveSubnav = item.subNav && item.subNav.some(subItem => currentPath === subItem.path);

  useEffect(() => {
    // Open submenu if current path matches any subnav paths
    if (item.subNav && item.subNav.some(subItem => currentPath.includes(subItem.path))) {
      setSubnav(true);
    }
  }, [currentPath, item.subNav]);

  const showSubnav = (e) => {
    // Only prevent default if there are subnavs
    if (item.subNav) {
      e.preventDefault();
      setSubnav(!subnav);
    }
  };

  return (
    <div className="relative">
      {/* Main menu item */}
      <SidebarLink
        to={item.path}
        onClick={showSubnav}
        active={isActive || hasActiveSubnav}
        hasSubnav={!!item.subNav}
        roleColor={roleColor}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center w-full">
          <div className={`flex items-center justify-center w-6 h-6 ${isActive || hasActiveSubnav ? `text-${roleColor}` : 'text-gray-500'}`}>
            {item.icon}
          </div>
          <SidebarLabel>
            {item.title}
          </SidebarLabel>
        </div>
        <div>
          {item.subNav && (
            <div className={`transform transition-transform duration-200 ${subnav ? 'rotate-180' : ''}`}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={isActive || hasActiveSubnav ? `text-${roleColor}` : 'text-gray-400'}
              >
                <path 
                  d="M8 10.6667L2.66667 5.33334L3.81334 4.18667L8 8.37334L12.1867 4.18667L13.3333 5.33334L8 10.6667Z" 
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
      </SidebarLink>

      {/* Submenu with smooth animation */}
      {item.subNav && (
        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-in-out pl-3 pr-1
            ${subnav ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'}
          `}
        >
          <div className={`border-l-2 border-gray-200 pl-2 py-1 ml-3`}>
            {item.subNav.map((subItem, index) => (
              <DropdownLink
                to={subItem.path}
                key={index}
                active={currentPath === subItem.path}
                roleColor={roleColor}
              >
                <div className={`flex items-center justify-center w-5 h-5 ${currentPath === subItem.path ? `text-${roleColor}` : 'text-gray-400'}`}>
                  {subItem.icon}
                </div>
                <SidebarLabel>
                  {subItem.title}
                </SidebarLabel>
              </DropdownLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubMenu;
