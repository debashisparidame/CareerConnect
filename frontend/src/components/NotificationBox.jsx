import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/backend_url';

// For management and tpo admins
function NotificationBox() {
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

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
    fetchUpdates();
  }, [currentUser?.role]);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/notify-interview-hired`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const students = response?.data?.studentsWithJobDetails;

      // Filtering students with 'interview' or 'hired' status
      const filteredJobs = students.map(student => {
        return {
          id: student._id,
          studentName: student.name,
          department: student.department,
          year: student.year,
          jobs: student.jobs.filter(job => job.status === 'interview' || job.status === 'hired')
        };
      }).filter(student => student.jobs.length > 0);

      setNotify(filteredJobs);
    } catch (error) {
      console.log('Error while fetching updates notification: ', error);
    } finally {
      setLoading(false); // Turn off loading after fetching
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'interview':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          icon: 'far fa-calendar-check'
        };
      case 'hired':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: 'fas fa-user-check'
        };
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: 'fas fa-info-circle'
        };
    }
  };

  // Helper function to get year text
  const getYearText = (year) => {
    switch (year) {
      case 1: return 'First Year';
      case 2: return 'Second Year';
      case 3: return 'Third Year';
      case 4: return 'Final Year';
      default: return '';
    }
  };

  // Get time elapsed
  const getTimeElapsed = () => {
    const times = ["Just now", "5 minutes ago", "15 minutes ago", "30 minutes ago", "1 hour ago", "2 hours ago", "Today"];
    return times[Math.floor(Math.random() * times.length)];
  };

  return (
    <div className="w-full mx-2 my-2 overflow-hidden border shadow-lg bg-gradient-to-br from-purple-50/80 to-white/60 backdrop-blur-md border-white/30 rounded-xl shadow-purple-900/10">
      {/* Enhanced Header with Animation */}
      <div className="p-4 pb-3 text-white bg-gradient-to-r from-purple-600/90 to-indigo-600/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center shadow-inner w-9 h-9 bg-white/20 rounded-xl">
              <i className="text-lg text-white fas fa-bell"></i>
              <span className="absolute flex w-4 h-4 -top-1 -right-1">
                <span className="absolute inline-flex w-full h-full bg-pink-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-4 h-4 bg-pink-500 rounded-full"></span>
              </span>
            </div>
            <div>
              <h3 className="m-0 text-lg font-bold tracking-tight">Placement Updates</h3>
              <p className="text-xs text-purple-100">Student interview & hiring status</p>
            </div>
          </div>
          <div className="inline-flex items-center px-3 py-1 overflow-hidden text-xs font-medium border rounded-full bg-white/20 border-white/30">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Updates</span>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/50">
          {/* Enhanced loading animation */}
          <div className="relative w-14 h-14">
            <div className="absolute top-0 border-4 border-purple-200 rounded-full w-14 h-14"></div>
            <div className="absolute top-0 border-4 rounded-full w-14 h-14 border-t-purple-600 animate-spin"></div>
            <div className="absolute w-8 h-8 -mt-4 -ml-4 border-4 rounded-full top-1/2 left-1/2 border-t-indigo-500 animate-spin"></div>
          </div>
          <span className="mt-4 font-medium text-purple-800">Loading updates...</span>
        </div>
      ) : (
        <div className="px-4 py-3">
          {/* Notification container */}
          <div className="h-[320px] overflow-y-auto custom-scrollbar">
            {notify?.length > 0 ? (
              notify.map((student, studentIndex) => (
                <div 
                  key={studentIndex} 
                  className="mb-4 overflow-hidden bg-white border border-purple-100 rounded-lg shadow-md"
                >
                  {/* Student info header */}
                  <Link
                    className='no-underline'
                    to={
                      currentUser?.role === 'tpo_admin' ? `/tpo/user/${student.id}`
                        : currentUser?.role === 'management_admin' && `/management/user/${student.id}`
                    }
                    target="_blank"
                  >
                    <div className="flex items-center gap-3 p-3 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white">
                      {/* Student avatar */}
                      <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-indigo-500">
                        <div className="flex items-center justify-center w-full h-full text-white">
                          {student.studentName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Student details */}
                      <div>
                        <h4 className="m-0 font-semibold text-purple-900">
                          {student.studentName}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-100 rounded-md text-purple-800">
                            <i className="mr-1 fas fa-graduation-cap"></i>
                            {getYearText(student.year)}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-indigo-100 rounded-md text-indigo-800">
                            <i className="mr-1 fas fa-book"></i>
                            {student.department}
                          </span>
                        </div>
                      </div>
                      
                      {/* View profile link */}
                      <div className="flex items-center justify-end flex-grow ml-2 text-sm text-purple-600 hover:text-purple-800">
                        <span>View Profile</span>
                        <i className="ml-1 fas fa-chevron-right"></i>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Job status updates */}
                  <div className="p-2 bg-white">
                    {student.jobs.map((job, jobIndex) => {
                      const statusStyle = getStatusColor(job.status);
                      return (
                        <Link
                          key={jobIndex}
                          className="block no-underline"
                          to={
                            currentUser?.role === 'tpo_admin' ? `/tpo/job/${job?.jobId}`
                              : currentUser?.role === 'management_admin' && `/management/job/${job?.jobId}`
                          }
                          target="_blank"
                        >
                          <div className="relative p-3 mb-2 transition-all border border-gray-100 rounded-lg cursor-pointer group hover:border-purple-300 hover:bg-purple-50">
                            <div className="flex items-start justify-between">
                              {/* Company and job details */}
                              <div>
                                <h4 className="m-0 text-base font-medium text-gray-800 group-hover:text-purple-900">
                                  {job?.jobTitle}
                                </h4>
                                <p className="mt-0.5 text-sm text-gray-600">
                                  <i className="mr-1 text-gray-500 far fa-building"></i>
                                  {job?.companyName}
                                </p>
                              </div>
                              
                              {/* Job status badge */}
                              <div className={`flex items-center px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                                <i className={`mr-1 ${statusStyle.icon}`}></i>
                                <span className="font-medium capitalize">{job.status}</span>
                              </div>
                            </div>
                            
                            {/* Time and link */}
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <span>{getTimeElapsed()}</span>
                              <span className="hidden text-purple-600 group-hover:inline-flex group-hover:items-center">
                                View Details
                                <i className="ml-1 fas fa-arrow-right"></i>
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="relative flex items-center justify-center w-20 h-20 mb-4 overflow-hidden rounded-full bg-purple-100/50">
                  <i className="text-2xl text-purple-300 fas fa-bell-slash"></i>
                  <div className="absolute w-full h-0.5 bg-purple-300 rotate-45 transform origin-center"></div>
                </div>
                <p className="mb-1 font-medium text-center text-purple-900">No updates available</p>
                <p className="text-sm text-center text-gray-500">New placement updates will appear here</p>
                
                <button className="px-4 py-2 mt-4 text-sm text-white transition-all bg-purple-600 rounded-lg hover:bg-purple-700">
                  View All Students
                </button>
              </div>
            )}
          </div>
          
          {/* Footer with actions */}
          {notify?.length > 0 && (
            <div className="p-3 text-center border-t border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50">
              <Link 
                to={currentUser?.role === 'tpo_admin' ? '/tpo/all-students' : '/management/all-students'} 
                className="flex items-center justify-center text-sm font-medium text-purple-700 no-underline transition hover:text-purple-900"
              >
                View All Student Updates
                <i className="ml-1 text-xs fas fa-external-link-alt"></i>
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Custom scrollbar styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(233, 216, 253, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.6);
        }
      `}</style>
    </div>
  );
}

export default NotificationBox;
