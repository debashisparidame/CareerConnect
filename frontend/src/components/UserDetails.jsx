import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Toast from './Toast';
import { BASE_URL } from '../config/backend_url';

function UserDetails() {
  document.title = 'CareerConnect | Complete Profile';
  const navigate = useNavigate();
  const location = useLocation();

  // userId but its userId
  const { userId } = useParams();

  // userData to store user data get from userId
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  const [currentUserData, setCurrentUserData] = useState('');

  // checking request is of complete-profile 
  const completeProfileReq = location.pathname.split('/').includes("complete-profile");

  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCurrentUserData(response.data);

      // check authenticate user is requesting or not
      if (completeProfileReq) {
        if (!(userId === response.data.id)) navigate('../404')

        // checking if user completed profile then redirect to dashboard
        if (response.data.isProfileCompleted === "true") {
          if (response.data.role === "student") navigate('../student/dashboard')
          if (response.data.role === "tpo_admin") navigate('../tpo/dashboard')
          if (response.data.role === "management_admin") navigate('../management/dashboard')
        }
      }

      setLoading(false);
    } catch (error) {
      console.log("Account.jsx => ", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUserData();
  }, [loading]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setUserData(response.data);
      } catch (error) {
        if (error.response.data) {
          setToastMessage(error.response.data.msg);
          setShowToast(true);
          if (error.response.data.msg === "Student not found" || "user not found")
            navigate("../404")
        }
        console.error("Error fetching student data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [userId]);

  const handleDataChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value })

  const handleDataChangeForSGPA = (e) => {
    setUserData({
      ...userData,
      studentProfile: {
        ...userData?.studentProfile,
        SGPA: {
          ...userData?.studentProfile?.SGPA,
          [e.target.name]: e.target.value
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/user/update-profile`,
        userData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      if (response.data) {
        if (response.data.msg) {
          setToastMessage(response.data.msg);
          setShowToast(true);
          if (completeProfileReq) {
            if (response.data.msg === "Data Updated Successfully!")
              navigate('../management/dashboard');
          }
        }
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("UserDetails => ", error);
    }
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImgs', file);
      formData.append('userId', userData._id);

      try {
        const response = await axios.post(`${BASE_URL}/user/upload-photo`, formData);
        setUserData({ ...userData, profile: response.data.file });
        if (response.data) {
          if (response.data.msg) {
            setToastMessage(response.data.msg);
            setShowToast(true);
          }
        }
      } catch (error) {
        setToastMessage(error.msg);
        setShowToast(true);
        console.error('Error uploading photo:', error);
      }
    }
  }

  // for formating date of birth
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  // Get role-specific colors
  const getRoleColor = () => {
    switch(userData?.role) {
      case 'student': return 'blue';
      case 'tpo_admin': return 'green';
      case 'management_admin': return 'purple';
      case 'superuser': return 'red';
      default: return 'blue';
    }
  };

  const roleColor = getRoleColor();
  
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Toast notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 mb-4 border-4 rounded-full border-t-transparent animate-spin" 
               style={{borderColor: `var(--color-${roleColor}-500) transparent var(--color-${roleColor}-300) transparent`}}></div>
          <p className="text-lg text-gray-600">Loading profile data...</p>
        </div>
      ) : (
        <div className="px-4 py-6 mx-auto max-w-7xl">
          {/* Profile header */}
          <div className="relative mb-8 overflow-hidden bg-white shadow-md rounded-2xl">
            {/* Cover background */}
            <div className={`h-48 bg-gradient-to-r from-${roleColor}-500 to-${roleColor}-700`}></div>
            
            {/* Profile card with photo */}
            <div className="relative px-6 pb-6">
              <div className="absolute flex items-end -top-16 left-6">
                <div className="relative">
                  {userData?.profile ? (
                    <img 
                      src={userData?.profile} 
                      alt={`${userData?.first_name}'s profile`} 
                      className="object-cover w-32 h-32 border-4 border-white shadow-lg rounded-xl"
                    />
                  ) : (
                    <div className={`w-32 h-32 rounded-xl border-4 border-white shadow-lg bg-${roleColor}-600 flex items-center justify-center`}>
                      <span className="text-4xl font-bold text-white">
                        {getInitials(`${userData?.first_name} ${userData?.last_name}`)}
                      </span>
                    </div>
                  )}
                  
                  {/* Photo upload button (only shown when editing) */}
                  {(completeProfileReq || currentUserData.role === 'superuser') && (
                    <label 
                      htmlFor="profilePhoto" 
                      className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 transition-colors bg-white border border-gray-200 rounded-full shadow-md cursor-pointer hover:bg-gray-50"
                    >
                      <i className="text-gray-600 fas fa-camera"></i>
                      <input
                        id="profilePhoto"
                        type="file"
                        className="hidden"
                        accept=".jpg, .png, .jpeg"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                </div>
                
                <div className="pb-2 ml-5">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {userData?.first_name} {userData?.middle_name || ''} {userData?.last_name || ''}
                  </h1>
                  <p className="text-gray-600">
                    {userData?.email}
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${roleColor}-100 text-${roleColor}-800 capitalize`}>
                      {userData?.role?.replace('_', ' ')}
                    </span>
                  </p>
                </div>
              </div>
              
              {/* Tabs for different sections (only for desktop view) */}
              <div className="flex justify-end pt-24 mt-4 border-b border-gray-200 sm:pt-0">
                <nav className="flex space-x-8 overflow-x-auto" aria-label="Profile Tabs">
                  <button 
                    onClick={() => setActiveTab('personal')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'personal' 
                        ? `border-${roleColor}-500 text-${roleColor}-600` 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className="mr-2 fas fa-user"></i>
                    Personal Info
                  </button>
                  
                  {userData?.role === "student" && (
                    <>
                      <button 
                        onClick={() => setActiveTab('academic')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'academic' 
                            ? `border-${roleColor}-500 text-${roleColor}-600` 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <i className="mr-2 fas fa-graduation-cap"></i>
                        Academic Info
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('qualification')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'qualification' 
                            ? `border-${roleColor}-500 text-${roleColor}-600` 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <i className="mr-2 fas fa-medal"></i>
                        Qualifications
                      </button>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>

          {/* Form content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details Section */}
            <div className={`${activeTab !== 'personal' && 'hidden'}`}>
              <div className="overflow-hidden bg-white shadow-md rounded-xl">
                <div className={`px-6 py-4 bg-gradient-to-r from-${roleColor}-500 to-${roleColor}-600 flex items-center`}>
                  <i className="mr-3 text-xl text-white fas fa-user-circle"></i>
                  <h2 className="text-xl font-bold text-white">Personal Details</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name fields */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={userData?.first_name || ''}
                        onChange={handleDataChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={completeProfileReq}
                        disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Middle Name</label>
                      <input
                        type="text"
                        name="middle_name"
                        value={userData?.middle_name || ''}
                        onChange={handleDataChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={userData?.last_name || ''}
                        onChange={handleDataChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={completeProfileReq}
                        disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={userData?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-not-allowed bg-gray-50"
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Mobile Number</label>
                      <input
                        type="number"
                        name="number"
                        value={userData?.number || ''}
                        onChange={handleDataChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={completeProfileReq}
                        disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        onInput={(e) => {
                          if (e.target.value.length > 10) {
                            e.target.value = e.target.value.slice(0, 10);
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                      <select
                        name="gender"
                        value={userData?.gender || "undefined"}
                        onChange={handleDataChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={completeProfileReq}
                        disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                      >
                        <option disabled value="undefined">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formatDate(userData?.dateOfBirth)}
                        onChange={handleDataChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={completeProfileReq}
                        disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        name="address"
                        value={userData?.fullAddress?.address || ''}
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            fullAddress: {
                              ...userData?.fullAddress,
                              address: e.target.value
                            }
                          });
                        }}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={completeProfileReq}
                        disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Pincode</label>
                      <input
                        type="number"
                        name="pincode"
                        value={userData?.fullAddress?.pincode || ''}
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            fullAddress: {
                              ...userData?.fullAddress,
                              pincode: e.target.value
                            }
                          });
                        }}
                        pattern="\d{6}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={completeProfileReq}
                        disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        onInput={(e) => {
                          if (e.target.value.length > 6) {
                            e.target.value = e.target.value.slice(0, 6);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Info Section */}
            {userData?.role === "student" && (
              <div className={`${activeTab !== 'academic' && 'hidden'}`}>
                <div className="overflow-hidden bg-white shadow-md rounded-xl">
                  <div className={`px-6 py-4 bg-gradient-to-r from-${roleColor}-500 to-${roleColor}-600 flex items-center`}>
                    <i className="mr-3 text-xl text-white fas fa-graduation-cap"></i>
                    <h2 className="text-xl font-bold text-white">Academic Information</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">UIN</label>
                        <input
                          type="text"
                          name="uin"
                          value={userData?.studentProfile?.UIN || ''}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              studentProfile: {
                                ...userData?.studentProfile,
                                UIN: e.target.value
                              }
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Roll Number</label>
                        <input
                          type="number"
                          name="rollNumber"
                          value={userData?.studentProfile?.rollNumber || ''}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              studentProfile: {
                                ...userData?.studentProfile,
                                rollNumber: e.target.value
                              }
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
                        <select
                          name="department"
                          value={userData?.studentProfile?.department || "undefined"}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              studentProfile: {
                                ...userData?.studentProfile,
                                department: e.target.value
                              }
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        >
                          <option disabled value="undefined">Select Department</option>
                          <option value="Computer">Computer</option>
                          <option value="Civil">Civil</option>
                          <option value="ECS">ECS</option>
                          <option value="AIDS">AIDS</option>
                          <option value="Mechanical">Mechanical</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Year</label>
                        <select
                          name="year"
                          value={userData?.studentProfile?.year || "undefined"}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              studentProfile: {
                                ...userData?.studentProfile,
                                year: e.target.value
                              }
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        >
                          <option disabled value="undefined">Select Year</option>
                          <option value="1">1st</option>
                          <option value="2">2nd</option>
                          <option value="3">3rd</option>
                          <option value="4">4th</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Admission Year</label>
                        <input
                          type="number"
                          name="admissionYear"
                          value={userData?.studentProfile?.addmissionYear || ''}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              studentProfile: {
                                ...userData?.studentProfile,
                                addmissionYear: e.target.value
                              }
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                          onInput={(e) => {
                            if (e.target.value.length > 4) {
                              e.target.value = e.target.value.slice(0, 4);
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* SGPA Section */}
                    <div className="mt-8">
                      <h3 className="mb-4 text-lg font-medium text-gray-900">Semester Grade Point Average (SGPA)</h3>
                      
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Semester 1</label>
                          <input
                            type="number"
                            name="sem1"
                            value={userData?.studentProfile?.SGPA?.sem1 || ''}
                            onChange={handleDataChangeForSGPA}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Semester 2</label>
                          <input
                            type="number"
                            name="sem2"
                            value={userData?.studentProfile?.SGPA?.sem2 || ''}
                            onChange={handleDataChangeForSGPA}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Semester 3</label>
                          <input
                            type="number"
                            name="sem3"
                            value={userData?.studentProfile?.SGPA?.sem3 || ''}
                            onChange={handleDataChangeForSGPA}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Semester 4</label>
                          <input
                            type="number"
                            name="sem4"
                            value={userData?.studentProfile?.SGPA?.sem4 || ''}
                            onChange={handleDataChangeForSGPA}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Semester 5</label>
                          <input
                            type="number"
                            name="sem5"
                            value={userData?.studentProfile?.SGPA?.sem5 || ''}
                            onChange={handleDataChangeForSGPA}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Semester 6</label>
                          <input
                            type="number"
                            name="sem6"
                            value={userData?.studentProfile?.SGPA?.sem6 || ''}
                            onChange={handleDataChangeForSGPA}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Semester 7</label>
                          <input
                            type="number"
                            name="sem7"
                            value={userData?.studentProfile?.SGPA?.sem7 || ''}
                            onChange={handleDataChangeForSGPA}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="10"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Semester 8</label>
                          <input
                            type="number"
                            name="sem8"
                            value={userData?.studentProfile?.SGPA?.sem8 || ''}
                            onChange={handleDataChangeForSGPA}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Past Qualification Section */}
            {userData?.role === "student" && (
              <div className={`${activeTab !== 'qualification' && 'hidden'}`}>
                <div className="overflow-hidden bg-white shadow-md rounded-xl">
                  <div className={`px-6 py-4 bg-gradient-to-r from-${roleColor}-500 to-${roleColor}-600 flex items-center`}>
                    <i className="mr-3 text-xl text-white fas fa-medal"></i>
                    <h2 className="text-xl font-bold text-white">Past Qualifications</h2>
                  </div>
                  
                  <div className="p-6">
                    {/* SSC (10th) Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className={`w-8 h-8 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                          <i className="fas fa-school"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Secondary School Certificate (SSC)</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Board Name</label>
                          <select
                            name="sscBoard"
                            value={userData?.studentProfile?.pastQualification?.ssc?.board || "undefined"}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    ssc: {
                                      ...userData?.studentProfile?.pastQualification?.ssc,
                                      board: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required={completeProfileReq}
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                          >
                            <option disabled value="undefined">Select Board</option>
                            <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">Maharashtra State Board (MSBSHSE)</option>
                            <option value="Central Board of Secondary Education (CBSE)">CBSE</option>
                            <option value="Council for the Indian School Certificate Examinations (CISCE)">ICSE</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Percentage</label>
                          <input
                            type="number"
                            name="sscPercentage"
                            value={userData?.studentProfile?.pastQualification?.ssc?.percentage || ''}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    ssc: {
                                      ...userData?.studentProfile?.pastQualification?.ssc,
                                      percentage: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required={completeProfileReq}
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="100"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Passing Year</label>
                          <input
                            type="number"
                            name="sscPassingYear"
                            value={userData?.studentProfile?.pastQualification?.ssc?.year || ''}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    ssc: {
                                      ...userData?.studentProfile?.pastQualification?.ssc,
                                      year: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required={completeProfileReq}
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* HSC (12th) Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className={`w-8 h-8 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                          <i className="fas fa-school"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Higher Secondary Certificate (HSC)</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Board Name</label>
                          <select
                            name="hscBoard"
                            value={userData?.studentProfile?.pastQualification?.hsc?.board || "undefined"}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    hsc: {
                                      ...userData?.studentProfile?.pastQualification?.hsc,
                                      board: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                          >
                            <option disabled value="undefined">Select Board</option>
                            <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">Maharashtra State Board (MSBSHSE)</option>
                            <option value="Central Board of Secondary Education (CBSE)">CBSE</option>
                            <option value="Council for the Indian School Certificate Examinations (CISCE)">ICSE</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Percentage</label>
                          <input
                            type="number"
                            name="hscPercentage"
                            value={userData?.studentProfile?.pastQualification?.hsc?.percentage || ''}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    hsc: {
                                      ...userData?.studentProfile?.pastQualification?.hsc,
                                      percentage: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="100"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Passing Year</label>
                          <input
                            type="number"
                            name="hscPassingYear"
                            value={userData?.studentProfile?.pastQualification?.hsc?.year || ''}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    hsc: {
                                      ...userData?.studentProfile?.pastQualification?.hsc,
                                      year: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Diploma Section */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className={`w-8 h-8 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                          <i className="fas fa-certificate"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Diploma (Optional)</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
                          <select
                            name="diplomaBoard"
                            value={userData?.studentProfile?.pastQualification?.diploma?.department || "undefined"}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    diploma: {
                                      ...userData?.studentProfile?.pastQualification?.diploma,
                                      department: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                          >
                            <option disabled value="undefined">Select Department</option>
                            <option value="Computer">Computer</option>
                            <option value="Civil">Civil</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="ECS">ECS</option>
                            <option value="AIDS">AIDS</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Percentage/CGPA</label>
                          <input
                            type="number"
                            name="diplomaPercentage"
                            value={userData?.studentProfile?.pastQualification?.diploma?.percentage || ''}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    diploma: {
                                      ...userData?.studentProfile?.pastQualification?.diploma,
                                      percentage: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                            step="0.01"
                            min="0"
                            max="100"
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Passing Year</label>
                          <input
                            type="number"
                            name="diplomaPassingYear"
                            value={userData?.studentProfile?.pastQualification?.diploma?.year || ''}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    diploma: {
                                      ...userData?.studentProfile?.pastQualification?.diploma,
                                      year: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {(completeProfileReq || currentUserData.role === 'superuser') && (
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 bg-${roleColor}-600 hover:bg-${roleColor}-700 text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-${roleColor}-500 focus:ring-offset-2`}
                >
                  {completeProfileReq ? 'Complete Profile' : 'Update Profile'}
                </button>
              </div>
            )}
          </form>
          
          {/* Mobile Navigation Tabs */}
          {userData?.role === "student" && (
            <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-around py-2 bg-white border-t border-gray-200 shadow-lg md:hidden">
              <button 
                onClick={() => setActiveTab('personal')} 
                className={`flex flex-col items-center px-3 py-1 ${activeTab === 'personal' ? `text-${roleColor}-600` : 'text-gray-500'}`}
              >
                <i className={`fas fa-user ${activeTab === 'personal' ? `text-${roleColor}-600` : 'text-gray-400'}`}></i>
                <span className="mt-1 text-xs">Personal</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('academic')} 
                className={`flex flex-col items-center px-3 py-1 ${activeTab === 'academic' ? `text-${roleColor}-600` : 'text-gray-500'}`}
              >
                <i className={`fas fa-graduation-cap ${activeTab === 'academic' ? `text-${roleColor}-600` : 'text-gray-400'}`}></i>
                <span className="mt-1 text-xs">Academic</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('qualification')} 
                className={`flex flex-col items-center px-3 py-1 ${activeTab === 'qualification' ? `text-${roleColor}-600` : 'text-gray-500'}`}
              >
                <i className={`fas fa-medal ${activeTab === 'qualification' ? `text-${roleColor}-600` : 'text-gray-400'}`}></i>
                <span className="mt-1 text-xs">Education</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default UserDetails;
