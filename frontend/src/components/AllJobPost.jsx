import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalBox from './Modal';
import Toast from './Toast';
import TablePlaceholder from './TablePlaceholder';
import { BASE_URL } from '../config/backend_url';

function AllJobPost() {
  document.title = 'CareerConnect | Job Listings';
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);  // Set to null initially
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Toast and Modal states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dataToParasModal, setDataToParasModal] = useState(null);
  const [modalBody, setModalBody] = useState({
    cmpName: '',
    jbTitle: ''
  });

  // Checking for authentication and fetching user details
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
          email: res.data.email,
          role: res.data.role,
        });
        fetchJobs();  // Fetch jobs only after the user info is loaded
      })
      .catch(err => {
        console.log("Error in fetching user details => ", err);
        setToastMessage(err.message || 'Error loading user data');
        setShowToast(true);
      });
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setJobs(response.data.data);
      fetchCompanies(response.data.data);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  };

  const fetchCompanies = async (jobs) => {
    const companyNames = {};
    for (const job of jobs) {
      if (job.company && !companyNames[job.company]) {
        try {
          const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${job.company}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
          companyNames[job.company] = response.data.company.companyName;
        } catch (error) {
          console.log("Error fetching company name => ", error);
        }
      }
    }
    setCompanies(companyNames);
    setLoading(false);
  };

  const handleDeletePost = (jobId, cmpName, jbTitle) => {
    setDataToParasModal(jobId);
    setModalBody({
      cmpName: cmpName,
      jbTitle: jbTitle
    });
    setShowModal(true);
  };

  const confirmDelete = async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/delete-job`, { jobId });
      setShowModal(false);
      fetchJobs();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error deleting job ", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDataToParasModal(null);
  };

  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      navigate('.', { replace: true, state: {} });
    }
    if (!jobs) setLoading(false);
  }, []);

  // Filter and search functionality
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = 
      (companies[job?.company] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.salary?.toString().includes(searchTerm);
      
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') {
      return matchesSearch && new Date(job?.applicationDeadline) >= new Date();
    }
    if (filterStatus === 'expired') {
      return matchesSearch && new Date(job?.applicationDeadline) < new Date();
    }
    if (filterStatus === 'applied') {
      return matchesSearch && job?.applicants?.find(student => student.studentId === currentUser?.id);
    }
    return matchesSearch;
  });

  // Function to get application status
  const getApplicationStatus = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    
    if (deadlineDate < today) {
      return {
        text: 'Expired',
        className: 'bg-red-100 text-red-800 border-red-200'
      };
    }
    
    // Calculate days remaining
    const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 3) {
      return {
        text: `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`,
        className: 'bg-amber-100 text-amber-800 border-amber-200'
      };
    }
    
    return {
      text: 'Active',
      className: 'bg-green-100 text-green-800 border-green-200'
    };
  };

  // For navigation based on role
  const getRolePath = (path) => {
    const rolePaths = {
      'tpo_admin': `../tpo/${path}`,
      'management_admin': `../management/${path}`,
      'superuser': `../admin/${path}`,
      'student': `../student/${path}`
    };
    return rolePaths[currentUser?.role] || '#';
  };

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl">
      {/* Toast Component */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {loading || !currentUser ? (
        <div className="p-6 bg-white shadow-md rounded-xl">
          <TablePlaceholder />
        </div>
      ) : (
        <>
          {/* Page Header */}
          <div className="flex flex-col items-start justify-between mb-6 sm:flex-row sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-800">
                <i className="mr-2 text-blue-600 fas fa-briefcase"></i>
                Job Listings
              </h1>
              <p className="text-sm text-gray-500">
                Browse and manage all available job opportunities
              </p>
            </div>

            {currentUser?.role !== 'student' && (
              <button
                onClick={() => navigate(getRolePath('post-job'))}
                className="flex items-center px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:from-blue-700 hover:to-blue-800"
              >
                <i className="mr-2 fas fa-plus-circle"></i>
                Post New Job
              </button>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-4">
            <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 text-blue-600 bg-blue-100 rounded-lg">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Jobs</p>
                  <h3 className="text-xl font-bold text-gray-800">{jobs?.length || 0}</h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-green-100 rounded-lg bg-green-50">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 text-green-600 bg-green-100 rounded-lg">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Active Jobs</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {jobs?.filter(job => new Date(job?.applicationDeadline) >= new Date()).length || 0}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-lg text-amber-600 bg-amber-100">
                  <i className="fas fa-building"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-600">Companies</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {Object.keys(companies).length || 0}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 text-purple-600 bg-purple-100 rounded-lg">
                  <i className="fas fa-users"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Applicants</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {jobs?.reduce((sum, job) => sum + (job?.applicants?.length || 0), 0)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="text-gray-400 fas fa-search"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search jobs by title, company or salary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 transition-all border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Jobs
                </button>
                <button 
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i className="mr-1 fas fa-check-circle"></i>
                  Active
                </button>
                <button 
                  onClick={() => setFilterStatus('expired')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === 'expired' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i className="mr-1 fas fa-clock"></i>
                  Expired
                </button>
                {currentUser?.role === 'student' && (
                  <button 
                    onClick={() => setFilterStatus('applied')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      filterStatus === 'applied' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <i className="mr-1 fas fa-file-signature"></i>
                    Applied
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="overflow-hidden bg-white border border-gray-200 shadow-md rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" style={{ width: '5%' }}>
                      Sr.
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" style={{ width: '22%' }}>
                      Company & Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" style={{ width: '15%' }}>
                      Salary
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" style={{ width: '15%' }}>
                      Application Deadline
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" style={{ width: '15%' }}>
                      Applicants
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase" style={{ width: '13%' }}>
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase" style={{ width: '15%' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs?.length > 0 ? (
                    filteredJobs.map((job, index) => {
                      const isMatched = job?.applicants?.find(student => student.studentId === currentUser?.id);
                      const status = getApplicationStatus(job?.applicationDeadline);
                      
                      return (
                        <tr 
                          key={job?._id} 
                          className={`hover:bg-blue-50 transition-colors ${
                            isMatched ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 text-blue-700 bg-blue-100 rounded-full">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-700">
                                {companies[job?.company] ? companies[job?.company].charAt(0).toUpperCase() : '?'}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {companies[job?.company] || 'Unknown Company'}
                                </div>
                                <div className="text-xs font-medium text-blue-600">
                                  {job?.jobTitle}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              <i className="mr-1 text-green-600 fas fa-rupee-sign"></i>
                              {job?.salary}
                              <div className="text-xs text-gray-500">per annum</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              <i className="mr-1 text-gray-400 fas fa-calendar-day"></i>
                              {new Date(job?.applicationDeadline).toLocaleDateString('en-In', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex mr-2 -space-x-2">
                                {[...Array(Math.min(3, job?.applicants?.length || 0))].map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-center text-xs font-medium text-gray-600 bg-gray-200 border-2 border-white rounded-full w-7 h-7"
                                  >
                                    {i + 1}
                                  </div>
                                ))}
                              </div>
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                {job?.applicants?.length || 0} applicant{job?.applicants?.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                              <span className={`w-2 h-2 mr-1 rounded-full ${
                                status.text === 'Active' ? 'bg-green-500' :
                                status.text === 'Expired' ? 'bg-red-500' : 'bg-amber-500'
                              }`}></span>
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center space-x-3">
                              {/* View button */}
                              <button 
                                onClick={() => navigate(getRolePath(`job/${job._id}`))}
                                className="p-2 text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 tooltip-wrapper"
                              >
                                <i className="fas fa-eye"></i>
                                <span className="tooltip">View Details</span>
                              </button>
                              
                              {currentUser.role !== 'student' && (
                                <>
                                  {/* Edit button */}
                                  <button 
                                    onClick={() => navigate(getRolePath(`post-job/${job._id}`))}
                                    className="p-2 text-green-600 transition-colors bg-green-100 rounded-lg hover:bg-green-200 tooltip-wrapper"
                                  >
                                    <i className="fas fa-edit"></i>
                                    <span className="tooltip">Edit Job</span>
                                  </button>
                                  
                                  {/* Delete button */}
                                  <button 
                                    onClick={() => handleDeletePost(job?._id, companies[job?.company], job?.jobTitle)}
                                    className="p-2 text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200 tooltip-wrapper"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                    <span className="tooltip">Delete Job</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          {searchTerm || filterStatus !== 'all' ? (
                            <>
                              <div className="flex items-center justify-center w-16 h-16 mb-4 text-gray-400 bg-gray-100 rounded-full">
                                <i className="text-2xl fas fa-search"></i>
                              </div>
                              <p className="mb-1 text-lg font-medium text-gray-800">No matching jobs found</p>
                              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                              <button 
                                onClick={() => {setSearchTerm(''); setFilterStatus('all');}}
                                className="px-4 py-2 mt-4 text-sm text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200"
                              >
                                Clear all filters
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-center w-16 h-16 mb-4 text-gray-400 bg-gray-100 rounded-full">
                                <i className="text-2xl fas fa-briefcase"></i>
                              </div>
                              <p className="mb-1 text-lg font-medium text-gray-800">No job listings found</p>
                              <p className="mb-4 text-sm text-gray-500">
                                {currentUser?.role !== 'student' 
                                  ? 'Click the button below to post your first job' 
                                  : 'Jobs will appear here once they are posted'}
                              </p>
                              {currentUser?.role !== 'student' && (
                                <button
                                  onClick={() => navigate(getRolePath('post-job'))}
                                  className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                                >
                                  <i className="mr-2 fas fa-plus"></i>
                                  Post New Job
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Box for Confirm Delete */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header="Delete Job Confirmation"
        body={
          <div className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-red-500 bg-red-100 rounded-full">
              <i className="text-xl fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">Delete Job Listing</h3>
            <p className="text-gray-500">
              Are you sure you want to delete the job listing for <span className="font-semibold">{modalBody.jbTitle}</span> at <span className="font-semibold">{modalBody.cmpName}</span>?
            </p>
            <p className="mt-2 text-sm text-red-600">
              This action cannot be undone and will remove all applications.
            </p>
          </div>
        }
        btn="Delete"
        confirmAction={() => confirmDelete(dataToParasModal)}
      />

      {/* Custom Tooltip Styles */}
      <style jsx>{`
        .tooltip-wrapper {
          position: relative;
        }
        
        .tooltip {
          visibility: hidden;
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: white;
          text-align: center;
          border-radius: 4px;
          padding: 5px 8px;
          margin-bottom: 5px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s, visibility 0.2s;
          z-index: 10;
        }
        
        .tooltip-wrapper:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default AllJobPost;
