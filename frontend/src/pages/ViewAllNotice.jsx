import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import TablePlaceholder from '../components/TablePlaceholder';
import Toast from '../components/Toast';
import ModalBox from '../components/Modal';
import { BASE_URL } from '../config/backend_url';
import { FaTrashAlt, FaRegBell, FaChevronRight, FaSearch } from 'react-icons/fa';

function ViewlAllNotice() {
  document.title = 'CareerConnect | Notices';
  const [loading, setLoading] = useState(true);
  const [noticesData, setNoticesData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [modalToPass, setModalToPass] = useState('');

  const closeModal = () => setShowModal(false);

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
    if (currentUser?.role) {
      fetchNotices();
    }
  }, [currentUser?.role]);

  const handleDelete = async (noticeId) => {
    setModalToPass(noticeId);
    setShowModal(true);
  };

  const confirmDelete = async (noticeId) => {
    try {
      const response = await axios.post(`${BASE_URL}/management/delete-notice?noticeId=${noticeId}`);
      if (response?.data?.msg) {
        fetchNotices();
        setToastMessage(response.data.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log('Error while deleting notice => ', error);
    }
    setShowModal(false);
  };

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/management/get-all-notices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (currentUser?.role === 'tpo_admin') {
        const filteredNotices = response?.data?.filter(notice => (
          notice.sender_role === 'tpo_admin' || notice.receiver_role === 'tpo_admin'
        ));
        setNoticesData(filteredNotices);
      } else if (currentUser?.role === 'student') {
        const filteredNotices = response?.data?.filter(notice => notice.receiver_role === 'student');
        setNoticesData(filteredNotices);
      } else {
        setNoticesData(response.data);
      }
    } catch (error) {
      console.log('Error while fetching notices => ', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter notices based on search term and filter type
  const filteredNotices = noticesData?.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notice.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'new') {
      return matchesSearch && (new Date() - new Date(notice?.createdAt)) / (1000 * 60 * 60 * 24) <= 2;
    }
    if (filterType === 'old') {
      return matchesSearch && (new Date() - new Date(notice?.createdAt)) / (1000 * 60 * 60 * 24) > 2;
    }
    return matchesSearch;
  });

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

      {loading ? (
        <TablePlaceholder />
      ) : (
        <div className="px-4 py-5 container-fluid">
          {/* Page Header */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="flex items-center text-2xl font-bold text-gray-800">
                <FaRegBell className="mr-3 text-blue-500" /> 
                Notice Board
              </h1>
              <p className="mt-1 text-gray-600">
                All notices and updates from CareerConnect
              </p>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col w-full gap-3 md:w-auto md:flex-row">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notices..."
                  className="w-full py-2 pl-10 pr-4 bg-white border border-gray-200 rounded-lg md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute text-gray-400 top-3 left-3" />
              </div>
              
              <select
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg md:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Notices</option>
                <option value="new">New (2 days)</option>
                <option value="old">Older</option>
              </select>
            </div>
          </div>
          
          {/* Modern Card-based Notice List */}
          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
            {filteredNotices?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNotices.map((notice, index) => (
                  <div key={notice?._id} className="transition-colors duration-150 hover:bg-gray-50/50">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 font-medium text-blue-600 bg-blue-100 rounded-full">
                            {index + 1}
                          </span>
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
                            className="flex items-center gap-2 text-lg font-semibold text-gray-800 no-underline transition-colors duration-200 hover:text-blue-600"
                          >
                            {notice?.title}
                            {(new Date() - new Date(notice?.createdAt)) / (1000 * 60 * 60 * 24) <= 2 && (
                              <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                                New
                              </span>
                            )}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(notice.createdAt).toLocaleDateString('en-IN')}
                          {" · "}
                          <span className="font-medium">
                            {new Date(notice.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Info Row - Role info and actions */}
                      {currentUser?.role !== 'student' && (
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center">
                            <span className="mr-1 text-xs text-gray-500">From:</span>
                            <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                              {notice?.sender_role === 'management_admin' ? 'Management' : 'TPO'}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="mr-1 text-xs text-gray-500">To:</span>
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              {notice?.receiver_role === 'tpo_admin' ? 'TPO' : 'Student'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Message content */}
                      <div className="mb-3 text-gray-600 line-clamp-2">
                        {notice?.message}
                      </div>
                      
                      {/* Footer with action buttons */}
                      <div className="flex items-center justify-between mt-3">
                        <Link
                          to={
                            currentUser?.role === 'student'
                              ? `/student/notice/${notice?._id}`
                              : currentUser?.role === 'tpo_admin'
                                ? `/tpo/notice/${notice?._id}`
                                : `/management/notice/${notice?._id}`
                          }
                          className="flex items-center gap-1 text-sm text-blue-600 no-underline hover:text-blue-800"
                        >
                          Read More <FaChevronRight className="text-xs" />
                        </Link>
                        
                        {currentUser?.role !== 'student' && (
                          ((currentUser?.role === 'tpo_admin' && notice?.sender_role !== 'management_admin') || 
                            currentUser?.role === 'management_admin') ? (
                            <button
                              onClick={() => handleDelete(notice._id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-md transition-colors"
                            >
                              <FaTrashAlt className="text-xs" /> Delete
                            </button>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
                  <FaRegBell className="text-2xl text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-700">No notices found</h3>
                <p className="mt-2 text-gray-500">No notices match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Delete Notice"}
        body={`Are you sure you want to delete this notice? This action cannot be undone.`}
        btn={"Delete"}
        confirmAction={() => confirmDelete(modalToPass)}
      />
    </>
  )
}

export default ViewlAllNotice
