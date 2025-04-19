import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, FloatingLabel } from 'react-bootstrap';
import TablePlaceholder from './TablePlaceholder';
import { BASE_URL } from '../config/backend_url';
import { GrFormAdd } from 'react-icons/gr';

function AddUserTable({
  users,
  loading,
  handleDeleteUser,
  formOpen,
  setFormOpen,
  data,
  handleDataChange,
  handleSubmit,
  userToAdd,
  handleApproveStudent
}) {
  // useState for load data
  const [currentUser, setCurrentUser] = useState({
    name: 'Not Found',
    email: 'Not Found',
    profile: 'Profile Img',
  });

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
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Table Header with title and add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center text-xl font-bold text-gray-800">
            <i className="mr-2 text-blue-500 fas fa-users"></i>
            {userToAdd === 'approve-student' ? 'Student Approvals' : `Manage ${userToAdd || 'Users'}`}
          </h2>
          <p className="text-sm text-gray-500">
            {userToAdd === 'approve-student' 
              ? 'Review and approve new student registrations'
              : `View and manage ${userToAdd || 'user'} accounts`}
          </p>
        </div>
        
        {userToAdd !== "approve-student" && (
          <button 
            onClick={() => setFormOpen(true)}
            className="flex items-center px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:from-blue-700 hover:to-blue-800"
          >
            <i className="mr-2 fa-solid fa-person-circle-plus"></i>
            Add {userToAdd}
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-md rounded-xl">
        {loading ? (
          <div className="p-4">
            <TablePlaceholder />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Sr. No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr 
                      key={user?.email} 
                      className="transition-colors hover:bg-blue-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="flex items-center justify-center text-sm text-blue-700 bg-blue-100 rounded-full w-7 h-7">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user && (
                          <Link
                            to={
                              currentUser.role === "superuser"
                                ? `/admin/user/${user?._id}`
                                : currentUser.role === "management_admin"
                                  ? `/management/user/${user?._id}`
                                  : currentUser.role === "tpo_admin"
                                    ? `/tpo/user/${user?._id}`
                                    : "#"
                            }
                            className="flex items-center group"
                          >
                            <div className="flex items-center justify-center mr-3 font-medium text-white rounded-full w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700">
                              {user?.first_name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                                {user?.first_name + " "}
                                {user?.last_name && user?.last_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {userToAdd === 'student' ? 'Student' : userToAdd === 'tpo' ? 'TPO Admin' : 'User'}
                              </div>
                            </div>
                          </Link>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`mailto:${user.email}`} className="flex items-center text-gray-600 transition-colors hover:text-blue-600">
                          <i className="mr-2 text-gray-400 far fa-envelope"></i>
                          <span className="text-sm">{user.email}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="mr-2 text-gray-400 fas fa-phone"></i>
                          {user.number || 'Not provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                            <i className="mr-1 text-gray-500 far fa-calendar"></i>
                            {new Date(user.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {userToAdd === 'approve-student' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveStudent(user.email)}
                              className="p-2 text-green-600 transition-colors bg-green-100 rounded-lg hover:bg-green-600 hover:text-white tooltip-wrapper"
                            >
                              <i className="fas fa-check"></i>
                              <span className="tooltip">Approve User</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.email)}
                              className="p-2 text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-600 hover:text-white tooltip-wrapper"
                            >
                              <i className="fas fa-times"></i>
                              <span className="tooltip">Reject User</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(user.email)}
                            className="p-2 text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-600 hover:text-white tooltip-wrapper"
                          >
                            <i className="fas fa-trash-alt"></i>
                            <span className="tooltip">Delete User</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 mb-3 bg-gray-100 rounded-full">
                          <i className="text-xl text-gray-400 fas fa-users"></i>
                        </div>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm text-gray-400">
                          {userToAdd === 'approve-student' 
                            ? 'There are no pending student approvals at the moment'
                            : 'Add a new user to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div className="w-full max-w-md overflow-hidden transition-all transform bg-white shadow-2xl rounded-xl animate-modal-appear">
            <div className="p-4 text-white bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center text-lg font-semibold">
                  <i className="mr-2 fas fa-user-plus"></i>
                  Add New {userToAdd}
                </h3>
                <button 
                  onClick={() => setFormOpen(false)}
                  className="flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full bg-white/20 hover:bg-white/30"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <Form className="space-y-4" onSubmit={handleSubmit}>
                <FloatingLabel label="Full Name" className="font-medium text-gray-600">
                  <Form.Control 
                    type="text" 
                    autoComplete="name" 
                    placeholder="Full Name" 
                    name="first_name" 
                    value={data.first_name || ''} 
                    onChange={handleDataChange}
                    className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required 
                  />
                </FloatingLabel>
                
                <FloatingLabel label="Email Address" className="font-medium text-gray-600">
                  <Form.Control 
                    type="email" 
                    autoComplete="email" 
                    placeholder="Email" 
                    name="email" 
                    value={data.email || ''} 
                    onChange={handleDataChange}
                    className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required 
                  />
                </FloatingLabel>
                
                <FloatingLabel label="Phone Number" className="font-medium text-gray-600">
                  <Form.Control 
                    type="number" 
                    autoComplete="tel" 
                    placeholder="Phone Number" 
                    name="number" 
                    value={data.number || ''} 
                    onChange={handleDataChange}
                    className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required 
                  />
                </FloatingLabel>
                
                <FloatingLabel label="Initial Password" className="font-medium text-gray-600">
                  <Form.Control 
                    type="password" 
                    autoComplete="new-password" 
                    placeholder="Enter Initial Password" 
                    name="password" 
                    value={data.password || ''} 
                    onChange={handleDataChange}
                    className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required 
                  />
                </FloatingLabel>
                
                <div className="flex items-center justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={() => setFormOpen(false)}
                    className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="submit" 
                    className="flex items-center px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                  >
                    <i className="mr-2 fas fa-user-plus"></i>
                    Create Account
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}

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
        }
        
        .tooltip-wrapper:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
        
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-modal-appear {
          animation: modalAppear 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AddUserTable;