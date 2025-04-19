import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Toast from '../Toast';
import UploadResume from './UploadResume';
import { BASE_URL } from '../../config/backend_url';

function UpdatePlacementProfile() {
  document.title = 'CareerConnect | Placement Profile';

  // userData to store user data get from userId
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('basic'); // For tab navigation
  const [isSaving, setIsSaving] = useState(false); // For save button animation

  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Account.jsx => ", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUserData();
    calcCGPA();
  }, [loading]);

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
    });
    calcCGPA();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

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
        }
      }
    } catch (error) {
      console.log("UserDetails => ", error);
      setToastMessage("Error updating profile. Please try again.");
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  }

  const [cgpa, setCgpa] = useState(0);

  const calcCGPA = () => {
    let sum = 0, sem = 0;
    if (userData?.studentProfile?.SGPA?.sem1 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem1);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem2 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem2);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem3 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem3);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem4 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem4);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem5 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem5);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem6 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem6);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem7 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem7);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem8 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem8);
      sem += 1;
    }
    setCgpa((sum / sem).toFixed(2));
  }

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-72">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-blue-600">Loading your profile...</p>
        </div>
      ) : (
        <>
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            message={toastMessage}
            delay={3000}
            position="bottom-end"
          />

          {/* Page Header with animated underline */}
          <div className="mb-8 text-center">
            <h2 className="relative inline-block mb-2 text-3xl font-bold text-gray-800">
              <span className="relative z-10">Placement Profile</span>
              <div className="absolute bottom-0 left-0 w-full h-3 transform skew-x-12 bg-blue-200 rounded-sm -z-10"></div>
            </h2>
            <p className="text-gray-600">Complete your profile to improve your placement opportunities</p>
          </div>

          {/* Tab navigation */}
          <div className="flex mb-6 overflow-x-auto bg-white rounded-lg shadow-md">
            <button 
              onClick={() => setActiveTab('basic')}
              className={`flex items-center px-4 py-3 transition-all ${activeTab === 'basic' ? 
                'text-blue-600 border-b-2 border-blue-500 font-bold' : 
                'text-gray-600 hover:text-blue-500'}`}>
              <i className="mr-2 fas fa-user-circle"></i>
              Basic Details
            </button>
            <button 
              onClick={() => setActiveTab('academic')}
              className={`flex items-center px-4 py-3 transition-all ${activeTab === 'academic' ? 
                'text-blue-600 border-b-2 border-blue-500 font-bold' : 
                'text-gray-600 hover:text-blue-500'}`}>
              <i className="mr-2 fas fa-graduation-cap"></i>
              Academic Details
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`flex items-center px-4 py-3 transition-all ${activeTab === 'past' ? 
                'text-blue-600 border-b-2 border-blue-500 font-bold' : 
                'text-gray-600 hover:text-blue-500'}`}>
              <i className="mr-2 fas fa-history"></i>
              Past Qualifications
            </button>
          </div>

          <div className="">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Basic Info Section */}
                <div className={`transition-all duration-500 ${activeTab === 'basic' ? 'block' : 'hidden'}`}>
                  <div className="p-6 overflow-hidden border-2 border-blue-100 rounded-lg shadow-lg bg-gradient-to-br from-white to-blue-50">
                    <div className="flex items-center gap-3 mb-4 text-2xl text-blue-800">
                      <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-lg shadow-md">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <span className="font-bold">Personal Information</span>
                    </div>
                    
                    <div className="flex flex-col justify-between py-2">
                      <div className="flex flex-col justify-between md:flex-row">
                        <div className="space-y-4 md:w-2/3">
                          <div className="p-3 transition-all rounded-lg hover:bg-blue-50">
                            <span className="flex items-center text-gray-700">
                              <i className="mr-2 text-blue-500 fas fa-user"></i>
                              <span className="font-bold">Full Name: </span>
                            </span>
                            <span className="ml-6 text-lg text-gray-800">
                              {userData?.first_name + " "}
                              {userData?.middle_name && userData?.middle_name + " "}
                              {userData?.last_name}
                            </span>
                          </div>

                          <div className="p-3 transition-all rounded-lg hover:bg-blue-50">
                            <span className="flex items-center text-gray-700">
                              <i className="mr-2 text-blue-500 fas fa-envelope"></i>
                              <span className="font-bold">Email: </span>
                            </span>
                            <span className="ml-6 text-gray-800">
                              {userData?.email}
                            </span>
                          </div>

                          <div className="p-3 transition-all rounded-lg hover:bg-blue-50">
                            <span className="flex items-center text-gray-700">
                              <i className="mr-2 text-blue-500 fas fa-phone"></i>
                              <span className="font-bold">Number: </span>
                            </span>
                            <span className="ml-6 text-gray-800">
                              {userData?.number}
                            </span>
                          </div>

                          {userData?.studentProfile?.uin && (
                            <div className="p-3 transition-all rounded-lg hover:bg-blue-50">
                              <span className="flex items-center text-gray-700">
                                <i className="mr-2 text-blue-500 fas fa-id-badge"></i>
                                <span className="font-bold">UIN: </span>
                              </span>
                              <span className="ml-6 text-gray-800">
                                {userData?.studentProfile?.uin}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Profile Picture with frame */}
                        <div className="flex flex-col items-center mt-4 md:mt-0">
                          <div className="relative">
                            <div className="absolute inset-0 transform scale-105 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-md -rotate-6"></div>
                            <div className="relative overflow-hidden border-4 border-white rounded-full shadow-lg">
                              <Image 
                                src={userData?.profile || "https://via.placeholder.com/150"} 
                                alt="Profile" 
                                width={150} 
                                height={150} 
                                className="object-cover transition-transform w-36 h-36 hover:scale-110" 
                              />
                            </div>
                          </div>
                          <p className="mt-3 font-medium text-blue-600">Profile Picture</p>
                        </div>
                      </div>

                      {/* Resume section */}
                      <div className="p-4 mt-6 border border-blue-100 rounded-lg bg-blue-50">
                        <h3 className="mb-3 text-lg font-semibold text-blue-700">
                          <i className="mr-2 fas fa-file-alt"></i>
                          Resume
                        </h3>
                        <div className="flex flex-wrap items-center gap-4">
                          <UploadResume fetchCurrentUserData={fetchCurrentUserData} />
                          
                          {(userData?.studentProfile?.resume !== "undefined") ? (
                            <div className="flex flex-col">
                              <a 
                                href={userData?.studentProfile?.resume} 
                                target='_blanck' 
                                className='flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700'
                              >
                                <i className="mr-2 fas fa-eye"></i>
                                View Resume
                              </a>
                              <p className='mt-2 text-sm text-gray-500'>
                                {userData?.studentProfile?.resume?.filename || "Your resume is uploaded"}
                              </p>
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-sm text-yellow-800 bg-yellow-100 rounded-lg">
                              <i className="mr-2 fas fa-exclamation-triangle"></i>
                              No resume uploaded yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Info Section */}
                <div className={`transition-all duration-500 ${activeTab === 'academic' ? 'block' : 'hidden'}`}>
                  <div className="p-6 overflow-hidden border-2 border-green-100 rounded-lg shadow-lg bg-gradient-to-br from-white to-green-50">
                    <div className="flex items-center gap-3 mb-4 text-2xl text-green-800">
                      <div className="flex items-center justify-center w-10 h-10 text-white bg-green-500 rounded-lg shadow-md">
                        <i className="fas fa-university"></i>
                      </div>
                      <span className="font-bold">College Information</span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      {/* semester sgpa */}
                      <div className="p-4 bg-white rounded-lg shadow-md">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-green-700">
                          <i className="mr-2 fas fa-chart-line"></i>
                          Semester SGPA
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative group">
                            <FloatingLabel controlId="floatingSem1" label="Sem 1">
                              <Form.Control
                                type="number"
                                placeholder="Sem 1"
                                name='sem1'
                                step="0.01"
                                className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.SGPA?.sem1}
                                onChange={handleDataChangeForSGPA}
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white transition-opacity bg-green-600 opacity-0 rounded-bl-md group-hover:opacity-100">Sem 1</div>
                          </div>
                          
                          <div className="relative group">
                            <FloatingLabel controlId="floatingSem2" label="Sem 2">
                              <Form.Control
                                type="number"
                                placeholder="Sem 2"
                                name='sem2'
                                step="0.01"
                                className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.SGPA?.sem2}
                                onChange={handleDataChangeForSGPA}
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white transition-opacity bg-green-600 opacity-0 rounded-bl-md group-hover:opacity-100">Sem 2</div>
                          </div>
                          
                          <div className="relative group">
                            <FloatingLabel controlId="floatingSem3" label="Sem 3">
                              <Form.Control
                                type="number"
                                placeholder="Sem 3"
                                name='sem3'
                                step="0.01"
                                className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.SGPA?.sem3}
                                onChange={handleDataChangeForSGPA}
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white transition-opacity bg-green-600 opacity-0 rounded-bl-md group-hover:opacity-100">Sem 3</div>
                          </div>
                          
                          <div className="relative group">
                            <FloatingLabel controlId="floatingSem4" label="Sem 4">
                              <Form.Control
                                type="number"
                                placeholder="Sem 4"
                                name='sem4'
                                step="0.01"
                                className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.SGPA?.sem4}
                                onChange={handleDataChangeForSGPA}
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white transition-opacity bg-green-600 opacity-0 rounded-bl-md group-hover:opacity-100">Sem 4</div>
                          </div>
                          
                          <div className="relative group">
                            <FloatingLabel controlId="floatingSem5" label="Sem 5">
                              <Form.Control
                                type="number"
                                placeholder="Sem 5"
                                name='sem5'
                                step="0.01"
                                className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.SGPA?.sem5}
                                onChange={handleDataChangeForSGPA}
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white transition-opacity bg-green-600 opacity-0 rounded-bl-md group-hover:opacity-100">Sem 5</div>
                          </div>
                          
                          <div className="relative group">
                            <FloatingLabel controlId="floatingSem6" label="Sem 6">
                              <Form.Control
                                type="number"
                                placeholder="Sem 6"
                                name='sem6'
                                step="0.01"
                                className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.SGPA?.sem6}
                                onChange={handleDataChangeForSGPA}
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white transition-opacity bg-green-600 opacity-0 rounded-bl-md group-hover:opacity-100">Sem 6</div>
                          </div>
                          
                          <div className="relative group">
                            <FloatingLabel controlId="floatingSem7" label="Sem 7">
                              <Form.Control
                                type="number"
                                placeholder="Sem 7"
                                name='sem7'
                                step="0.01"
                                className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.SGPA?.sem7}
                                onChange={handleDataChangeForSGPA}
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white transition-opacity bg-green-600 opacity-0 rounded-bl-md group-hover:opacity-100">Sem 7</div>
                          </div>
                          
                          <div className="relative group">
                            <FloatingLabel controlId="floatingSem8" label="Sem 8">
                              <Form.Control
                                type="number"
                                placeholder="Sem 8"
                                name='sem8'
                                step="0.01"
                                className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.SGPA?.sem8}
                                onChange={handleDataChangeForSGPA}
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white transition-opacity bg-green-600 opacity-0 rounded-bl-md group-hover:opacity-100">Sem 8</div>
                          </div>
                        </div>
                      </div>

                      {/* Current Year and Other Details */}
                      <div className="p-4 space-y-4 bg-white rounded-lg shadow-md">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-green-700">
                          <i className="mr-2 fas fa-calendar-alt"></i>
                          Current Status
                        </h3>
                        
                        <div className="relative mb-4">
                          <FloatingLabel controlId="floatingSelectYear" label="Current Year">
                            <Form.Select
                              aria-label="Current Year Selection"
                              className='transition-all border border-gray-300 shadow-sm cursor-pointer focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50'
                              name='year'
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
                            >
                              <option disabled value="undefined" className='text-gray-400'>Enter Current Year</option>
                              <option value="1">1st Year</option>
                              <option value="2">2nd Year</option>
                              <option value="3">3rd Year</option>
                              <option value="4">4th Year</option>
                            </Form.Select>
                          </FloatingLabel>
                          <div className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 text-white transform translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full">
                            <i className="fas fa-user-graduate"></i>
                          </div>
                        </div>
                        
                        <div className="relative mb-4">
                          <FloatingLabel controlId="floatingLiveKT" label="Live KT's">
                            <Form.Control
                              type="number"
                              placeholder="Live KT's"
                              name='liveKT'
                              className="transition-all border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                              value={userData?.studentProfile?.liveKT || 0}
                              onChange={(e) => {
                                setUserData({
                                  ...userData,
                                  studentProfile: {
                                    ...userData?.studentProfile,
                                    liveKT: e.target.value
                                  }
                                });
                              }}
                            />
                          </FloatingLabel>
                          <div className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 text-white transform translate-x-1/2 -translate-y-1/2 bg-yellow-500 rounded-full">
                            <i className="fas fa-exclamation-circle"></i>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <Form.Check
                            type="switch"
                            id="gap"
                            className="flex items-center"
                            checked={userData?.studentProfile?.gap === "true" || userData?.studentProfile?.gap === true}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  gap: e.target.checked
                                }
                              });
                            }}
                            name='gap'
                            label={
                              <span className="flex items-center ml-2 font-medium">
                                <i className="mr-2 text-purple-600 fas fa-hourglass-half"></i>
                                Academic Gap Year
                              </span>
                            }
                          />
                        </div>
                        
                        {cgpa !== "NaN" && (
                          <div className="relative p-4 mt-6 overflow-hidden text-center bg-white border-2 border-green-300 rounded-lg shadow-inner">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-300 via-green-500 to-green-300"></div>
                            <h3 className="text-sm font-medium text-gray-500">CUMULATIVE GRADE POINT AVERAGE</h3>
                            <div className="mt-1 text-4xl font-bold text-green-600">{cgpa}</div>
                            <div className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 text-white bg-green-500 rounded-tl-lg">
                              <i className="fas fa-award"></i>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Past Qualification Section */}
                <div className={`transition-all duration-500 ${activeTab === 'past' ? 'block' : 'hidden'}`}>
                  <div className="p-6 overflow-hidden border-2 border-purple-100 rounded-lg shadow-lg bg-gradient-to-br from-white to-purple-50">
                    <div className="flex items-center gap-3 mb-6 text-2xl text-purple-800">
                      <div className="flex items-center justify-center w-10 h-10 text-white bg-purple-500 rounded-lg shadow-md">
                        <i className="fas fa-history"></i>
                      </div>
                      <span className="font-bold">Past Qualification</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {/* SSC Details */}
                      <div className="p-4 transition-all bg-white border border-purple-100 rounded-lg shadow-md hover:shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-purple-700">SSC Details</h3>
                          <div className="flex items-center justify-center w-10 h-10 text-white bg-purple-500 rounded-full">
                            <i className="fas fa-school"></i>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <FloatingLabel controlId="floatingSelectSSC" label="SSC Board Name">
                            <Form.Select
                              aria-label="SSC Board Selection"
                              className='transition-all border border-gray-300 shadow-sm cursor-pointer focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50'
                              name='sscBoard'
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
                            >
                              <option disabled value="undefined" className='text-gray-400'>Enter Your SSC Board Name</option>
                              <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">Council of Higher Secondary Education (CHSE)</option>
                              <option value="Central Board of Secondary Education (CBSE)">Central Board of Secondary Education (CBSE)</option>
                              <option value="Council for the Indian School Certificate Examinations (CISCE)">Council for the Indian School Certificate Examinations (CISCE)</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </FloatingLabel>
                          
                          <div className="relative">
                            <FloatingLabel controlId="floatingSSCMarks" label="SSC Percentage">
                              <Form.Control
                                type="number"
                                placeholder="SSC Percentage"
                                name='sscPercentage'
                                className="transition-all border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.pastQualification?.ssc?.percentage}
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
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 flex items-center h-full px-3 text-gray-500">%</div>
                          </div>
                          
                          <FloatingLabel controlId="floatingSelectSSCPassingYear" label="SSC Passing Year">
                            <Form.Control
                              type="number"
                              placeholder="SSC Passing Year"
                              name='sscPassingYear'
                              className="transition-all border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                              value={userData?.studentProfile?.pastQualification?.ssc?.year}
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
                            />
                          </FloatingLabel>
                        </div>
                      </div>

                      {/* HSC Details */}
                      <div className="p-4 transition-all bg-white border border-purple-100 rounded-lg shadow-md hover:shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-purple-700">HSC Details</h3>
                          <div className="flex items-center justify-center w-10 h-10 text-white bg-purple-500 rounded-full">
                            <i className="fas fa-book-reader"></i>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <FloatingLabel controlId="floatingSelectHSC" label="HSC Board Name">
                            <Form.Select
                              aria-label="HSC Board Selection"
                              className='transition-all border border-gray-300 shadow-sm cursor-pointer focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50'
                              name='hscBoard'
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
                            >
                              <option disabled value="undefined" className='text-gray-400'>Enter Your HSC Board Name</option>
                              <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">Board of Secondary Education, Odisha (BSE)</option>
                              <option value="Central Board of Secondary Education (CBSE)">Central Board of Secondary Education (CBSE)</option>
                              <option value="Council for the Indian School Certificate Examinations (CISCE)">Council for the Indian School Certificate Examinations (CISCE)</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </FloatingLabel>
                          
                          <div className="relative">
                            <FloatingLabel controlId="floatingHSCMarks" label="HSC Percentage">
                              <Form.Control
                                type="number"
                                placeholder="HSC Percentage"
                                name='hscPercentage'
                                className="transition-all border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.pastQualification?.hsc?.percentage || ""}
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
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 flex items-center h-full px-3 text-gray-500">%</div>
                          </div>
                          
                          <FloatingLabel controlId="floatingSelectHSCPassingYear" label="HSC Passing Year">
                            <Form.Control
                              type="number"
                              placeholder="HSC Passing Year"
                              name='hscPassingYear'
                              className="transition-all border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                              value={userData?.studentProfile?.pastQualification?.hsc?.year || ""}
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
                            />
                          </FloatingLabel>
                        </div>
                      </div>

                      {/* Diploma Details */}
                      <div className="p-4 transition-all bg-white border border-purple-100 rounded-lg shadow-md hover:shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-purple-700">Diploma Details</h3>
                          <div className="flex items-center justify-center w-10 h-10 text-white bg-purple-500 rounded-full">
                            <i className="fas fa-certificate"></i>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <FloatingLabel controlId="floatingSelectDiploma" label="Diploma Board Name">
                            <Form.Select
                              aria-label="Diploma Board Selection"
                              className='transition-all border border-gray-300 shadow-sm cursor-pointer focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50'
                              name='diplomaBoard'
                              value={userData?.studentProfile?.pastQualification?.diploma?.board || "undefined"}
                              onChange={(e) => {
                                setUserData({
                                  ...userData,
                                  studentProfile: {
                                    ...userData?.studentProfile,
                                    pastQualification: {
                                      ...userData?.studentProfile?.pastQualification,
                                      diploma: {
                                        ...userData?.studentProfile?.pastQualification?.diploma,
                                        board: e.target.value
                                      }
                                    }
                                  }
                                });
                              }}
                            >
                              <option disabled value="undefined" className='text-gray-400'>Enter Your Diploma University Name</option>
                              <option value="Mumbai University">Kalinga Institute of Industrial Technology (KIIT)</option>
                              <option value="NoDiploma">Government Polytechnic, Bhubaneswar</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </FloatingLabel>
                          
                          <div className="relative">
                            <FloatingLabel controlId="floatingDiplomaMarks" label="Diploma Percentage">
                              <Form.Control
                                type="number"
                                placeholder="Diploma Percentage"
                                name='diplomaPercentage'
                                className="transition-all border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                value={userData?.studentProfile?.pastQualification?.diploma?.percentage || ""}
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
                              />
                            </FloatingLabel>
                            <div className="absolute top-0 right-0 flex items-center h-full px-3 text-gray-500">%</div>
                          </div>
                          
                          <FloatingLabel controlId="floatingSelectDiplomaPassingYear" label="Diploma Passing Year">
                            <Form.Control
                              type="number"
                              placeholder="Diploma Passing Year"
                              name='diplomaPassingYear'
                              className="transition-all border border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                              value={userData?.studentProfile?.pastQualification?.diploma?.year || ""}
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
                            />
                          </FloatingLabel>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center mt-8">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`relative flex items-center justify-center px-8 py-3 overflow-hidden text-lg font-bold text-white transition-all rounded-lg group ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    <span className="absolute top-0 left-0 w-full h-0 transition-all duration-500 ease-out bg-blue-800 rounded-lg group-hover:h-full"></span>
                    <span className="relative flex items-center">
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 mr-3 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="mr-2 fas fa-save"></i>
                          Save Profile
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Progress indicator */}
      {!loading && (
        <div className="mt-8 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Profile Completion</span>
            <span className="text-sm font-medium text-blue-700">
              {Math.min(100, calculateProfileCompletion())}%
            </span>
          </div>
          <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-700" 
              style={{ width: `${Math.min(100, calculateProfileCompletion())}%` }}
            ></div>
          </div>
        </div>
      )}
    </>
  );

  // Helper function to calculate profile completion
  function calculateProfileCompletion() {
    let total = 0;
    let filled = 0;

    // Basic info
    if (userData?.first_name) filled++;
    if (userData?.last_name) filled++;
    if (userData?.email) filled++;
    if (userData?.number) filled++;
    if (userData?.studentProfile?.uin) filled++;
    if (userData?.profile) filled++;
    if (userData?.studentProfile?.resume) filled++;
    total += 7;

    // Academic info
    const sgpaFields = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'];
    sgpaFields.forEach(sem => {
      if (userData?.studentProfile?.SGPA?.[sem]) filled++;
    });
    if (userData?.studentProfile?.year) filled++;
    if (userData?.studentProfile?.liveKT !== undefined) filled++;
    if (userData?.studentProfile?.gap !== undefined) filled++;
    total += 11;

    // Past qualifications
    if (userData?.studentProfile?.pastQualification?.ssc?.board) filled++;
    if (userData?.studentProfile?.pastQualification?.ssc?.percentage) filled++;
    if (userData?.studentProfile?.pastQualification?.ssc?.year) filled++;
    
    if (userData?.studentProfile?.pastQualification?.hsc?.board) filled++;
    if (userData?.studentProfile?.pastQualification?.hsc?.percentage) filled++;
    if (userData?.studentProfile?.pastQualification?.hsc?.year) filled++;
    
    if (userData?.studentProfile?.pastQualification?.diploma?.board) filled++;
    if (userData?.studentProfile?.pastQualification?.diploma?.percentage) filled++;
    if (userData?.studentProfile?.pastQualification?.diploma?.year) filled++;
    
    total += 9;

    return Math.round((filled / total) * 100);
  }
}

export default UpdatePlacementProfile;
