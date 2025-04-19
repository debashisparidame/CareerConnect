import React, { useEffect, useState } from 'react';
import Toast from './Toast';
import ModalBox from './Modal';
import axios from 'axios';
import { BASE_URL } from '../config/backend_url';
import TablePlaceholder from './TablePlaceholder';

function ApproveStudent() {
  document.title = 'CareerConnect | Approve Students';

  // student users store here
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [userEmailToProcess, setUserEmailToProcess] = useState(null);
  const [userToProcess, setUserToProcess] = useState(null);
  const [modalBody, setModalBody] = useState('');
  const [modalBtn, setModalBtn] = useState('');
  const [modalAction, setModalAction] = useState('delete'); // 'delete' or 'approve'

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/student-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response.data) {
        // checking isApprove is false
        const filteredUsers = response.data.studentUsers.filter(element => !element.studentProfile.isApproved);
        setUsers(filteredUsers);
      } else {
        console.warn('Response does not contain studentUsers:', response.data);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
      setToastMessage("Error loading student data");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleDeleteUser = (email, user) => {
    setUserEmailToProcess(email);
    setUserToProcess(user);
    setModalAction('delete');
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/student-delete-user`,
        { email: userEmailToProcess },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      setShowModal(false);
      if (response.data) {
        setToastMessage(response.data.msg);
        setShowToast(true);
        fetchUserDetails();
      }
    } catch (error) {
      console.log("student => confirmDelete ==> ", error);
      setToastMessage("Error deleting student");
      setShowToast(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUserEmailToProcess(null);
    setUserToProcess(null);
  };

  // approve student user method
  const handleApproveStudent = (email, user) => {
    setUserEmailToProcess(email);
    setUserToProcess(user);
    setModalAction('approve');
    setShowModal(true);
  };

  const confirmApproveStudent = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/student-approve`,
        { email: userEmailToProcess },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.data) {
        setToastMessage(response.data.msg || "Student approved successfully");
        setShowToast(true);
        fetchUserDetails(); // Refresh the user list after approval
      }
      setShowModal(false);
    } catch (error) {
      setToastMessage("Error approving student");
      setShowToast(true);
      console.log("handleApproveStudent => AddUersTable.jsx ==> ", error);
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.number && user.number.includes(searchTerm))
    );
  });

  // Function to calculate days ago
  const getDaysAgo = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
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
      <div className="mb-6">
        <h1 className="flex items-center text-2xl font-bold text-gray-800">
          <i className="mr-2 text-blue-600 fas fa-user-check"></i>
          Student Approval Requests
        </h1>
        <p className="text-sm text-gray-600">Review and manage student registration requests</p>
      </div>
      
      {/* Stats Card */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-3 text-blue-600 bg-blue-100 rounded-lg">
              <i className="fas fa-user-clock"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Pending Approvals</p>
              <h3 className="text-xl font-bold text-gray-800">{users.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-green-100 rounded-lg bg-green-50">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-3 text-green-600 bg-green-100 rounded-lg">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Today's Requests</p>
              <h3 className="text-xl font-bold text-gray-800">
                {users.filter(user => getDaysAgo(user.createdAt) === 'Today').length}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-3 text-purple-600 bg-purple-100 rounded-lg">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Most Common Department</p>
              <h3 className="text-lg font-bold text-gray-800">
                {users.length > 0 ? 
                  (() => {
                    const deptCounts = {};
                    users.forEach(user => {
                      if (user.studentProfile?.department) {
                        deptCounts[user.studentProfile.department] = (deptCounts[user.studentProfile.department] || 0) + 1;
                      }
                    });
                    const maxDept = Object.keys(deptCounts).reduce((a, b) => deptCounts[a] > deptCounts[b] ? a : b, '');
                    return maxDept || 'None';
                  })() : 'None'
                }
              </h3>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-amber-100 text-amber-600">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600">Average Year</p>
              <h3 className="text-xl font-bold text-gray-800">
                {users.length > 0 ? 
                  (() => {
                    const sum = users.reduce((total, user) => total + (user.studentProfile?.year || 0), 0);
                    return (sum / users.length).toFixed(1);
                  })() : 'N/A'
                }
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="text-gray-400 fas fa-search"></i>
          </div>
          <input
            type="text"
            className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search students by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Student List */}
      <div className="overflow-hidden bg-white shadow-md rounded-xl">
        {loading ? (
          <div className="p-6">
            <TablePlaceholder />
          </div>
        ) : (
          <>
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="w-12 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Student Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Academic Info
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user, index) => (
                      <tr key={user?._id || index} className="transition-colors hover:bg-blue-50/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 font-medium text-blue-700 bg-blue-100 rounded-full">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-10 h-10 font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-blue-700">
                              {user?.first_name?.charAt(0) || 'S'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user?.first_name || ''} {user?.last_name || ''}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                                  Pending
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user?.studentProfile?.department || 'Not specified'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Year {user?.studentProfile?.year || 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <i className="mr-2 text-gray-400 fas fa-envelope"></i>
                            {user?.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <i className="mr-2 text-gray-400 fas fa-phone"></i>
                            {user?.number || 'Not provided'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div className="flex items-center">
                            <i className="mr-2 text-gray-400 fas fa-clock"></i>
                            {getDaysAgo(user?.createdAt)}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(user?.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleApproveStudent(user.email, user)}
                              className="p-2 text-green-700 transition-colors bg-green-100 rounded-lg hover:bg-green-700 hover:text-white tooltip-wrapper"
                              aria-label="Approve Student"
                            >
                              <i className="fas fa-check"></i>
                              <span className="tooltip">Approve</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.email, user)}
                              className="p-2 text-red-700 transition-colors bg-red-100 rounded-lg hover:bg-red-700 hover:text-white tooltip-wrapper"
                              aria-label="Reject Student"
                            >
                              <i className="fas fa-times"></i>
                              <span className="tooltip">Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                {searchTerm ? (
                  <>
                    <div className="flex items-center justify-center w-16 h-16 mb-3 bg-gray-100 rounded-full">
                      <i className="text-xl text-gray-400 fas fa-search"></i>
                    </div>
                    <p className="text-lg font-medium">No matching students found</p>
                    <p className="text-sm">Try adjusting your search term</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 mt-4 text-blue-700 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-16 h-16 mb-3 bg-green-100 rounded-full">
                      <i className="text-xl text-green-500 fas fa-check-circle"></i>
                    </div>
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm">No pending student approvals</p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ModalBox Component for Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={modalAction === 'delete' ? "Reject Student" : "Approve Student"}
        body={
          <div className="p-4">
            <div className="flex items-center justify-center mb-5">
              <div className={`w-16 h-16 rounded-full ${modalAction === 'delete' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} flex items-center justify-center`}>
                <i className={`text-2xl ${modalAction === 'delete' ? 'fas fa-user-times' : 'fas fa-user-check'}`}></i>
              </div>
            </div>
            
            <div className="mb-4 text-center">
              <h3 className="mb-1 text-lg font-medium text-gray-900">
                {modalAction === 'delete' ? 'Reject Student Registration' : 'Approve Student Registration'}
              </h3>
              <p className="text-sm text-gray-500">
                {userToProcess && (
                  <span>
                    {userToProcess.first_name || ''} {userToProcess.last_name || ''} ({userEmailToProcess})
                  </span>
                )}
              </p>
            </div>
            
            <p className={`text-sm ${modalAction === 'delete' ? 'text-red-600' : 'text-green-600'} mb-2`}>
              {modalAction === 'delete' 
                ? "This action cannot be undone. The student will need to register again."
                : "Once approved, the student will gain access to the platform."}
            </p>
            
            <p className="text-sm text-gray-600">
              Are you sure you want to {modalAction === 'delete' ? 'reject' : 'approve'} this student?
            </p>
          </div>
        }
        btn={modalAction === 'delete' ? "Reject" : "Approve"}
        btnClass={modalAction === 'delete' ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
        confirmAction={modalAction === 'delete' ? confirmDelete : confirmApproveStudent}
      />

      {/* Tooltip Styles */}
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

export default ApproveStudent;
