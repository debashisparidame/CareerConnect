import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalBox from './Modal';
import Toast from './Toast';
import { BASE_URL } from '../config/backend_url';
import TablePlaceholder from './TablePlaceholder';

function AllCompany() {
  document.title = 'CareerConnect | All Company';

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [companys, setCompanys] = useState({});
  const [jobs, setJobs] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const [modalBody, setModalBody] = useState({
    companyName: "",
    companyId: ""
  });

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  // stores only user role
  const [currentUser, setCurrentUser] = useState('');

  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response?.data) setCurrentUser(response?.data?.role);
    } catch (error) {
      console.log("Account.jsx => ", error);
    }
  }

  const fetchCompanys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/company/company-detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCompanys(response.data.companys);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  const handleDeleteCompany = (companyName, companyId) => {
    setModalBody({ companyId: companyId, companyName: companyName });
    setShowModal(true);
  }

  const confirmDelete = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/company/delete-company`,
        { companyId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        },
      );

      setShowModal(false);
      fetchCompanys();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error deleting job ", error);
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setJobs(response.data.data);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  const closeModal = () => setShowModal(false);

  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
    fetchCurrentUserData();
    fetchCompanys();
    fetchJobs();
  }, []);

  // Filtering companies based on search term
  const filteredCompanies = Array.isArray(companys) 
    ? companys.filter(company => 
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyDifficulty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedCompanies = () => {
    if (!sortConfig.key) return filteredCompanies;
    
    return [...filteredCompanies].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedCompanies = getSortedCompanies();

  // Helper function to get the jobs count for a company
  const getJobsCount = (companyId) => {
    if (!Array.isArray(jobs)) return 0;
    return jobs.filter(job => job?.company === companyId)?.length || 0;
  };

  // Create navigation path based on user role
  const getEditPath = (companyId) => {
    if (currentUser === 'tpo_admin') return `../tpo/add-company/${companyId}`;
    if (currentUser === 'management_admin') return `../management/add-company/${companyId}`;
    if (currentUser === 'superuser') return `../admin/add-company/${companyId}`;
    return '#';
  };

  // Function to navigate to add company page
  const navigateToAddCompany = () => {
    if (currentUser === 'tpo_admin') navigate(`../tpo/add-company`);
    else if (currentUser === 'management_admin') navigate(`../management/add-company`);
    else if (currentUser === 'superuser') navigate(`../admin/add-company`);
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

      {/* Page Header */}
      <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">
            <i className="mr-2 text-blue-600 fas fa-building"></i>
            Companies Directory
          </h1>
          <p className="text-sm text-gray-600">
            View and manage all registered companies
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 md:w-auto md:flex-row">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 transition-all bg-white border border-gray-200 rounded-lg shadow-sm md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <i className="text-gray-400 fas fa-search"></i>
            </div>
          </div>

          {/* Add Company Button */}
          <button
            onClick={navigateToAddCompany}
            className="flex items-center justify-center px-4 py-2 font-medium text-white transition-all bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <i className="mr-2 fas fa-plus"></i>
            Add Company
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 bg-white shadow-md rounded-xl">
          <TablePlaceholder />
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow-md rounded-xl">
          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 text-blue-600 bg-blue-100 rounded-lg">
                  <i className="fas fa-building"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Companies</p>
                  <h3 className="text-xl font-bold text-gray-800">{Array.isArray(companys) ? companys.length : 0}</h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-green-100 rounded-lg bg-green-50">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 text-green-600 bg-green-100 rounded-lg">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Total Job Postings</p>
                  <h3 className="text-xl font-bold text-gray-800">{Array.isArray(jobs) ? jobs.length : 0}</h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-lg text-amber-600 bg-amber-100">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-600">Locations</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {Array.isArray(companys) 
                      ? new Set(companys.map(c => c.companyLocation)).size 
                      : 0}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-4 text-purple-600 bg-purple-100 rounded-lg">
                  <i className="fas fa-chart-simple"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg. Difficulty</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {Array.isArray(companys) && companys.length > 0
                      ? (() => {
                          const diffMap = { 'Easy': 1, 'Moderate': 2, 'Hard': 3 };
                          const avgNum = companys.reduce((sum, c) => sum + (diffMap[c.companyDifficulty] || 0), 0) / companys.length;
                          if (avgNum <= 1.5) return 'Easy';
                          if (avgNum <= 2.5) return 'Moderate';
                          return 'Hard';
                        })()
                      : 'N/A'}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            {sortedCompanies.length > 0 ? (
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      style={{ width: '5%' }}
                    >
                      Sr. No.
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                      style={{ width: '20%' }}
                      onClick={() => requestSort('companyName')}
                    >
                      <div className="flex items-center">
                        Company Name
                        {sortConfig.key === 'companyName' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? 
                              <i className="fas fa-sort-up"></i> : 
                              <i className="fas fa-sort-down"></i>
                            }
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      style={{ width: '20%' }}
                    >
                      Website
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                      style={{ width: '15%' }}
                      onClick={() => requestSort('companyLocation')}
                    >
                      <div className="flex items-center">
                        Location
                        {sortConfig.key === 'companyLocation' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? 
                              <i className="fas fa-sort-up"></i> : 
                              <i className="fas fa-sort-down"></i>
                            }
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                      style={{ width: '15%' }}
                      onClick={() => requestSort('companyDifficulty')}
                    >
                      <div className="flex items-center">
                        Difficulty
                        {sortConfig.key === 'companyDifficulty' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? 
                              <i className="fas fa-sort-up"></i> : 
                              <i className="fas fa-sort-down"></i>
                            }
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      style={{ width: '10%' }}
                    >
                      Jobs
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
                      style={{ width: '15%' }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedCompanies.map((company, index) => (
                    <tr key={company?._id} className="transition-colors hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 text-blue-700 bg-blue-100 rounded-full">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-700">
                            {company?.companyName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company?.companyName}</div>
                            <div className="text-xs text-gray-500">ID: {company?._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={company?.companyWebsite}
                          target="_blank"
                          className="flex items-center text-sm text-blue-600 transition-colors hover:text-blue-800"
                          rel="noopener noreferrer"
                        >
                          <i className="mr-2 fas fa-globe"></i>
                          <span className="max-w-xs truncate">
                            {company?.companyWebsite.replace(/^https?:\/\/(www\.)?/i, '')}
                          </span>
                          <i className="ml-1 text-xs fas fa-external-link-alt"></i>
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="mr-2 text-gray-400 fas fa-map-marker-alt"></i>
                          {company?.companyLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-start">
                          {company?.companyDifficulty === "Easy" && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <i className="mr-1 fas fa-check-circle"></i>
                              {company?.companyDifficulty}
                            </span>
                          )}
                          {company?.companyDifficulty === "Moderate" && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <i className="mr-1 fas fa-dot-circle"></i>
                              {company?.companyDifficulty}
                            </span>
                          )}
                          {company?.companyDifficulty === "Hard" && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <i className="mr-1 fas fa-exclamation-circle"></i>
                              {company?.companyDifficulty}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                          <i className="mr-1 fas fa-briefcase"></i>
                          {getJobsCount(company?._id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-3">
                          <button 
                            onClick={() => navigate(getEditPath(company?._id))}
                            className="p-2 text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 tooltip-wrapper"
                          >
                            <i className="fas fa-edit"></i>
                            <span className="tooltip">Edit Company</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteCompany(company?.companyName, company?._id)}
                            className="p-2 text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200 tooltip-wrapper"
                          >
                            <i className="fas fa-trash-alt"></i>
                            <span className="tooltip">Delete Company</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                {searchTerm ? (
                  <>
                    <div className="flex items-center justify-center w-16 h-16 mb-4 text-gray-400 bg-gray-100 rounded-full">
                      <i className="text-2xl fas fa-search"></i>
                    </div>
                    <p className="mb-1 text-lg font-medium text-gray-800">No companies match your search</p>
                    <p className="text-sm text-gray-500">Try adjusting your search term</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-16 h-16 mb-4 text-gray-400 bg-gray-100 rounded-full">
                      <i className="text-2xl fas fa-building"></i>
                    </div>
                    <p className="mb-1 text-lg font-medium text-gray-800">No companies found</p>
                    <p className="mb-4 text-sm text-gray-500">Click the button below to add your first company</p>
                    <button
                      onClick={navigateToAddCompany}
                      className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                    >
                      <i className="mr-2 fas fa-plus"></i>
                      Add Company
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Pagination could be added here */}
        </div>
      )}

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to delete company ${modalBody.companyName}?`}
        btn={"Delete"}
        confirmAction={() => confirmDelete(modalBody.companyId)}
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

export default AllCompany;
