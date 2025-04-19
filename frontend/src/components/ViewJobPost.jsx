import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from './Toast';
import ModalBox from './Modal';
import { BASE_URL } from '../config/backend_url';
import TablePlaceholder from './TablePlaceholder';

function ViewJobPost() {
  document.title = 'CareerConnect | View Job Post';
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for load data
  const [currentUser, setCurrentUser] = useState({});

  // check applied to a job
  const [applied, setApplied] = useState(false);
  const [applicant, setApplicant] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  // check applied to a job
  const fetchApplied = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/check-applied/${jobId}/${currentUser.id}`);
      if (response?.data?.applied) {
        setApplied(response?.data?.applied);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error.response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while fetching student applied or not => ", error);
    }
  };

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
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
        setToastMessage(err.message);
        setShowToast(true);
      });
  }, []);

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg);
        else setToastMessage(error.message);
        setShowToast(true);

        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${data.company}`);
      setCompany(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    }
  };

  // handle apply and its modal
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleApply = () => {
    setModalBody("Do you really want to apply for this job? Make sure your profile is updated with the latest information to increase your chances of placement.");
    setShowModal(true);
  };

  const handleConfirmApply = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/student/job/${jobId}/${currentUser.id}`);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setShowModal(false);
      fetchApplied();
    } catch (error) {
      setShowModal(false);
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while fetching apply to job => ", error);
    }
  };

  const fetchApplicant = async () => {
    if (!jobId || currentUser?.role === 'student') return;
    await axios.get(`${BASE_URL}/tpo/job/applicants/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res?.data?.msg) setToastMessage(res.data.msg);
        else setApplicant(res?.data?.applicantsList);
      })
      .catch(err => {
        console.log(err);
        if (err?.response?.data?.msg) setToastMessage(err.response.data.msg);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser.id) {
          await fetchJobDetail();
          if (currentUser.role === 'student') {
            await fetchApplied();
          }
        }
      } catch (error) {
        console.error("Error during fetching job details:", error);
      }
    };

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        if (data?.company) {
          await fetchCompanyData();
        }
        if (jobId && currentUser.role !== 'student') {
          await fetchApplicant();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching additional data:", error);
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, [data, currentUser.role]);

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const daysUntilDeadline = () => {
    if (!data?.applicationDeadline) return null;
    
    const deadline = new Date(data.applicationDeadline);
    const today = new Date();
    const diffTime = Math.abs(deadline - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (deadline < today) return { days: diffDays, expired: true };
    return { days: diffDays, expired: false };
  };
  
  const deadlineInfo = daysUntilDeadline();
  
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
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 mb-4 border-4 rounded-full border-t-blue-500 border-r-blue-500 border-b-gray-200 border-l-gray-200 animate-spin"></div>
          <p className="text-lg text-gray-600">Loading job details...</p>
        </div>
      ) : (
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Job Header */}
          <div className="mb-8 overflow-hidden bg-white shadow-lg rounded-2xl">
            <div className="relative">
              {/* Banner/Cover image */}
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              
              {/* Company logo and job title section */}
              <div className="px-6 pb-5">
                <div className="flex flex-col md:flex-row md:items-end">
                  <div className="relative z-10 flex-shrink-0 -mt-12 md:-mt-16">
                    {company?.companyLogo ? (
                      <img 
                        src={company.companyLogo} 
                        alt={company?.companyName} 
                        className="object-cover w-24 h-24 bg-white border-4 border-white shadow-md md:w-32 md:h-32 rounded-xl"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-24 h-24 bg-blue-100 border-4 border-white shadow-md md:w-32 md:h-32 rounded-xl">
                        <span className="text-3xl font-bold text-blue-500">
                          {company?.companyName?.charAt(0) || 'C'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow mt-4 md:mt-0 md:ml-6">
                    <div className="flex flex-wrap items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                          {data?.jobTitle || "Job Position"}
                        </h1>
                        <p className="flex items-center mt-1 text-lg font-medium text-blue-600">
                          {company?.companyName || "Company"}
                        </p>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        {currentUser.role === 'student' && (
                          <>
                            {applied ? (
                              <Link to={`/student/status/${jobId}`} className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-colors">
                                <i className="mr-2 fas fa-check-circle"></i>
                                Applied - View Status
                              </Link>
                            ) : (
                              <button onClick={handleApply} className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                <i className="mr-2 fas fa-paper-plane"></i>
                                Apply Now
                              </button>
                            )}
                          </>
                        )}
                        {currentUser.role !== 'student' && (
                          <div className="inline-flex space-x-2">
                            <Link 
                              to={`/${currentUser.role === 'tpo_admin' ? 'tpo' : currentUser.role === 'management_admin' ? 'management' : 'admin'}/manage-jobs`}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                            >
                              <i className="mr-2 fas fa-arrow-left"></i>
                              All Jobs
                            </Link>
                            <Link 
                              to={`/${currentUser.role === 'tpo_admin' ? 'tpo' : currentUser.role === 'management_admin' ? 'management' : 'admin'}/edit-job/${jobId}`}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
                            >
                              <i className="mr-2 fas fa-edit"></i>
                              Edit Job
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Job metadata/details bar */}
                    <div className="flex flex-wrap items-center mt-4 text-sm text-gray-500 gap-x-6 gap-y-2">
                      {data?.salary && (
                        <div className="flex items-center">
                          <i className="fas fa-rupee-sign mr-1.5 text-blue-500"></i>
                          <span>{data.salary} LPA</span>
                        </div>
                      )}
                      
                      {company?.companyLocation && (
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt mr-1.5 text-blue-500"></i>
                          <span>{company.companyLocation}</span>
                        </div>
                      )}
                      
                      {data?.applicationDeadline && (
                        <div className="flex items-center">
                          <i className="fas fa-calendar-alt mr-1.5 text-blue-500"></i>
                          <span>
                            Deadline: {formatDate(data.applicationDeadline)}
                            {deadlineInfo && !deadlineInfo.expired && (
                              <span className="ml-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {deadlineInfo.days} days left
                              </span>
                            )}
                            {deadlineInfo && deadlineInfo.expired && (
                              <span className="ml-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Expired
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="px-6 border-t border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap mr-8 ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="mr-2 fas fa-info-circle"></i>
                  Job Details
                </button>
                
                <button
                  onClick={() => setActiveTab('company')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap mr-8 ${
                    activeTab === 'company'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="mr-2 fas fa-building"></i>
                  About Company
                </button>
                
                {currentUser.role !== 'student' && (
                  <button
                    onClick={() => setActiveTab('applicants')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === 'applicants'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className="mr-2 fas fa-users"></i>
                    Applicants
                    {applicant.length > 0 && (
                      <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-blue-100 text-blue-800">
                        {applicant.length}
                      </span>
                    )}
                  </button>
                )}
              </nav>
            </div>
          </div>
          
          {/* Content based on active tab */}
          <div className="p-6 bg-white shadow-lg rounded-xl">
            {/* Job Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-8">
                {/* Job Description */}
                <div>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 text-blue-600 bg-blue-100 rounded-full">
                      <i className="fas fa-briefcase"></i>
                    </div>
                    Job Description
                  </h2>
                  <div className="prose text-gray-700 max-w-none" dangerouslySetInnerHTML={{ __html: data?.jobDescription || 'No description available.' }}></div>
                </div>
                
                {/* Eligibility */}
                <div>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 text-green-600 bg-green-100 rounded-full">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    Eligibility Requirements
                  </h2>
                  <div className="prose text-gray-700 max-w-none" dangerouslySetInnerHTML={{ __html: data?.eligibility || 'No eligibility requirements specified.' }}></div>
                </div>
                
                {/* Annual CTC */}
                <div>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 text-yellow-600 bg-yellow-100 rounded-full">
                      <i className="fas fa-money-bill-wave"></i>
                    </div>
                    Salary Package
                  </h2>
                  <div className="p-6 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="text-2xl font-bold text-blue-900">₹ {data?.salary} <span className="text-lg font-normal text-gray-600">LPA</span></div>
                    <div className="mt-2 text-sm text-gray-600">Annual Cost to Company (CTC)</div>
                  </div>
                </div>
                
                {/* Application Process (Only visible to those who applied or non-students) */}
                {(applied || currentUser?.role !== 'student') && (
                  <div>
                    <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                      <div className="flex items-center justify-center w-8 h-8 mr-2 text-purple-600 bg-purple-100 rounded-full">
                        <i className="fas fa-clipboard-list"></i>
                      </div>
                      Application Process
                    </h2>
                    <div className="prose text-gray-700 max-w-none" dangerouslySetInnerHTML={{ __html: data?.howToApply || 'No specific application instructions provided.' }}></div>
                  </div>
                )}
                
                {/* Application Deadline */}
                <div>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 text-red-600 bg-red-100 rounded-full">
                      <i className="fas fa-hourglass-end"></i>
                    </div>
                    Application Deadline
                  </h2>
                  <div className={`p-4 rounded-lg flex items-center ${
                    deadlineInfo?.expired ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      deadlineInfo?.expired ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <i className={`${deadlineInfo?.expired ? 'fas fa-times' : 'fas fa-calendar-day'} text-xl`}></i>
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">{formatDate(data?.applicationDeadline)}</div>
                      {deadlineInfo?.expired ? (
                        <div className="text-sm text-red-700">Deadline has passed {deadlineInfo.days} days ago</div>
                      ) : (
                        <div className="text-sm text-yellow-700">{deadlineInfo?.days} days remaining</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Company Tab */}
            {activeTab === 'company' && (
              <div className="space-y-8">
                {/* Company Overview */}
                <div>
                  <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 text-blue-600 bg-blue-100 rounded-full">
                      <i className="fas fa-building"></i>
                    </div>
                    Company Overview
                  </h2>
                  <p className="leading-relaxed text-gray-700">
                    {company?.companyDescription || 'No company description available.'}
                  </p>
                </div>
                
                {/* Company Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Website */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-1 text-sm font-medium text-gray-500">Website</div>
                    {company?.companyWebsite ? (
                      <a 
                        href={company.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center font-medium text-blue-600 hover:text-blue-800"
                      >
                        {company.companyWebsite}
                        <i className="ml-2 text-xs fas fa-external-link-alt"></i>
                      </a>
                    ) : (
                      <span className="text-gray-700">Not available</span>
                    )}
                  </div>
                  
                  {/* Location */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-1 text-sm font-medium text-gray-500">Location</div>
                    {company?.companyLocation ? (
                      <div className="flex flex-wrap gap-2">
                        {company.companyLocation.split(',').map((location, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full"
                          >
                            <i className="fas fa-map-marker-alt mr-1.5 text-xs"></i>
                            {location.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-700">Not available</span>
                    )}
                  </div>
                  
                  {/* Difficulty */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-1 text-sm font-medium text-gray-500">Interview Difficulty</div>
                    {company?.companyDifficulty ? (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        company.companyDifficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        company.companyDifficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {company.companyDifficulty === 'Easy' && <i className="fas fa-smile mr-1.5"></i>}
                        {company.companyDifficulty === 'Moderate' && <i className="fas fa-meh mr-1.5"></i>}
                        {company.companyDifficulty === 'Hard' && <i className="fas fa-frown mr-1.5"></i>}
                        {company.companyDifficulty}
                      </span>
                    ) : (
                      <span className="text-gray-700">Not specified</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Applicants Tab (Only for non-students) */}
            {activeTab === 'applicants' && currentUser.role !== 'student' && (
              <div>
                <h2 className="flex items-center mb-6 text-xl font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 mr-2 text-blue-600 bg-blue-100 rounded-full">
                    <i className="fas fa-users"></i>
                  </div>
                  Applicants
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-blue-100 text-blue-800">
                    {applicant.length}
                  </span>
                </h2>
                
                {applicant.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            No.
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Student
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Round
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Applied On
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applicant.map((app, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link
                                to={
                                  currentUser.role === 'tpo_admin'
                                    ? `/tpo/user/${app.id}`
                                    : currentUser.role === 'management_admin'
                                      ? `/management/user/${app.id}`
                                      : `/admin/user/${app.id}`
                                }
                                target='_blank'
                                className="flex items-center group"
                              >
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-blue-700 uppercase bg-blue-100 rounded-full">
                                  {app.name?.[0] || '?'}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-blue-600 group-hover:text-blue-800 group-hover:underline">
                                    {app.name}
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{app.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {app?.currentRound ? (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                                  {app.currentRound.charAt(0).toUpperCase() + app.currentRound.slice(1)}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                app.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'selected' ? 'bg-green-100 text-green-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-4 text-gray-400">
                      <i className="text-5xl fas fa-user-clock"></i>
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">No Applicants Yet</h3>
                    <p className="max-w-md mx-auto mb-4 text-gray-500">
                      This job posting has not received any applications yet. Check back later or promote the job to attract more candidates.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ModalBox Component for Apply Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header="Apply for This Job"
        body={
          <div className="p-4">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 text-blue-600 bg-blue-100 rounded-full">
                <i className="text-2xl fas fa-paper-plane"></i>
              </div>
            </div>
            <p className="mb-4 text-center text-gray-800">
              {modalBody}
            </p>
            <div className="p-4 mb-4 border-l-4 border-yellow-400 bg-yellow-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="text-yellow-400 fas fa-exclamation-circle"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Make sure your profile is complete and up-to-date before applying.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <i className="mr-1 text-blue-500 far fa-calendar-alt"></i>
                Applied on: {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <i className="mr-1 text-green-500 far fa-clock"></i>
                Initial status: Applied
              </div>
            </div>
          </div>
        }
        btn="Confirm Application"
        btnClass="bg-blue-600 hover:bg-blue-700"
        confirmAction={handleConfirmApply}
      />
    </>
  );
}

export default ViewJobPost;
