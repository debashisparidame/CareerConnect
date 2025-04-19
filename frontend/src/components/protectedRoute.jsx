import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import Loading from "./Loading";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [load, setLoad] = useState(true);

  const redirectUser = () => {
    if (!user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    // check if any user trying another users request
    if (!allowedRoles.includes(user.role)) {
      if (user.role === 'student') navigate("/student/dashboard", { replace: true })
      else if (user.role === 'tpo_admin') navigate("/tpo/dashboard")
      else if (user.role === 'management_admin') navigate("/management/dashboard", { replace: true })
      else if (user.role === 'superuser') navigate("/admin/dashboard")
      else navigate("/404")

      return;
    }
    setLoad(false);
  }

  useEffect(() => {
    redirectUser();
  }, [loading, navigate, user, allowedRoles]);

  useEffect(() => {
    if (user && user.isProfileCompleted === 'false') {
      if (user.role === 'student') navigate(`/student/complete-profile/${user.id}`);
      if (user.role === 'tpo_admin') navigate(`/tpo/complete-profile/${user.id}`);
      if (user.role === 'management_admin') navigate(`/management/complete-profile/${user.id}`);
      return;
    }
    setLoad(false);
  }, [user]);

  // If loading, show enhanced loading component
  if (loading || load) {
    return <EnhancedLoading role={user?.role} />;
  }

  // If user has the proper role, render the children routes
  return <Outlet />;
};

// Enhanced Loading Component
const EnhancedLoading = ({ role }) => {
  const getRoleColor = () => {
    switch (role) {
      case 'student': return 'from-blue-500 to-blue-700';
      case 'tpo_admin': return 'from-green-500 to-green-700';
      case 'management_admin': return 'from-purple-500 to-purple-700';
      case 'superuser': return 'from-red-500 to-red-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'student': return 'fas fa-user-graduate';
      case 'tpo_admin': return 'fas fa-user-tie';
      case 'management_admin': return 'fas fa-users-cog';
      case 'superuser': return 'fas fa-user-shield';
      default: return 'fas fa-user';
    }
  };

  const getLoadingMessage = () => {
    switch (role) {
      case 'student': return 'Preparing your student dashboard...';
      case 'tpo_admin': return 'Setting up TPO admin interface...';
      case 'management_admin': return 'Loading management controls...';
      case 'superuser': return 'Initializing admin dashboard...';
      default: return 'Loading your personalized experience...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#000"></circle>
          </pattern>
          <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>
      
      <div className="relative z-10 flex flex-col items-center max-w-md px-8">
        {/* Logo and pulse effect */}
        <div className="relative mb-8">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getRoleColor()} opacity-20 blur-xl animate-pulse`}></div>
          <div className={`w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-r ${getRoleColor()} shadow-lg`}>
            <i className={`${getRoleIcon()} text-white text-3xl`}></i>
          </div>
        </div>
        
        {/* Loading text */}
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          CareerConnect
        </h1>
        
        <p className="mb-6 text-center text-gray-600">
          {getLoadingMessage()}
        </p>
        
        {/* Loading indicator */}
        <div className="relative w-64 h-2 mb-4 overflow-hidden bg-gray-200 rounded-full">
          <div className={`absolute top-0 h-full bg-gradient-to-r ${getRoleColor()} rounded-full animate-loading-bar`}></div>
        </div>
        
        <p className="text-sm text-gray-500">
          Verifying permissions...
        </p>
      </div>
      
      {/* Custom animation */}
      <style jsx>{`
        @keyframes loadingBar {
          0% { left: -50%; width: 50%; }
          50% { left: 25%; width: 50%; }
          100% { left: 100%; width: 50%; }
        }
        
        .animate-loading-bar {
          animation: loadingBar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProtectedRoute;
