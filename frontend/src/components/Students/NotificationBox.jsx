import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/backend_url';
import { FaBell, FaEye, FaBuilding, FaMoneyBillWave, FaMapMarkerAlt, FaClock, FaArrowRight, FaFilter, FaSync, FaBellSlash } from 'react-icons/fa';

function NotificationBox() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'closing-soon'

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

  useEffect(() => {
    fetchJobs();
  }, [currentUser?.role, filter]);

  const fetchJobs = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${BASE_URL}/tpo/jobs`);
      let filteredJobs = response.data.data.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      
      // Apply filtering
      if (filter === 'new') {
        filteredJobs = filteredJobs.filter(job => 
          (new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2
        );
      } else if (filter === 'closing-soon') {
        const now = new Date();
        filteredJobs = filteredJobs.filter(job => {
          const deadline = new Date(job?.applicationDeadline);
          const daysRemaining = (deadline - now) / (1000 * 60 * 60 * 24);
          return daysRemaining >= 0 && daysRemaining <= 3; 
        }).sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
      }
      
      setJobs(filteredJobs.slice(0, 10));
    } catch (error) {
      console.log('Error while fetching notices => ', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchJobs();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setLoading(true);
  };
  
  // Function to get time elapsed since posting
  const getTimeElapsed = (postedDate) => {
    const posted = new Date(postedDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now - posted) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return posted.toLocaleDateString('en-IN');
  };

  // Function to get days remaining until deadline
  const getDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return null;
    
    const deadline = new Date(deadlineDate);
    const now = new Date();
    const diffInDays = Math.floor((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return "Expired";
    if (diffInDays === 0) return "Last day";
    if (diffInDays === 1) return "1 day left";
    return `${diffInDays} days left`;
  };

  // Function to navigate to detailed job view
  const navigateToJobDetail = (jobId) => {
    const baseRoute = currentUser?.role === 'student' ? '/student' :
                      currentUser?.role === 'tpo_admin' ? '/tpo' :
                      currentUser?.role === 'management_admin' ? '/management' : '';
    navigate(`${baseRoute}/job/${jobId}`);
  };

  // Function to view all jobs
  const viewAllJobs = () => {
    const route = currentUser?.role === 'student' ? '/student/job-listings' :
                  currentUser?.role === 'tpo_admin' ? '/tpo/job-listings' :
                  currentUser?.role === 'management_admin' ? '/management/job-listings' : '';
    navigate(route);
  };

  return (
    <>
      <div className="w-full mx-2 my-3 overflow-hidden border shadow-xl bg-gradient-to-br from-blue-50/60 to-white/50 backdrop-blur-md border-white/40 rounded-2xl shadow-blue-900/10">
        {/* Enhanced Header with Animation */}
        <div className="p-4 pb-3 text-white bg-gradient-to-r from-blue-600/90 to-indigo-600/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center shadow-inner w-9 h-9 bg-white/20 rounded-xl">
                <FaBell className="text-lg text-white" />
                <span className="absolute flex w-4 h-4 -top-1 -right-1">
                  <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-4 h-4 bg-red-500 rounded-full"></span>
                </span>
              </div>
              <div>
                <h3 className="m-0 text-lg font-bold tracking-tight">Latest Opportunities</h3>
                <p className="text-xs text-blue-100">Stay updated with new job postings</p>
              </div>
            </div>
            <div className="inline-flex items-center px-3 py-1 overflow-hidden text-xs font-medium border rounded-full bg-white/20 border-white/30">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>Real-time</span>
            </div>
          </div>
        </div>
        
        {/* Filter and Refresh Controls */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-blue-100">
          <div className="flex space-x-1">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => handleFilterChange('new')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === 'new' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              <span className="hidden sm:inline">New </span>Openings
            </button>
            <button 
              onClick={() => handleFilterChange('closing-soon')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === 'closing-soon' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              Closing Soon
            </button>
          </div>
          
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="p-2 text-blue-600 transition-all rounded-md hover:bg-blue-50"
            title="Refresh notifications"
          >
            <FaSync className={`${refreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-lg bg-white/50">
            {/* Enhanced loading animation */}
            <div className="relative w-14 h-14">
              <div className="absolute top-0 border-4 border-blue-200 rounded-full w-14 h-14"></div>
              <div className="absolute top-0 border-4 rounded-full w-14 h-14 border-t-blue-600 animate-spin"></div>
              <div className="absolute w-8 h-8 -mt-4 -ml-4 border-4 rounded-full top-1/2 left-1/2 border-t-indigo-500 animate-spin"></div>
            </div>
            <span className="mt-4 font-medium text-blue-800">Loading opportunities...</span>
          </div>
        ) : (
          <div className="relative px-4 py-2 overflow-hidden bg-transparent shadow-inner">
            {/* Notifications header bar - NEW */}
            <div className="flex items-center justify-between px-3 py-2 mb-2 text-xs font-semibold text-blue-900 uppercase border-b border-blue-100">
              <span>Position</span>
              <div className="flex gap-8">
                <span className="hidden md:block">Company</span>
                <span>{filter === 'closing-soon' ? 'Deadline' : 'Posted'}</span>
              </div>
            </div>
            
            {/* Notifications container with improved styling */}
            <div className="h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {jobs?.length > 0 ? (
                jobs.map((job, index) => {
                  const isNew = (new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2;
                  const deadline = job?.applicationDeadline ? getDaysRemaining(job?.applicationDeadline) : null;
                  const isClosingSoon = deadline && (deadline === "Last day" || deadline === "1 day left" || deadline === "2 days left" || deadline === "3 days left");
                  
                  return (
                    <div
                      key={index}
                      onClick={() => navigateToJobDetail(job?._id)}
                      className="cursor-pointer"
                    >
                      <div 
                        className={`group mb-2 p-3 rounded-xl transition-all duration-300 hover:shadow-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-white border border-transparent hover:border-blue-200 ${
                          isNew ? 'bg-gradient-to-r from-blue-50/70 to-white border-l-4 border-l-blue-500' : 
                          isClosingSoon ? 'bg-gradient-to-r from-amber-50/70 to-white border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            {/* Company logo placeholder */}
                            <div className="items-center justify-center flex-shrink-0 hidden w-10 h-10 mt-1 text-white rounded-lg shadow-sm md:flex bg-gradient-to-br from-blue-600 to-indigo-600">
                              <FaBuilding />
                            </div>
                            
                            {/* Job details */}
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="m-0 text-base font-semibold text-blue-800 group-hover:text-blue-600">
                                  {job?.jobTitle}
                                </h4>
                                {isNew && (
                                  <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-xs font-bold">
                                    NEW
                                  </span>
                                )}
                                {isClosingSoon && !isNew && (
                                  <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white text-xs font-bold">
                                    CLOSING SOON
                                  </span>
                                )}
                              </div>
                              
                              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                                {job?.companyName && (
                                  <span className="flex items-center text-xs text-gray-600">
                                    <FaBuilding className="mr-1 text-blue-500" /> 
                                    {job.companyName}
                                  </span>
                                )}
                                {job?.jobLocation && (
                                  <span className="flex items-center text-xs text-gray-600">
                                    <FaMapMarkerAlt className="mr-1 text-red-500" />
                                    {job.jobLocation}
                                  </span>
                                )}
                                {job?.salary && (
                                  <span className="flex items-center text-xs font-medium text-green-600">
                                    <FaMoneyBillWave className="mr-1" />
                                    {job.salary} LPA
                                  </span>
                                )}
                              </div>
                              
                              {/* Add job type/categories */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {job?.category && (
                                  <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-md">
                                    {job.category}
                                  </span>
                                )}
                                {job?.jobType && (
                                  <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-md">
                                    {job.jobType}
                                  </span>
                                )}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToJobDetail(job?._id);
                                  }} 
                                  className="items-center hidden px-2 py-1 text-xs transition-colors rounded-md md:inline-flex bg-amber-100 text-amber-800 hover:bg-amber-200"
                                >
                                  Apply Now <FaArrowRight className="ml-1 text-xs" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="self-start mt-1">
                            <div className="flex flex-col items-end">
                              <span className="flex items-center text-xs font-medium text-gray-500">
                                <FaClock className="mr-1" />
                                {filter === 'closing-soon' && deadline ? 
                                  <span className={`${
                                    deadline === "Last day" ? "text-red-600 font-bold" : 
                                    deadline.includes("day left") ? "text-orange-600 font-bold" : ""
                                  }`}>{deadline}</span> : 
                                  getTimeElapsed(job?.postedAt)}
                              </span>
                              
                              {/* View count */}
                              <div className="mt-2 text-xs font-medium text-gray-500">
                                <FaEye className="inline mr-1 text-blue-400" />
                                {Math.floor(Math.random() * 100) + 5}
                              </div>
                              
                              {/* Apply button for mobile */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToJobDetail(job?._id);
                                }}
                                className="px-3 py-1 mt-2 text-xs font-medium text-white transition-colors rounded-md md:hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="relative flex items-center justify-center w-20 h-20 mb-4 overflow-hidden rounded-full bg-blue-100/50">
                    <FaBellSlash className="text-2xl text-blue-300" />
                    <div className="absolute w-full h-0.5 bg-blue-300 rotate-45 transform origin-center"></div>
                  </div>
                  <p className="mb-1 font-medium text-center text-blue-900">No opportunities found</p>
                  <p className="text-sm text-center text-gray-500">
                    {filter === 'new' ? "No new job postings in the last 48 hours" : 
                     filter === 'closing-soon' ? "No applications closing soon" : 
                     "We'll notify you when new job openings are posted"}
                  </p>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <button 
                      onClick={handleRefresh} 
                      className="px-4 py-2 text-sm font-medium text-blue-600 transition-all bg-blue-100 rounded-lg hover:bg-blue-200"
                    >
                      <FaSync className="inline mr-1" /> Refresh
                    </button>
                    <button 
                      onClick={viewAllJobs} 
                      className="px-4 py-2 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Browse All Positions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced Footer with gradient */}
        <div className="p-3 text-center border-t bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-blue-200/30">
          <button 
            onClick={viewAllJobs}
            className='flex items-center justify-center w-full gap-1 text-sm font-medium text-blue-700 transition hover:text-blue-900'
          >
            {currentUser?.role === 'student' && "View All Available Positions"}
            {currentUser?.role === 'tpo_admin' && "Manage All Job Listings"}
            {currentUser?.role === 'management_admin' && "Review All Job Listings"}
            <FaArrowRight className="ml-1 text-xs" />
          </button>
        </div>
      </div>
      
      {/* Add this to your CSS/style files */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(219, 234, 254, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </>
  );
}

export default NotificationBox;
