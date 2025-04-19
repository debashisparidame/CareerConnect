import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Toast from './Toast';
import { BASE_URL } from '../config/backend_url';

function ViewUserData() {
  document.title = 'CareerConnect | User Details';
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentUserData, setCurrentUserData] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  
  // count of interview
  const [placement, setPlacement] = useState({});
  
  // if student placed then job details
  const [jobDetail, setJobDetail] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch current user data
        const currentUserResponse = axios.get(`${BASE_URL}/user/detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch student data using userId
        const studentDataResponse = axios.get(`${BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Await both responses simultaneously
        const [currentUserDataRes, studentDataRes] = await Promise.all([
          currentUserResponse,
          studentDataResponse,
        ]);

        setCurrentUserData(currentUserDataRes.data);
        setUserData(studentDataRes.data);

        if (studentDataRes.data?.studentProfile?.appliedJobs) {
          const appliedJobs = studentDataRes.data.studentProfile.appliedJobs;

          // Count interview and rejection statuses
          const interviewCount = appliedJobs.filter((app) => app.status === "interview").length;
          const rejectCount = appliedJobs.filter((app) => app.status === "rejected").length;

          // Check if the student has been hired
          const hiredJob = appliedJobs.find((app) => app.status === "hired");

          // Set placement state
          setPlacement({
            interview: interviewCount,
            reject: rejectCount,
            isPlaced: !!hiredJob,
            packageOffered: hiredJob ? hiredJob.package : null,
            jobId: hiredJob ? hiredJob.jobId._id : null,
          });
        }

        // Fetch job details if the student has a job placement
        if (placement.jobId) {
          const jobDetailResponse = await axios.get(`${BASE_URL}/tpo/job/${placement.jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJobDetail(jobDetailResponse.data);

          // Fetch company details based on job's company
          if (jobDetailResponse.data.company) {
            const companyResponse = await axios.get(`${BASE_URL}/company/company-data?companyId=${jobDetailResponse.data.company}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCompany(companyResponse.data.company);
          }
        }

      } catch (error) {
        if (error.response?.data) {
          setToastMessage(error.response.data.msg || error.message);
          setShowToast(true);
          if (error.response.data.msg === "Student not found" || "user not found") {
            navigate("../404");
          }
        } else {
          console.error("Error fetching data", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId, placement.jobId, placement.companyId]);

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

  // Calculate CGPA from SGPA values
  const calculateCGPA = () => {
    if (!userData?.studentProfile?.SGPA) return null;
    
    const sgpa = userData.studentProfile.SGPA;
    const validSemesters = Object.values(sgpa).filter(val => val && !isNaN(val));
    
    if (validSemesters.length === 0) return null;
    
    const sum = validSemesters.reduce((acc, val) => acc + parseFloat(val), 0);
    return (sum / validSemesters.length).toFixed(2);
  };

  const cgpa = calculateCGPA();
  
  // Format academic year range (e.g., "2020-2024")
  const getAcademicYearRange = () => {
    if (!userData?.studentProfile?.addmissionYear) return null;
    
    const admissionYear = parseInt(userData.studentProfile.addmissionYear);
    const graduationYear = admissionYear + 4; // Assuming 4-year course
    
    return `${admissionYear}-${graduationYear}`;
  };
  
  // Generate initials from name
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
      {/* Toast Component */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 mb-4 border-4 rounded-full border-t-transparent animate-spin" 
               style={{borderColor: `var(--color-${roleColor}-500) transparent var(--color-${roleColor}-300) transparent`}}></div>
          <p className="text-lg text-gray-600">Loading user profile...</p>
        </div>
      ) : (
        <div className="px-4 py-8 mx-auto max-w-7xl">
          {/* Profile header */}
          <div className="mb-6 overflow-hidden bg-white shadow-lg rounded-2xl">
            <div className="relative">
              {/* Cover background */}
              <div className={`h-48 bg-gradient-to-r from-${roleColor}-500 to-${roleColor}-700 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-white opacity-20" style={{ 
                    backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')",
                    backgroundSize: "24px 24px"
                  }}></div>
                </div>
              </div>
              
              {/* Profile info section */}
              <div className="px-6 pb-5">
                <div className="flex flex-col md:flex-row">
                  {/* Avatar */}
                  <div className="relative z-10 flex-shrink-0 -mt-16">
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
                    
                    {/* Role badge */}
                    <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-medium bg-${roleColor}-100 text-${roleColor}-800 border-2 border-white`}>
                      {userData?.role?.replace('_', ' ')}
                    </div>
                  </div>
                  
                  {/* User info */}
                  <div className="flex-grow mt-6 md:mt-0 md:ml-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {userData?.first_name} {userData?.middle_name || ''} {userData?.last_name || ''}
                      </h1>
                      <p className="flex items-center mt-1 mb-3 text-gray-600">
                        <i className="mr-2 text-gray-400 fas fa-envelope"></i>
                        {userData?.email}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-1">
                      {userData?.number && (
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="mr-2 text-gray-400 fas fa-phone"></i>
                          {userData?.number}
                        </div>
                      )}
                      
                      {userData?.gender && (
                        <div className="flex items-center text-sm text-gray-600">
                          <i className={`fas fa-${userData.gender.toLowerCase() === 'male' ? 'mars' : userData.gender.toLowerCase() === 'female' ? 'venus' : 'genderless'} mr-2 text-gray-400`}></i>
                          {userData?.gender}
                        </div>
                      )}
                      
                      {userData?.dateOfBirth && (
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="mr-2 text-gray-400 fas fa-birthday-cake"></i>
                          {new Date(userData?.dateOfBirth).toLocaleDateString('en-IN')}
                        </div>
                      )}
                    </div>
                    
                    {userData?.studentProfile?.isApproved !== undefined && (
                      <div className={`inline-flex items-center px-3 py-1 mt-3 rounded-full text-sm font-medium ${userData?.studentProfile?.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        <i className={`fas fa-${userData?.studentProfile?.isApproved ? 'check-circle' : 'clock'} mr-2`}></i>
                        {userData?.studentProfile?.isApproved ? 'Approved' : 'Pending Approval'}
                      </div>
                    )}
                    
                    {userData?.role === "student" && placement?.isPlaced === true && (
                      <div className="inline-flex items-center px-3 py-1 mt-3 ml-2 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                        <i className="mr-2 fas fa-briefcase"></i>
                        Placed at {company?.companyName || 'Company'}
                      </div>
                    )}
                  </div>
                  
                  {/* Resume button */}
                  {userData?.studentProfile?.resume && userData?.role === 'student' && (
                    <div className="mt-4 md:flex md:flex-col md:items-end md:justify-start shrink-0 md:mt-0">
                      <a 
                        href={userData?.studentProfile?.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <i className="mr-2 fas fa-file-pdf"></i>
                        View Resume
                      </a>
                      <p className="max-w-xs mt-1 text-xs text-gray-500 truncate">
                        {userData?.studentProfile?.resume?.filename || 'Resume'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tab navigation */}
            <div className="px-6 border-t border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap mr-8 ${
                    activeTab === 'personal'
                      ? `border-${roleColor}-500 text-${roleColor}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="mr-2 fas fa-user"></i>
                  Personal Info
                </button>
                
                {userData?.role === "student" && userData?.isProfileCompleted === true && (
                  <>
                    <button
                      onClick={() => setActiveTab('academic')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap mr-8 ${
                        activeTab === 'academic'
                          ? `border-${roleColor}-500 text-${roleColor}-600`
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <i className="mr-2 fas fa-graduation-cap"></i>
                      Academic Info
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('placement')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap mr-8 ${
                        activeTab === 'placement'
                          ? `border-${roleColor}-500 text-${roleColor}-600`
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <i className="mr-2 fas fa-briefcase"></i>
                      Placement Status
                    </button>
                    
                    {userData?.studentProfile?.internships?.length > 0 && (
                      <button
                        onClick={() => setActiveTab('internships')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === 'internships'
                            ? `border-${roleColor}-500 text-${roleColor}-600`
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <i className="mr-2 fas fa-laptop"></i>
                        Internships
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs bg-${roleColor}-100 text-${roleColor}-800`}>
                          {userData?.studentProfile?.internships?.length}
                        </span>
                      </button>
                    )}
                  </>
                )}
              </nav>
            </div>
          </div>
          
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Basic Info Card */}
              <div className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                    <i className="fas fa-id-card"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3">
                    <div className="text-gray-500">Full Name</div>
                    <div className="col-span-2 font-medium">
                      {userData?.first_name} {userData?.middle_name || ''} {userData?.last_name || ''}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <div className="text-gray-500">Email</div>
                    <div className="col-span-2 font-medium">{userData?.email}</div>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <div className="text-gray-500">Phone</div>
                    <div className="col-span-2 font-medium">{userData?.number || 'Not provided'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <div className="text-gray-500">Gender</div>
                    <div className="col-span-2 font-medium">{userData?.gender || 'Not provided'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <div className="text-gray-500">Date of Birth</div>
                    <div className="col-span-2 font-medium">
                      {userData?.dateOfBirth 
                        ? new Date(userData.dateOfBirth).toLocaleDateString('en-IN', {
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric'
                          })
                        : 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <div className="text-gray-500">Joined On</div>
                    <div className="col-span-2 font-medium">
                      {new Date(userData?.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <div className="text-gray-500">Role</div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${roleColor}-100 text-${roleColor}-800`}>
                        {userData?.role?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Address Card */}
              <div className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Contact Address</h2>
                </div>
                
                {userData?.fullAddress ? (
                  <div className="text-gray-800">
                    <div className="p-4 mb-3 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="mb-2 whitespace-pre-line">{userData?.fullAddress?.address}</p>
                      {userData?.fullAddress?.pincode && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">Postal Code:</span> 
                          <span className="ml-2 font-medium">{userData?.fullAddress?.pincode}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          userData?.fullAddress?.address + ', ' + userData?.fullAddress?.pincode
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm bg-${roleColor}-50 text-${roleColor}-700 hover:bg-${roleColor}-100`}
                      >
                        <i className="fas fa-map-marked-alt mr-1.5"></i>
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    <i className="mb-2 text-5xl text-gray-300 fas fa-home"></i>
                    <p>No address information available</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Academic Info Tab */}
          {activeTab === 'academic' && userData?.role === "student" && userData?.isProfileCompleted === true && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* College Information Card */}
              <div className="col-span-2 p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                    <i className="fas fa-university"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">College Information</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="mb-3 text-sm tracking-wider text-gray-500 uppercase">Student Details</h3>
                    
                    <div className="space-y-3 text-sm">
                      {userData?.studentProfile?.UIN && (
                        <div className="grid grid-cols-3">
                          <div className="text-gray-500">UIN</div>
                          <div className="col-span-2 font-medium">{userData.studentProfile.UIN}</div>
                        </div>
                      )}
                      
                      {userData?.studentProfile?.rollNumber && (
                        <div className="grid grid-cols-3">
                          <div className="text-gray-500">Roll Number</div>
                          <div className="col-span-2 font-medium">{userData.studentProfile.rollNumber}</div>
                        </div>
                      )}
                      
                      {userData?.studentProfile?.department && (
                        <div className="grid grid-cols-3">
                          <div className="text-gray-500">Department</div>
                          <div className="col-span-2 font-medium">{userData.studentProfile.department} Engineering</div>
                        </div>
                      )}
                      
                      {userData?.studentProfile?.year && (
                        <div className="grid grid-cols-3">
                          <div className="text-gray-500">Year</div>
                          <div className="col-span-2 font-medium">
                            {userData.studentProfile.year}<sup>
                              {userData.studentProfile.year === 1 && 'st'}
                              {userData.studentProfile.year === 2 && 'nd'}
                              {userData.studentProfile.year === 3 && 'rd'}
                              {userData.studentProfile.year === 4 && 'th'}
                            </sup> Year
                          </div>
                        </div>
                      )}
                      
                      {userData?.studentProfile?.addmissionYear && (
                        <div className="grid grid-cols-3">
                          <div className="text-gray-500">Batch</div>
                          <div className="col-span-2 font-medium">{getAcademicYearRange()}</div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-3">
                        <div className="text-gray-500">Live KTs</div>
                        <div className="col-span-2 font-medium">{userData?.studentProfile?.liveKT || '0'}</div>
                      </div>
                      
                      <div className="grid grid-cols-3">
                        <div className="text-gray-500">Gap Year</div>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userData?.studentProfile?.gap 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {userData?.studentProfile?.gap ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* SGPA Section */}
                  {userData?.studentProfile?.SGPA && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm tracking-wider text-gray-500 uppercase">Semester Grades</h3>
                        {cgpa && (
                          <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${roleColor}-100 text-${roleColor}-800`}>
                            CGPA: {cgpa}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(userData.studentProfile.SGPA)
                          .filter(([key, value]) => value && !isNaN(value))
                          .map(([sem, value]) => (
                            <div 
                              key={sem}
                              className="p-3 transition-shadow border border-gray-100 rounded-lg bg-gray-50 hover:shadow-md"
                            >
                              <div className="mb-1 text-sm text-gray-500">
                                Semester {sem.replace('sem', '')}
                              </div>
                              <div className="text-lg font-semibold text-gray-800">
                                {value}
                              </div>
                              <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`bg-${roleColor}-500 h-1.5 rounded-full`} 
                                  style={{ width: `${Math.min(parseFloat(value) * 10, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Past Qualifications Card */}
              {userData?.studentProfile?.pastQualification && (
                <div className="p-6 bg-white shadow-md rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                      <i className="fas fa-school"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Past Qualifications</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* SSC */}
                    {userData.studentProfile.pastQualification.ssc && (
                      <div className="p-4 border-l-4 border-blue-400 rounded-lg bg-gray-50">
                        <div className="mb-2 font-semibold text-gray-700">SSC (10th)</div>
                        <div className="space-y-2 text-sm">
                          {userData.studentProfile.pastQualification.ssc.board && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Board</div>
                              <div className="col-span-2">{userData.studentProfile.pastQualification.ssc.board}</div>
                            </div>
                          )}
                          
                          {userData.studentProfile.pastQualification.ssc.year && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Year</div>
                              <div className="col-span-2">{userData.studentProfile.pastQualification.ssc.year}</div>
                            </div>
                          )}
                          
                          {userData.studentProfile.pastQualification.ssc.percentage && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Percentage</div>
                              <div className="col-span-2 font-medium">
                                {userData.studentProfile.pastQualification.ssc.percentage}%
                                
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-400 h-1.5 rounded-full" 
                                    style={{ width: `${Math.min(parseFloat(userData.studentProfile.pastQualification.ssc.percentage), 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* HSC */}
                    {userData.studentProfile.pastQualification.hsc && (
                      <div className="p-4 border-l-4 border-green-400 rounded-lg bg-gray-50">
                        <div className="mb-2 font-semibold text-gray-700">HSC (12th)</div>
                        <div className="space-y-2 text-sm">
                          {userData.studentProfile.pastQualification.hsc.board && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Board</div>
                              <div className="col-span-2">{userData.studentProfile.pastQualification.hsc.board}</div>
                            </div>
                          )}
                          
                          {userData.studentProfile.pastQualification.hsc.year && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Year</div>
                              <div className="col-span-2">{userData.studentProfile.pastQualification.hsc.year}</div>
                            </div>
                          )}
                          
                          {userData.studentProfile.pastQualification.hsc.percentage && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Percentage</div>
                              <div className="col-span-2 font-medium">
                                {userData.studentProfile.pastQualification.hsc.percentage}%
                                
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-400 h-1.5 rounded-full" 
                                    style={{ width: `${Math.min(parseFloat(userData.studentProfile.pastQualification.hsc.percentage), 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Diploma */}
                    {userData.studentProfile.pastQualification.diploma && (
                      <div className="p-4 border-l-4 border-purple-400 rounded-lg bg-gray-50">
                        <div className="mb-2 font-semibold text-gray-700">Diploma</div>
                        <div className="space-y-2 text-sm">
                          {userData.studentProfile.pastQualification.diploma.department && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Department</div>
                              <div className="col-span-2">{userData.studentProfile.pastQualification.diploma.department}</div>
                            </div>
                          )}
                          
                          {userData.studentProfile.pastQualification.diploma.year && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Year</div>
                              <div className="col-span-2">{userData.studentProfile.pastQualification.diploma.year}</div>
                            </div>
                          )}
                          
                          {userData.studentProfile.pastQualification.diploma.percentage && (
                            <div className="grid grid-cols-3">
                              <div className="text-gray-500">Percentage</div>
                              <div className="col-span-2 font-medium">
                                {userData.studentProfile.pastQualification.diploma.percentage}%
                                
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-purple-400 h-1.5 rounded-full" 
                                    style={{ width: `${Math.min(parseFloat(userData.studentProfile.pastQualification.diploma.percentage), 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Placement Status Tab */}
          {activeTab === 'placement' && userData?.role === "student" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {/* Job Applications Statistics */}
              <div className="p-6 bg-white shadow-md md:col-span-8 rounded-xl">
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Placement Journey</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-1 text-sm text-gray-500">Jobs Applied</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {userData?.studentProfile?.appliedJobs?.length || 0}
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <i className="mr-1 fas fa-paper-plane"></i>
                      Total applications
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-1 text-sm text-gray-500">Interviews</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {placement?.interview || 0}
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <i className="mr-1 fas fa-user-tie"></i>
                      Interview rounds
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-1 text-sm text-gray-500">Rejections</div>
                    <div className="text-2xl font-bold text-red-500">
                      {placement?.reject || 0}
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <i className="mr-1 fas fa-times-circle"></i>
                      Not selected
                    </div>
                  </div>
                </div>
                
                {/* Placement Status */}
                <div className={`rounded-lg p-5 ${placement?.isPlaced ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      placement?.isPlaced ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <i className={`fas fa-${placement?.isPlaced ? 'check-circle' : 'search'} text-xl`}></i>
                    </div>
                    <div className="ml-4">
                      <h3 className={`text-lg font-semibold ${placement?.isPlaced ? 'text-green-700' : 'text-blue-700'}`}>
                        {placement?.isPlaced ? 'Successfully Placed' : 'Placement Status'}
                      </h3>
                      <p className={placement?.isPlaced ? 'text-green-600' : 'text-blue-600'}>
                        {placement?.isPlaced 
                          ? `Placed at ${company?.companyName || 'Company'} with package of ₹${placement?.packageOffered} LPA`
                          : 'Currently seeking placement opportunities'}
                      </p>
                    </div>
                  </div>
                  
                  {placement?.isPlaced && jobDetail?.jobTitle && (
                    <div className="pt-4 mt-4 border-t border-green-200">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <div className="text-sm text-green-700">Position</div>
                          <div className="font-medium">{jobDetail.jobTitle}</div>
                        </div>
                        
                        {company?.companyLocation && (
                          <div>
                            <div className="text-sm text-green-700">Location</div>
                            <div className="font-medium">{company.companyLocation}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Job Applications List */}
              <div className="p-6 bg-white shadow-md md:col-span-4 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Job Applications</h2>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${roleColor}-100 text-${roleColor}-800`}>
                    {userData?.studentProfile?.appliedJobs?.length || 0}
                  </div>
                </div>
                
                {userData?.studentProfile?.appliedJobs?.length > 0 ? (
                  <div className="space-y-4">
                    {userData.studentProfile.appliedJobs.map((job, index) => {
                      const applicant = job.jobId?.applicants?.find(applicant => applicant.studentId === userData._id);
                      
                      return (
                        <div key={index} className="p-3 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between">
                            <div className="font-medium text-gray-800">{job?.jobId?.jobTitle || 'Job Position'}</div>
                            <div>
                              {job?.status && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  job.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                                  job.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                                  job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  job.status === 'hired' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-1 text-sm text-gray-600">
                            {job?.jobId?.company?.companyName || '-'}
                          </div>
                          
                          <div className="flex justify-between pt-2 mt-2 text-xs text-gray-500 border-t border-gray-100">
                            <div>Applied: {new Date(job?.appliedAt.split('T')[0]).toLocaleDateString('en-IN')}</div>
                            {applicant?.currentRound && (
                              <div className={`font-medium ${
                                applicant.roundStatus === 'passed' ? 'text-green-600' :
                                applicant.roundStatus === 'failed' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {applicant.currentRound.charAt(0).toUpperCase() + applicant.currentRound.slice(1)}
                                {' • '}
                                {applicant.roundStatus.charAt(0).toUpperCase() + applicant.roundStatus.slice(1)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 text-gray-400 bg-gray-100 rounded-full">
                      <i className="text-xl fas fa-search"></i>
                    </div>
                    <p className="text-gray-500">No job applications yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Internships Tab */}
          {activeTab === 'internships' && userData?.role === "student" && userData?.studentProfile?.internships?.length > 0 && (
            <div className="overflow-hidden bg-white shadow-md rounded-xl">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600 mr-3`}>
                      <i className="fas fa-laptop-code"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Internship Experience</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${roleColor}-100 text-${roleColor}-800`}>
                    {userData?.studentProfile?.internships?.length} internships
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Company</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Website</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Duration</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Stipend</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userData?.studentProfile?.internships?.map((internship, index) => (
                      <tr key={index} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${roleColor}-100 flex items-center justify-center text-${roleColor}-600`}>
                              {internship?.companyName?.[0] || 'C'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{internship?.companyName}</div>
                              <div className="text-sm text-gray-500">
                                {internship.startDate && internship.endDate && (
                                  <>
                                    {new Date(internship.startDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })} - {' '}
                                    {new Date(internship.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                                  </>
                                )}
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
                              Visit
                              <i className="ml-1 text-xs fas fa-external-link-alt"></i>
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                            internship?.type === 'remote' ? 'bg-purple-100 text-purple-800' :
                            internship?.type === 'hybrid' ? 'bg-yellow-100 text-yellow-800' :
                            internship?.type === 'in-office' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {internship?.type || 'Not specified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {internship?.internshipDuration ? `${internship?.internshipDuration} days` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {internship?.monthlyStipend ? (
                            <div className="text-sm text-gray-900">₹{internship?.monthlyStipend.toLocaleString('en-IN')}/month</div>
                          ) : (
                            <span className="text-gray-400">Unpaid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ViewUserData;
