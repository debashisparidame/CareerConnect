import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { BASE_URL } from '../../config/backend_url';
import { useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaPaperPlane, FaArrowRight } from 'react-icons/fa';
import { HiUserAdd } from 'react-icons/hi';

function AddNewUser() {
  document.title = 'CareerConnect | Add new user';

  const location = useLocation();
  // filter management or tpo or student to add
  const userToAdd = location.pathname.split('/').filter(link => link !== '' && link !== 'admin' && link !== 'management')[0].split('-').filter(link => link !== 'add' && link !== 'admin')[0];

  const getUserTypeLabel = () => {
    switch(userToAdd) {
      case 'management': return 'Management Administrator';
      case 'tpo': return 'Training & Placement Officer';
      case 'student': return 'Student';
      default: return 'User';
    }
  };

  const getUserTypeColor = () => {
    switch(userToAdd) {
      case 'management': return 'from-purple-600 to-indigo-600 shadow-purple-200';
      case 'tpo': return 'from-blue-600 to-cyan-600 shadow-blue-200';
      case 'student': return 'from-emerald-600 to-teal-600 shadow-emerald-200';
      default: return 'from-gray-600 to-gray-700 shadow-gray-200';
    }
  };

  const [data, setData] = useState({
    first_name: "",
    email: "",
    number: "",
    password: "",
    sendMail: true
  });

  // for error message
  const [error, setError] = useState({});

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  const handleDataChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleModalSubmit = (e) => {
    e.preventDefault();

    let newError = {};

    if (!data?.first_name) newError.first_name = 'Name Required!';
    if (!data?.email) newError.email = 'Email Required!';
    if (!data?.number) newError.number = 'Number Required!';
    if (!data?.password) newError.password = 'Initial Password Required!';

    // If any errors were found, set them and return early to prevent the modal from opening
    if (Object.keys(newError).length > 0) return setError(newError);

    setShowModal(true);
  };

  const handleSubmitManagement = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/add-management`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      
      if (response?.data) {
        if (response?.data?.msg === "User Created!" && data?.sendMail) {
          sendEmail(
            data.email, 
            "Welcome to the team!", 
            `Hi ${data.first_name},\n\nWelcome to our team as a Management. We're excited to work with you!\nNote:\nYour ID: ${data.email}\nPassword: ${data.password}\n\nMake sure you change password as soon as possible!!!\n\nBest regards,\nAdmin Team`
          );
        }
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log("handleSubmit => AddManagement.jsx ==> ", error);
    }
    setShowModal(false);
  };

  const handleSubmitTPO = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/addtpo`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      
      if (response?.data) {
        if (response?.data?.msg === "User Created!" && data?.sendMail) {
          sendEmail(
            data.email, 
            "Welcome to the team!", 
            `Hi ${data.first_name},\n\nWelcome to our team as a TPO. We're excited to work with you!\nNote:\nYour ID: ${data.email}\nPassword: ${data.password}\n\nMake sure you change password as soon as possible!!!\n\nBest regards,\nManagement Team`
          );
        }
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log("handleSubmit => AddTPO.jsx ==> ", error);
    }
    setShowModal(false);
  };

  const handleSubmitStudent = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/add-student`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      
      if (response?.data) {
        if (response?.data?.msg === "User Created!" && data?.sendMail) {
          sendEmail(
            data.email, 
            "Welcome to the Our College Placement Portal!", 
            `Hi ${data.first_name},\n\nWelcome to our college placement portal. Happy hiring!\nNote:\nYour ID: ${data.email}\nPassword: ${data.password}\n\nMake sure you change password as soon as possible!!!\n\nBest regards,\nManagement Team`
          );
        }
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log("handleSubmit => AddStudent.jsx ==> ", error);
    }
    setShowModal(false);
  };

  // Helper function for email sending
  const sendEmail = (email, subject, body) => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    mailtoLink.target = '_blank';
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink);
  };

  return (
    <>
      {/* Toast Message */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="top-center"
      />

      <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
        {/* Decorative Elements - Using pure CSS animations instead of framer-motion */}
        <div className="absolute w-64 h-64 bg-blue-100 rounded-full top-20 right-20 mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute w-64 h-64 bg-purple-100 rounded-full top-40 left-40 mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay-1"></div>
        <div className="absolute w-64 h-64 rounded-full -bottom-8 left-20 bg-emerald-100 mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay-2"></div>
        
        {/* Form Card */}
        <div className="relative z-10 w-full max-w-2xl">
          {/* Card Header */}
          <div className={`bg-gradient-to-r ${getUserTypeColor()} p-8 rounded-t-2xl text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create New {getUserTypeLabel()}</h2>
                <p className="mt-1 text-white/80">Add a new user to the CareerConnect system</p>
              </div>
              <div className="p-4 transition-colors rounded-full shadow-inner bg-white/20 hover:bg-white/30">
                <HiUserAdd size={36} className="text-white animate-pulse-slow" />
              </div>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="p-8 border border-gray-100 shadow-xl bg-white/90 backdrop-blur-md rounded-b-2xl">
            <form onSubmit={handleModalSubmit} className="space-y-6">
              {/* Name input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    value={data.first_name || ''}
                    onChange={handleDataChange}
                    className={`w-full pl-10 pr-4 py-3 border ${error?.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                              rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 
                              transition-all duration-200 outline-none`}
                    placeholder="Enter user's full name"
                  />
                </div>
                {error?.first_name && (
                  <p className="flex items-center gap-1 mt-1 text-sm text-red-600 animate-fadeIn">
                    {error.first_name}
                  </p>
                )}
              </div>
              
              {/* Email input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={data.email || ''}
                    onChange={handleDataChange}
                    className={`w-full pl-10 pr-4 py-3 border ${error?.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                              rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 
                              transition-all duration-200 outline-none`}
                    placeholder="Enter user's email address"
                  />
                </div>
                {error?.email && (
                  <p className="flex items-center gap-1 mt-1 text-sm text-red-600 animate-fadeIn">
                    {error.email}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Phone number input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="number"
                      value={data.number || ''}
                      onChange={handleDataChange}
                      onInput={(e) => {
                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }}
                      className={`w-full pl-10 pr-4 py-3 border ${error?.number ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                              rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 
                              transition-all duration-200 outline-none`}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  {error?.number && (
                    <p className="flex items-center gap-1 mt-1 text-sm text-red-600 animate-fadeIn">
                      {error.number}
                    </p>
                  )}
                </div>
                
                {/* Password input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Initial Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="password"
                      value={data.password || ''}
                      onChange={handleDataChange}
                      className={`w-full pl-10 pr-4 py-3 border ${error?.password ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                              rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 
                              transition-all duration-200 outline-none`}
                      placeholder="Enter initial password"
                    />
                  </div>
                  {error?.password && (
                    <p className="flex items-center gap-1 mt-1 text-sm text-red-600 animate-fadeIn">
                      {error.password}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Send email checkbox */}
              <div className="mt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      name="sendMail"
                      checked={data.sendMail}
                      onChange={(e) => setData({ ...data, sendMail: e.target.checked })}
                    />
                    <div className={`w-5 h-5 border-2 rounded ${data.sendMail ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} transition-colors duration-300`}></div>
                    {data.sendMail && (
                      <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white animate-scaleIn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="flex items-center text-sm text-gray-700">
                    <FaPaperPlane className="mr-2 text-gray-500" />
                    Send welcome email to user
                  </span>
                </label>
              </div>
              
              {/* Submit button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4
                           bg-gradient-to-r ${getUserTypeColor()} text-white font-medium rounded-lg
                           shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                           transition-all duration-200`}
                >
                  <HiUserAdd className="text-lg" />
                  <span>Create {getUserTypeLabel()}</span>
                  <FaArrowRight className="ml-1 animate-bounceX" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ModalBox Component */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirm User Creation"}
        body={`Are you sure you want to create a new ${getUserTypeLabel().toLowerCase()} ${
          data.first_name ? `named "${data.first_name}"` : ""
        }${data.sendMail ? ` and send welcome email to ${data?.email}?` : "?"}`}
        btn={"Create User"}
        confirmAction={
          userToAdd === 'management'
            ? handleSubmitManagement
            : userToAdd === 'tpo'
              ? handleSubmitTPO
              : userToAdd === 'student'
                ? handleSubmitStudent
                : null
        }
      />
    </>
  );
}

// Add these CSS animations to your global CSS file
// Add this to index.css or styles.css
/*
@keyframes float {
  0% { transform: translatey(0px); }
  50% { transform: translatey(-20px); }
  100% { transform: translatey(0px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes bounceX {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delay-1 {
  animation: float 7s ease-in-out 1s infinite;
}

.animate-float-delay-2 {
  animation: float 8s ease-in-out 2s infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2.5s infinite;
}

.animate-bounceX {
  animation: bounceX 1s infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.3s;
}

.animate-scaleIn {
  animation: scaleIn 0.2s;
}
*/

export default AddNewUser;
