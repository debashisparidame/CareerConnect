import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BreadcrumbExp({ header }) {
  const location = useLocation();

  // Identify path components
  let pathnames = location.pathname.split('/').filter(Boolean);
  
  // Extract user type (student, tpo, management)
  const userIs = pathnames[0];
  
  // Remove user type from pathnames
  pathnames = pathnames.slice(1);
  
  // Remove 'dashboard' if it's part of the path
  if (pathnames[0] === "dashboard") {
    pathnames = pathnames.slice(1);
  }

  // Function to get appropriate icon for each path segment
  const getIcon = (name) => {
    const icons = {
      dashboard: 'fas fa-tachometer-alt',
      profile: 'fas fa-user',
      jobs: 'fas fa-briefcase',
      companies: 'fas fa-building',
      students: 'fas fa-user-graduate',
      settings: 'fas fa-cog',
      notifications: 'fas fa-bell',
      interviews: 'fas fa-calendar-check',
      applications: 'fas fa-file-alt',
      reports: 'fas fa-chart-bar',
      users: 'fas fa-users',
      'add-company': 'fas fa-plus-circle',
      'post-job': 'fas fa-file-upload',
      'all-students': 'fas fa-user-friends',
      'placement-statistics': 'fas fa-chart-line',
      'approve-student': 'fas fa-user-check',
      default: 'fas fa-link'
    };
    
    return icons[name] || icons.default;
  };

  // Function to format path name for display
  const formatPathName = (name) => {
    // Handle special cases
    if (name === 'tpo') return 'TPO';
    
    // Handle hyphens and capitalize each word
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="flex flex-col items-start justify-between gap-4 p-4 mb-6 bg-white border border-gray-100 shadow-sm sm:flex-row sm:items-center rounded-xl">
      {/* Page Header */}
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-blue-700">
          <i className={getIcon(pathnames[pathnames.length - 1] || 'dashboard')}></i>
        </div>
        <div>
          <h1 className="m-0 text-xl font-bold text-gray-800">
            {header}
          </h1>
          <p className="m-0 text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      {/* Breadcrumb Trail */}
      <nav aria-label="breadcrumb">
        <ol className="flex flex-wrap items-center p-0 m-0 bg-transparent">
          {/* Home link */}
          <li className="flex items-center text-sm">
            <Link 
              to={`/${userIs}/dashboard`} 
              className="flex items-center text-blue-600 no-underline transition-colors hover:text-blue-800"
            >
              <i className="mr-1 fas fa-home"></i>
              Home
            </Link>
            {(pathnames.length > 0) && (
              <span className="mx-2 text-gray-400">
                <i className="text-xs fas fa-chevron-right"></i>
              </span>
            )}
          </li>
          
          {/* Path segments */}
          {pathnames.map((name, index) => {
            // Build the route
            let routeTo = `/${userIs}`;
            for (let i = 0; i <= index; i++) {
              routeTo += `/${pathnames[i]}`;
            }
            
            const isLast = index === pathnames.length - 1;
            const formattedName = formatPathName(name);
            
            // Return appropriate list item
            return (
              <li key={name} className="flex items-center text-sm">
                {isLast ? (
                  // Current page (not a link)
                  <span className="font-medium text-gray-600">
                    {formattedName}
                  </span>
                ) : (
                  // Link to previous path
                  <>
                    <Link 
                      to={routeTo} 
                      className="text-blue-600 no-underline transition-colors hover:text-blue-800"
                    >
                      {formattedName}
                    </Link>
                    <span className="mx-2 text-gray-400">
                      <i className="text-xs fas fa-chevron-right"></i>
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      
      {/* Background Animation */}
      <div className="absolute top-0 right-0 hidden pointer-events-none -z-10 opacity-10 md:block">
        <div className="w-32 h-32 rounded-full blur-3xl bg-blue-600/30"></div>
      </div>
    </div>
  );
}

export default BreadcrumbExp;