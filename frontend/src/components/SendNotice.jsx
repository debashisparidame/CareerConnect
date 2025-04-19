import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from './Toast';
import ModalBox from './Modal';
import { BASE_URL } from '../config/backend_url';
import { useNavigate } from 'react-router-dom';

function SendNotice() {
  document.title = 'CareerConnect | Send Notice';

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // Loading state for initial fetch

  const [data, setData] = useState({});          // Form data state
  const [error, setError] = useState('');        // Error message state

  const [currentUser, setCurrentUser] = useState({ role: '', id: '' });  // Current user state
  const [showToast, setShowToast] = useState(false);                     // Toast visibility
  const [toastMessage, setToastMessage] = useState('');                  // Toast message content
  const [showModal, setShowModal] = useState(false);                     // Modal visibility

  const closeModal = () => setShowModal(false);  // Function to close the modal

  // Fetch current user data and handle authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirect to login if no token
      return;
    }

    axios.get(`${BASE_URL}/user/detail`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          role: res.data.role,
        });
        setLoading(false);  // End loading once data is fetched
      })
      .catch(err => {
        console.log("SendNotice.jsx => ", err);
        navigate('/login');  // Redirect to login on error
      });
  }, [navigate]);

  // Handle form input changes
  const handleDataChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  // Submit form
  const handleSubmit = () => {
    if (!data?.title?.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!data?.message?.trim()) {
      setError('Message is required');
      return;
    }
    
    if (currentUser?.role === 'management_admin' && !data?.receiver_role) {
      setError('Receiver Role is required');
      return;
    }
    
    setError('');
    setShowModal(true);  // Show confirmation modal
  }

  // Confirm the submission
  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/send-notice`, data, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      navigate(currentUser?.role === 'management_admin' ? '/management/all-notice' : '/tpo/all-notice');
    } catch (error) {
      console.log('Error while sending notice: ', error);
      setToastMessage(error.response?.data?.msg || "Failed to send notice");
      setShowToast(true);
    }
    setShowModal(false);
  }

  // Update data with current user info after user data is loaded
  useEffect(() => {
    if (currentUser?.role && currentUser?.id) {
      setData(prevData => ({
        ...prevData,
        sender: currentUser?.id,
        sender_role: currentUser?.role,
      }));
    }
  }, [currentUser]);

  // Get receiver role label based on role
  const getReceiverLabel = (role) => {
    switch(role) {
      case 'student': return 'All Students';
      case 'tpo_admin': return 'TPO Department';
      default: return 'Unknown';
    }
  };

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

      <div className="max-w-3xl px-4 py-6 mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center text-2xl font-bold text-gray-800">
              <i className="mr-3 text-blue-600 fas fa-paper-plane"></i>
              Send Notice
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Send important announcements to {currentUser?.role === 'management_admin' ? 'students or TPO department' : 'students'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white shadow-md rounded-xl">
            <div className="w-16 h-16 mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white shadow-md rounded-xl">
            {/* Notice Form */}
            <div className="p-6">
              {/* Form Header */}
              <div className="flex items-center pb-4 mb-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 mr-4 text-blue-600 bg-blue-100 rounded-full">
                  <i className="text-lg fas fa-bullhorn"></i>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Create New Notice</h2>
                  <p className="text-sm text-gray-500">
                    This notice will be visible to all {currentUser?.role === 'management_admin' ? 'selected users' : 'students'}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Receiver Role (Only for Management Admin) */}
                {currentUser?.role === 'management_admin' && (
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Receiver Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full px-4 py-3 pr-8 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        name="receiver_role"
                        value={data?.receiver_role || ""}
                        onChange={handleDataChange}
                      >
                        <option disabled value="" className="text-gray-400">
                          Select Receiver Role...
                        </option>
                        <option value="student">All Students</option>
                        <option value="tpo_admin">TPO Department</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <i className="text-gray-400 fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Notice Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a clear and concise title"
                    name="title"
                    value={data?.title || ""}
                    onChange={handleDataChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Message Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Type your message here..."
                    name="message"
                    value={data?.message || ""}
                    onChange={handleDataChange}
                    rows="6"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="px-4 py-3 border-l-4 border-red-500 rounded-md bg-red-50">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <i className="text-red-500 fas fa-exclamation-circle"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-500">
                {data?.receiver_role && (
                  <span className="flex items-center">
                    <i className="mr-2 text-blue-500 fas fa-user-group"></i>
                    Sending to: <span className="ml-1 font-medium">{getReceiverLabel(data?.receiver_role)}</span>
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(currentUser?.role === 'management_admin' ? '/management/all-notice' : '/tpo/all-notice')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <i className="mr-2 transition-transform fas fa-paper-plane group-hover:translate-x-1"></i>
                  Send Notice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="p-4 mt-8 border border-blue-100 rounded-lg bg-blue-50">
          <h3 className="flex items-center mb-2 font-medium text-blue-800">
            <i className="mr-2 text-yellow-500 fas fa-lightbulb"></i>
            Tips for effective notices
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <i className="mt-1 mr-2 text-green-500 fas fa-check-circle"></i>
              <span>Keep titles short, clear and descriptive</span>
            </li>
            <li className="flex items-start">
              <i className="mt-1 mr-2 text-green-500 fas fa-check-circle"></i>
              <span>Include all important details in the message</span>
            </li>
            <li className="flex items-start">
              <i className="mt-1 mr-2 text-green-500 fas fa-check-circle"></i>
              <span>Mention deadlines or important dates clearly</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ModalBox Component */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header="Confirm Notice"
        body={
          <div className="p-4">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-blue-100 rounded-full">
                <i className="text-lg fas fa-paper-plane"></i>
              </div>
            </div>
            <h3 className="mb-2 font-medium text-center text-gray-900">
              Send this notice?
            </h3>
            {currentUser?.role === 'management_admin' && data?.receiver_role && (
              <p className="mb-2 text-sm text-center">
                <span className="font-medium">To:</span> {getReceiverLabel(data?.receiver_role)}
              </p>
            )}
            <p className="mb-4 text-sm text-center">
              <span className="font-medium">Title:</span> {data?.title}
            </p>
            <div className="p-3 mb-3 border border-gray-100 rounded bg-gray-50">
              <p className="text-sm text-gray-700">{data?.message}</p>
            </div>
            <p className="text-xs text-center text-gray-500">
              This action cannot be undone. The notice will be immediately visible to all recipients.
            </p>
          </div>
        }
        btn="Send Notice"
        btnClass="bg-blue-600 hover:bg-blue-700"
        confirmAction={confirmSubmit}
      />
    </>
  );
}

export default SendNotice;
