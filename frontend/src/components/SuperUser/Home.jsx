import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config/backend_url';

function Home() {
  document.title = 'CareerConnect | Admin Dashboard';

  const [countUsers, setCountUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/all-users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setCountUsers(response.data);
      } catch (error) {
        console.log("Home.jsx => ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container px-4 py-8 mx-auto">
        {/* Dashboard Header */}
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold text-white">Administrator Dashboard</h1>
          <div className="flex items-center text-gray-400">
            <i className="mr-2 fas fa-shield-alt"></i>
            <span>System Overview</span>
            <span className="mx-2">•</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center w-full h-96">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 rounded-full border-violet-500 border-t-transparent animate-spin"></div>
              <p className="mt-4 text-gray-400">Loading system data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="p-6 border border-gray-700 shadow-lg bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-200">
                <i className="mr-2 fas fa-chart-pie text-violet-400"></i>
                System Statistics
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-5 border rounded-lg shadow-sm bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border-violet-800/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Total Users</p>
                      <h3 className="mt-1 text-3xl font-bold text-white">
                        {countUsers.studentUsers + countUsers.tpoUsers + countUsers.managementUsers + countUsers.superUsers}
                      </h3>
                    </div>
                    <div className="p-3 rounded-lg bg-violet-500/20">
                      <i className="text-xl fas fa-users text-violet-400"></i>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-violet-300">
                    <i className="mr-1 fas fa-arrow-up"></i> 
                    <span>Active Accounts</span>
                  </div>
                </div>
                
                <div className="p-5 border rounded-lg shadow-sm bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-800/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Students</p>
                      <h3 className="mt-1 text-3xl font-bold text-white">{countUsers.studentUsers}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/20">
                      <i className="text-xl text-blue-400 fas fa-user-graduate"></i>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-blue-300">
                    <span className="flex items-center">
                      <i className="mr-1 fas fa-check-circle"></i>
                      <span>Registered Users</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 border rounded-lg shadow-sm bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-800/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">TPO Admins</p>
                      <h3 className="mt-1 text-3xl font-bold text-white">{countUsers.tpoUsers}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/20">
                      <i className="text-xl fas fa-user-tie text-amber-400"></i>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-amber-300">
                    <span className="flex items-center">
                      <i className="mr-1 fas fa-briefcase"></i>
                      <span>Placement Officers</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 border rounded-lg shadow-sm bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-emerald-800/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Management</p>
                      <h3 className="mt-1 text-3xl font-bold text-white">{countUsers.managementUsers}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/20">
                      <i className="text-xl fas fa-building text-emerald-400"></i>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-emerald-300">
                    <span className="flex items-center">
                      <i className="mr-1 fas fa-university"></i>
                      <span>Institution Admins</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Link to='../admin/student' className="group">
                <div className="h-full p-6 transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-200">Student Management</h3>
                    <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-blue-500/20 group-hover:bg-blue-500/30">
                      <i className="text-blue-400 fas fa-user-graduate"></i>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-400">Manage student accounts, view profiles, and handle student data.</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">{countUsers.studentUsers}</span>
                      <span className="ml-2 text-sm text-gray-400">Users</span>
                    </div>
                    <span className="flex items-center text-blue-400 transition-transform group-hover:translate-x-1">
                      View Details
                      <i className="ml-1 fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
              
              <Link to='../admin/tpo' className="group">
                <div className="h-full p-6 transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-200">TPO Management</h3>
                    <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-amber-500/20 group-hover:bg-amber-500/30">
                      <i className="fas fa-user-tie text-amber-400"></i>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-400">Manage placement officers, access controls, and employment data.</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">{countUsers.tpoUsers}</span>
                      <span className="ml-2 text-sm text-gray-400">Officers</span>
                    </div>
                    <span className="flex items-center transition-transform text-amber-400 group-hover:translate-x-1">
                      View Details
                      <i className="ml-1 fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
              
              <Link to='../admin/management' className="group">
                <div className="h-full p-6 transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-200">Management</h3>
                    <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30">
                      <i className="fas fa-building text-emerald-400"></i>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-400">Control institutional settings, policies, and administrative access.</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">{countUsers.managementUsers}</span>
                      <span className="ml-2 text-sm text-gray-400">Admins</span>
                    </div>
                    <span className="flex items-center transition-transform text-emerald-400 group-hover:translate-x-1">
                      View Details
                      <i className="ml-1 fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* System Access */}
            <div className="p-6 border border-gray-700 shadow-lg bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-200">
                <i className="mr-2 fas fa-key text-violet-400"></i>
                System Access
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-5 border rounded-lg shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 border-violet-900/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Super Administrators</p>
                      <h3 className="mt-1 text-3xl font-bold text-white">{countUsers.superUsers}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-violet-500/20">
                      <i className="text-xl fas fa-user-shield text-violet-400"></i>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-violet-300">
                    <span className="flex items-center">
                      <i className="mr-1 fas fa-shield-alt"></i>
                      <span>Full system access privileges</span>
                    </span>
                  </div>
                </div>

                {countUsers.studentApprovalPendingUsers > 0 ? (
                  <Link to="../admin/approve-student" className="group">
                    <div className="p-5 transition-all duration-300 border rounded-lg shadow-sm bg-gradient-to-br from-red-900/40 to-pink-900/40 border-red-800/50 hover:border-red-500/70 hover:shadow-lg hover:shadow-red-500/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">Pending Approvals</p>
                          <h3 className="mt-1 text-3xl font-bold text-white">{countUsers.studentApprovalPendingUsers}</h3>
                        </div>
                        <div className="p-3 rounded-lg bg-red-500/20">
                          <i className="text-xl text-red-400 fas fa-user-clock"></i>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="flex items-center text-sm text-red-300">
                          <i className="mr-1 fas fa-exclamation-circle"></i>
                          <span>Requires immediate attention</span>
                        </span>
                        <span className="flex items-center text-sm text-red-400 transition-transform group-hover:translate-x-1">
                          Review Now
                          <i className="ml-1 fas fa-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-5 border rounded-lg shadow-sm bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Approval Status</p>
                        <h3 className="mt-1 text-2xl font-bold text-white">All Clear</h3>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/20">
                        <i className="text-xl text-green-400 fas fa-check-circle"></i>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-green-300">
                      <span className="flex items-center">
                        <i className="mr-1 fas fa-thumbs-up"></i>
                        <span>No pending approvals</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-6 border border-gray-700 shadow-lg bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-200">
                <i className="mr-2 fas fa-bolt text-amber-400"></i>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <button className="flex flex-col items-center justify-center p-4 text-gray-300 transition-all duration-300 border border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 hover:shadow-lg hover:border-blue-500/50 hover:text-white">
                  <i className="mb-2 text-xl text-blue-400 fas fa-user-plus"></i>
                  <span className="text-sm">Add User</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 text-gray-300 transition-all duration-300 border border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 hover:shadow-lg hover:border-violet-500/50 hover:text-white">
                  <i className="mb-2 text-xl fas fa-cog text-violet-400"></i>
                  <span className="text-sm">Settings</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 text-gray-300 transition-all duration-300 border border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 hover:shadow-lg hover:border-amber-500/50 hover:text-white">
                  <i className="mb-2 text-xl fas fa-file-alt text-amber-400"></i>
                  <span className="text-sm">Reports</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 text-gray-300 transition-all duration-300 border border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 hover:shadow-lg hover:border-emerald-500/50 hover:text-white">
                  <i className="mb-2 text-xl fas fa-database text-emerald-400"></i>
                  <span className="text-sm">Backups</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
