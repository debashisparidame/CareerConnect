import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalBox from './Modal';
import Toast from './Toast';
import { BASE_URL } from '../config/backend_url';
import TablePlaceholder from './TablePlaceholder';

function ViewAllInternship() {
  document.title = 'CareerConnect | My Internships';
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState({});
  const [dataToParasModal, setDataToParasModal] = useState('');

  // useState for load data
  const [currentUser, setCurrentUser] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Fix 1: Separate authentication and data loading
  useEffect(() => {
    // Get authentication details first
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setCurrentUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        });
      } catch (err) {
        console.log("Error fetching user details:", err);
        setToastMessage("Error loading user profile");
        setShowToast(true);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Fix 2: Separate useEffect for fetching internships
  useEffect(() => {
    if (currentUser?.id) {
      fetchInternships();
    }
  }, [currentUser?.id]);

  const fetchInternships = async () => {
    try {
      if (!currentUser?.id) return;
      
      const response = await axios.get(`${BASE_URL}/student/internship?studentId=${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (response?.data?.internships) {
        setInternships(response.data.internships);
        setFilteredInternships(response.data.internships);
      } else {
        // Fix 3: Handle empty or invalid response
        setInternships([]);
        setFilteredInternships([]);
      }
      
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log("Error fetching internships:", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      } else {
        setToastMessage("Failed to load internships");
        setShowToast(true);
      }
    } finally {
      // Fix 4: Always set loading to false when finished
      setLoading(false);
    }
  };

  // Fix 5: Better search function with error handling
  useEffect(() => {
    try {
      if (searchQuery.trim()) {
        const filtered = internships.filter(internship => 
          internship?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredInternships(filtered);
      } else {
        setFilteredInternships(internships);
      }
    } catch (error) {
      console.error("Error filtering internships:", error);
      setFilteredInternships(internships); // Reset to original on error
    }
  }, [searchQuery, internships]);

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Fix 6: Safe sorting with error handling
    try {
      const sortedInternships = [...filteredInternships].sort((a, b) => {
        if (key === 'companyName') {
          // Fix 7: Handle potentially undefined values
          const aName = a.companyName || '';
          const bName = b.companyName || '';
          return sortConfig.direction === 'ascending' 
            ? aName.localeCompare(bName)
            : bName.localeCompare(aName);
        } else if (key === 'startDate' || key === 'endDate') {
          // Fix 8: Handle invalid dates
          const aDate = a[key] ? new Date(a[key]) : new Date(0);
          const bDate = b[key] ? new Date(b[key]) : new Date(0);
          return sortConfig.direction === 'ascending' 
            ? aDate - bDate
            : bDate - aDate;
        } else if (key === 'monthlyStipend') {
          // Fix 9: Safe parsing of numeric values
          const aStipend = parseFloat(a.monthlyStipend || 0);
          const bStipend = parseFloat(b.monthlyStipend || 0);
          return sortConfig.direction === 'ascending' 
            ? aStipend - bStipend
            : bStipend - aStipend;
        }
        return 0;
      });
      
      setFilteredInternships(sortedInternships);
    } catch (error) {
      console.error("Error sorting internships:", error);
    }
  };

  // Fix 10: Safe status computation
  const getInternshipStatus = (startDate, endDate) => {
    try {
      const now = new Date();
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(0);
      
      if (now < start) return { text: "Upcoming", class: "bg-yellow-100 text-yellow-800" };
      if (now > end) return { text: "Completed", class: "bg-green-100 text-green-800" };
      return { text: "Active", class: "bg-blue-100 text-blue-800" };
    } catch (error) {
      console.error("Error calculating internship status:", error);
      return { text: "Unknown", class: "bg-gray-100 text-gray-800" };
    }
  };

  const getSortIcon = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'ascending' 
        ? <i className="ml-1 text-blue-600 fas fa-sort-up"></i> 
        : <i className="ml-1 text-blue-600 fas fa-sort-down"></i>;
    }
    return <i className="ml-1 text-gray-400 fas fa-sort"></i>;
  };

  const handleDeleteInternship = (internshipId, cmpName) => {
    setDataToParasModal(internshipId);
    setModalBody({
      cmpName: cmpName || "this company",
    });
    setShowModal(true);
  };

  const confirmDelete = async (internshipId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/student/delete-internship`, 
        { internshipId, studentId: currentUser.id }, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      setShowModal(false);
      fetchInternships();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      } else {
        setToastMessage("Error deleting internship");
        setShowToast(true);
      }
      console.log("Error deleting internship:", error);
    }
  };

  const closeModal = () => setShowModal(false);

  // Fix 11: Handle passed state more safely
  useEffect(() => {
    if (location?.state?.showToastPass) {
      setToastMessage(location.state.toastMessagePass || "Operation successful");
      setShowToast(true);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
  }, [location?.state, navigate]);

  // Fix 12: Safe statistics calculations
  const getStats = () => {
    try {
      const now = new Date();
      const completed = internships.filter(i => i.endDate && new Date() > new Date(i.endDate)).length;
      const active = internships.filter(i => i.endDate && new Date() <= new Date(i.endDate)).length;
      
      return {
        total: internships.length,
        completed: completed,
        active: active
      };
    } catch (error) {
      console.error("Error calculating statistics:", error);
      return { total: 0, completed: 0, active: 0 };
    }
  };

  const stats = getStats();

  return (
    <>
      {/* Toast Component */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="mb-6 overflow-hidden bg-white shadow-md rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800">
          <div>
            <h1 className="flex items-center text-xl font-bold text-white">
              <i className="mr-3 fas fa-briefcase"></i>
              My Internships
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              Manage all your internship experiences
            </p>
          </div>

          <button 
            onClick={() => navigate("../student/add-internship")}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 transition-all bg-white rounded-lg shadow-sm hover:bg-blue-50"
          >
            <i className="mr-2 fas fa-plus"></i>
            Add Internship
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="text-gray-400 fas fa-search"></i>
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <div className="mr-4">
              <span className="font-medium">{filteredInternships.length}</span> internships found
            </div>
          </div>
        </div>

        {/* Fix 13: Better loading and error state handling */}
        <div className="p-1 md:p-3">
          {loading ? (
            <TablePlaceholder />
          ) : (
            <div className="overflow-x-auto">
              {filteredInternships.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        No.
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        onClick={() => requestSort('companyName')}
                      >
                        <div className="flex items-center">
                          Company Name {getSortIcon('companyName')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Website
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        onClick={() => requestSort('startDate')}
                      >
                        <div className="flex items-center">
                          Start Date {getSortIcon('startDate')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        onClick={() => requestSort('endDate')}
                      >
                        <div className="flex items-center">
                          End Date {getSortIcon('endDate')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Status
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                        onClick={() => requestSort('monthlyStipend')}
                      >
                        <div className="flex items-center">
                          Stipend {getSortIcon('monthlyStipend')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Fix 14: Safer mapping with optional chaining */}
                    {filteredInternships?.map((internship, index) => {
                      const status = getInternshipStatus(internship?.startDate, internship?.endDate);
                      return (
                        <tr key={internship?._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-blue-700 uppercase bg-blue-100 rounded-full">
                                {internship?.companyName?.[0] || '?'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {internship?.companyName || '-'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {internship?.internshipDuration ? `${internship?.internshipDuration} days` : '-'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {internship?.companyWebsite ? (
                              <a 
                                href={internship?.companyWebsite} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <i className="mr-1 text-xs fas fa-external-link-alt"></i>
                                <span className="text-sm">Visit Site</span>
                              </a>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {internship?.startDate ? new Date(internship?.startDate).toLocaleDateString('en-IN') : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {internship?.endDate ? new Date(internship?.endDate).toLocaleDateString('en-IN') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {internship?.monthlyStipend ? (
                              <div className="text-sm font-medium text-gray-900">
                                ₹{parseFloat(internship?.monthlyStipend).toLocaleString('en-IN')}
                                <span className="text-xs font-normal text-gray-500">/month</span>
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => navigate(`../student/add-internship/${internship._id}`)}
                                className="p-1 text-indigo-600 transition-colors rounded-full hover:text-indigo-900 hover:bg-indigo-50"
                                title="Edit Internship"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteInternship(internship?._id, internship?.companyName)}
                                className="p-1 text-red-600 transition-colors rounded-full hover:text-red-900 hover:bg-red-50"
                                title="Delete Internship"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center rounded-lg bg-gray-50">
                  <div className="mb-4 text-gray-400">
                    <i className="text-5xl fas fa-briefcase"></i>
                  </div>
                  <h3 className="mb-1 text-lg font-medium text-gray-900">No internships found</h3>
                  <p className="max-w-md mx-auto mb-6 text-gray-500">
                    You haven't added any internship experiences yet. Add your internship details to showcase your professional experience.
                  </p>
                  <button 
                    onClick={() => navigate("../student/add-internship")} 
                    className="inline-flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <i className="mr-2 fas fa-plus"></i>
                    Add Your First Internship
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Statistics cards - Fix 15: Only render when data is available */}
      {!loading && filteredInternships.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-4 bg-white border-l-4 border-blue-500 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Total Internships</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-blue-100 rounded-lg">
                <i className="text-lg fas fa-briefcase"></i>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-l-4 border-green-500 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Completed</div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 text-green-600 bg-green-100 rounded-lg">
                <i className="text-lg fas fa-check-circle"></i>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-l-4 border-yellow-500 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Active/Upcoming</div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 text-yellow-600 bg-yellow-100 rounded-lg">
                <i className="text-lg fas fa-hourglass-half"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header="Delete Internship"
        body={
          <div className="p-2">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 mb-2 text-red-600 bg-red-100 rounded-full">
                <i className="text-lg fas fa-exclamation-triangle"></i>
              </div>
            </div>
            <p className="mb-4 text-center">
              Are you sure you want to delete your internship at <span className="font-semibold">{modalBody.cmpName}</span>?
            </p>
            <p className="text-sm text-center text-gray-500">
              This action cannot be undone. All information related to this internship will be permanently removed.
            </p>
          </div>
        }
        btn="Delete Internship"
        confirmAction={() => confirmDelete(dataToParasModal)}
      />
    </>
  );
}

export default ViewAllInternship;
