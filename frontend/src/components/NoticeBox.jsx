import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/backend_url';

function NoticeBox() {
  const [loading, setLoading] = useState(true);
  const [noticesData, setNoticesData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // Fetch the current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setCurrentUser({ role: response.data.role });
      } catch (error) {
        console.log("Error fetching user details => ", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch notices only after the user role is available
  useEffect(() => {
    if (currentUser?.role) {
      fetchNotices();
    }
  }, [currentUser?.role]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/management/get-all-notices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      let filteredNotices = [];
      if (currentUser?.role === 'management_admin') {
        filteredNotices = response.data.filter(notice => notice.sender_role === 'tpo_admin');
      } else if (currentUser?.role === 'tpo_admin') {
        filteredNotices = response.data.filter(notice => notice.receiver_role === 'tpo_admin');
      } else if (currentUser?.role === 'student') {
        filteredNotices = response.data.filter(notice => notice.receiver_role === 'student');
      }

      setNoticesData(filteredNotices);
    } catch (error) {
      console.log('Error while fetching notices => ', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date and time in a more readable way
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    // Format the date
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full mx-2 my-2 overflow-hidden border shadow-xl bg-gradient-to-br from-rose-50/70 to-white/60 backdrop-blur-md border-white/30 rounded-2xl shadow-red-900/10">
      {/* Enhanced Header with Animation */}
      <div className="p-4 pb-3 text-white bg-gradient-to-r from-red-600/90 to-rose-600/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center shadow-inner w-9 h-9 bg-white/20 rounded-xl">
              <i className="text-lg text-white fas fa-bullhorn"></i>
              <span className="absolute flex w-4 h-4 -top-1 -right-1">
                <span className="absolute inline-flex w-full h-full bg-yellow-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-4 h-4 bg-yellow-500 rounded-full"></span>
              </span>
            </div>
            <div>
              <h3 className="m-0 text-lg font-bold tracking-tight">Important Notices</h3>
              <p className="text-xs text-red-100">Official announcements and updates</p>
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1 overflow-hidden text-xs font-medium border rounded-full bg-white/20 border-white/30">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
            <span>Updates</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-lg bg-white/50">
          {/* Enhanced loading animation */}
          <div className="relative w-14 h-14">
            <div className="absolute top-0 border-4 border-red-200 rounded-full w-14 h-14"></div>
            <div className="absolute top-0 border-4 rounded-full w-14 h-14 border-t-red-600 animate-spin"></div>
            <div className="absolute w-8 h-8 -mt-4 -ml-4 border-4 rounded-full top-1/2 left-1/2 border-t-rose-500 animate-spin"></div>
          </div>
          <span className="mt-4 font-medium text-red-800">Loading notices...</span>
        </div>
      ) : (
        <div className="px-4 py-2">
          {/* Notice container with improved styling */}
          <div className="pr-2 overflow-y-auto h-72 custom-scrollbar">
            {noticesData?.length > 0 ? (
              noticesData.map((notice, index) => {
                const isNew = (new Date() - new Date(notice?.createdAt)) / (1000 * 60 * 60 * 24) <= 2;
                
                return (
                  <div 
                    key={index} 
                    className={`mb-3 p-3 rounded-xl transition-all duration-300 hover:shadow-md group ${
                      isNew ? 'bg-gradient-to-r from-rose-50 to-white border-l-4 border-l-red-500' : 'bg-white/50 hover:bg-white border border-transparent hover:border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <Link
                        className='text-sm font-medium text-red-700 no-underline hover:text-red-900 group-hover:underline'
                        to={
                          currentUser?.role === 'student'
                            ? `/student/notice/${notice?._id}`
                            : currentUser?.role === 'tpo_admin'
                              ? `/tpo/notice/${notice?._id}`
                              : currentUser.role === 'management_admin'
                                ? `/management/notice/${notice?._id}`
                                : ''
                        }
                        target="_blank"
                      >
                        <div className="flex items-center">
                          <i className="mr-2 text-red-500 fas fa-file-alt"></i>
                          {notice?.title}
                          {isNew && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-xs font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                      </Link>
                      <span className='flex items-center text-xs text-gray-500'>
                        <i className="mr-1 far fa-clock"></i>
                        {formatDateTime(notice?.createdAt)}
                      </span>
                    </div>
                    
                    {/* Notice content preview */}
                    {notice?.message && (
                      <div className="pl-6 mt-2 text-sm text-gray-600 line-clamp-2">
                        {notice.message.substring(0, 120)}
                        {notice.message.length > 120 ? '...' : ''}
                      </div>
                    )}
                    
                    {/* Additional metadata */}
                    <div className="flex items-center justify-between pl-6 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs text-red-800 bg-red-100 rounded-md">
                          <i className="mr-1 fas fa-user-shield"></i>
                          {notice.sender_role === 'tpo_admin' ? 'TPO' : 
                           notice.sender_role === 'management_admin' ? 'Management' : 'Admin'}
                        </span>
                        {notice.priority && (
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-md ${
                            notice.priority === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : notice.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            <i className="mr-1 fas fa-exclamation-circle"></i>
                            {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                          </span>
                        )}
                      </div>
                      
                      <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <Link
                          to={
                            currentUser?.role === 'student'
                              ? `/student/notice/${notice?._id}`
                              : currentUser?.role === 'tpo_admin'
                                ? `/tpo/notice/${notice?._id}`
                                : currentUser.role === 'management_admin'
                                  ? `/management/notice/${notice?._id}`
                                  : ''
                          }
                          target="_blank"
                          className="flex items-center text-xs text-red-600 no-underline hover:text-red-800"
                        >
                          Read More
                          <i className="ml-1 fas fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="relative flex items-center justify-center w-20 h-20 mb-4 overflow-hidden rounded-full bg-red-100/50">
                  <i className="text-2xl text-red-300 fas fa-bullhorn"></i>
                  <div className="absolute w-full h-0.5 bg-red-300 rotate-45 transform origin-center"></div>
                </div>
                <p className="mb-1 font-medium text-center text-red-900">No notices available</p>
                <p className="text-sm text-center text-gray-500">Check back later for announcements</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Enhanced Footer with gradient */}
      <div className="p-3 text-center border-t bg-gradient-to-r from-red-600/10 to-rose-600/10 border-red-200/30">
        {currentUser?.role === 'student' && (
          <Link to='/student/all-notice' className='flex items-center justify-center gap-1 text-sm font-medium text-red-700 no-underline transition hover:text-red-900'>
            View All Notices <i className="ml-1 text-xs fas fa-arrow-right"></i>
          </Link>
        )}
        {currentUser?.role === 'tpo_admin' && (
          <Link to='/tpo/all-notice' className='flex items-center justify-center gap-1 text-sm font-medium text-red-700 no-underline transition hover:text-red-900'>
            View All Notices <i className="ml-1 text-xs fas fa-arrow-right"></i>
          </Link>
        )}
        {currentUser?.role === 'management_admin' && (
          <Link to='/management/all-notice' className='flex items-center justify-center gap-1 text-sm font-medium text-red-700 no-underline transition hover:text-red-900'>
            View All Notices <i className="ml-1 text-xs fas fa-arrow-right"></i>
          </Link>
        )}
      </div>

      {/* Add this to your CSS/style files */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(254, 226, 226, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.7);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default NoticeBox;
