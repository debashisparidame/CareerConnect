import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config/backend_url';
import { FaBuilding, FaInfoCircle, FaFilter, FaSearch, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaBriefcase, FaClock } from 'react-icons/fa';
import { TbStatusChange } from "react-icons/tb";

function MyApplied() {
  document.title = 'CareerConnect | My Applied Jobs';
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, selected, rejected
  const [sortBy, setSortBy] = useState('appliedAt'); // appliedAt, deadline, company, salary
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc

  // useState for load data
  const [currentUser, setCurrentUser] = useState({});
  const [jobs, setJobs] = useState([]);

  // checking for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("MyApplied.jsx => ", err);
      });
  }, []);

  const fetchMyJob = async () => {
    if (!currentUser?.id) return;
    try {
      const response = await axios.get(`${BASE_URL}/tpo/myjob/${currentUser?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response?.data)
        setJobs(response?.data);
    } catch (error) {
      console.log("Error While Fetching Error => ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJob();
  }, [currentUser?.id]);

  // Filter and sort jobs
  const filteredJobs = jobs?.filter(job => {
    // Apply status filter
    if (filter !== 'all' && job.status !== filter) {
      return false;
    }
    
    // Apply search term
    return (
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];
  
  // Apply sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'appliedAt') {
      return sortDirection === 'asc' 
        ? new Date(a.appliedAt) - new Date(b.appliedAt)
        : new Date(b.appliedAt) - new Date(a.appliedAt);
    }
    if (sortBy === 'deadline') {
      return sortDirection === 'asc'
        ? new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
        : new Date(b.applicationDeadline) - new Date(a.applicationDeadline);
    }
    if (sortBy === 'company') {
      return sortDirection === 'asc'
        ? a.companyName.localeCompare(b.companyName)
        : b.companyName.localeCompare(a.companyName);
    }
    if (sortBy === 'salary') {
      const aSalary = parseFloat(a.salary) || 0;
      const bSalary = parseFloat(b.salary) || 0;
      return sortDirection === 'asc' ? aSalary - bSalary : bSalary - aSalary;
    }
    return 0;
  });

  // Function to handle sort changes
  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  // Function to get status style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'selected':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString.split('T')[0]);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="px-4 py-6 bg-gray-50 min-h-[90vh]">
      <div className="max-w-6xl mx-auto">
        {/* Header with more compact styling */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">My Job Applications</h1>
          <p className="mt-1 text-sm text-gray-600">Track all your job applications and their statuses</p>
        </div>

        {/* Search and Filter Controls - more compact grid */}
        <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by company or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full py-2 pl-10 pr-10 text-sm border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>

          {/* Stats Summary - More compact */}
          <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-600">Total:</span>
              <span className="ml-1.5 text-base font-bold text-blue-600">{jobs.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 mr-1 bg-yellow-400 rounded-full"></div>
                <span className="text-xs">{jobs.filter(job => job.status === 'pending').length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 mr-1 bg-green-400 rounded-full"></div>
                <span className="text-xs">{jobs.filter(job => job.status === 'selected').length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 mr-1 bg-red-400 rounded-full"></div>
                <span className="text-xs">{jobs.filter(job => job.status === 'rejected').length}</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-blue-200 rounded-full border-3 border-t-blue-600 animate-spin"></div>
            <p className="mt-3 text-base font-medium text-blue-600">Loading your applications...</p>
          </div>
        ) : (
          <>
            {sortedJobs.length > 0 ? (
              <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                {/* Table Header - More compact */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                        <th className="px-3 py-2 text-center">#</th>
                        <th 
                          className="px-3 py-2 cursor-pointer hover:text-blue-600"
                          onClick={() => handleSort('company')}
                        >
                          <div className="flex items-center">
                            <FaBuilding className="mr-1 text-xs" />
                            Company
                            {sortBy === 'company' && (
                              <span className="ml-1 text-xs">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="px-3 py-2">
                          <div className="flex items-center">
                            <FaBriefcase className="mr-1 text-xs" />
                            Position
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 cursor-pointer hover:text-blue-600"
                          onClick={() => handleSort('salary')}
                        >
                          <div className="flex items-center">
                            <FaMoneyBillWave className="mr-1 text-xs" />
                            CTC
                            {sortBy === 'salary' && (
                              <span className="ml-1 text-xs">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 cursor-pointer hover:text-blue-600"
                          onClick={() => handleSort('appliedAt')}
                        >
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1 text-xs" />
                            Applied
                            {sortBy === 'appliedAt' && (
                              <span className="ml-1 text-xs">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-3 py-2 cursor-pointer hover:text-blue-600"
                          onClick={() => handleSort('deadline')}
                        >
                          <div className="flex items-center">
                            <FaClock className="mr-1 text-xs" />
                            Deadline
                            {sortBy === 'deadline' && (
                              <span className="ml-1 text-xs">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="px-3 py-2">
                          <div className="flex items-center">
                            <TbStatusChange className="mr-1 text-xs" />
                            Status
                          </div>
                        </th>
                        <th className="hidden px-3 py-2 sm:table-cell">
                          <div className="flex items-center">
                            <FaUsers className="mr-1 text-xs" />
                            Applicants
                          </div>
                        </th>
                        <th className="px-3 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedJobs.map((job, index) => (
                        <tr 
                          key={index} 
                          className="transition-colors hover:bg-blue-50"
                        >
                          <td className="px-3 py-2 text-xs text-center text-gray-900 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-100 rounded">
                                <span className="text-xs font-medium text-blue-800">
                                  {job.companyName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-2">
                                <p className="text-xs font-medium text-gray-900">{job.companyName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs font-medium text-gray-900">{job.jobTitle}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {job.salary ? (
                              <div className="text-xs text-gray-900">
                                <span className="font-medium text-green-600">{job.salary} LPA</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(job.appliedAt)}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(job.applicationDeadline)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusStyle(job.status)}`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </td>
                          <td className="hidden px-3 py-2 text-xs text-gray-500 whitespace-nowrap sm:table-cell">
                            <div className="flex items-center">
                              <FaUsers className="mr-1 text-blue-500" size={10} />
                              <span>{job.numberOfApplicants}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs font-medium text-center whitespace-nowrap">
                            <Link 
                              to={`/student/job/${job.jobId}`}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                            >
                              <FaInfoCircle className="mr-1" size={10} /> Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm">
                <div className="p-4 mb-3 text-blue-500 bg-blue-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mb-1 text-lg font-medium text-gray-800">No applications found</h3>
                <p className="mb-4 text-sm text-gray-500">
                  {filter !== 'all'
                    ? `You don't have any ${filter} job applications.`
                    : searchTerm
                      ? `No applications match your search "${searchTerm}"`
                      : "You haven't applied to any jobs yet."}
                </p>
                <Link 
                  to="/student/job-listings" 
                  className="px-4 py-2 text-xs font-medium text-white transition-all bg-blue-600 rounded hover:bg-blue-700"
                >
                  Explore Job Listings
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyApplied;
