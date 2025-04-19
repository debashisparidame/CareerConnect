import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Toast from '../Toast';
import ModalBox from '../Modal';
import UploadOfferLetter from './UploadOfferLetter';
import { BASE_URL } from '../../config/backend_url';
import { 
  FaBuilding, FaSpinner, FaUser, FaEnvelope, FaPhone, FaIdCard, 
  FaBriefcase, FaCalendarAlt, FaSave, FaTrashAlt, FaFileAlt, 
  FaCheck, FaTimes, FaChevronDown, FaEye 
} from 'react-icons/fa';

function UpdateJobStatus() {
  document.title = 'CareerConnect | Update Job Application Status';
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  const [applicant, setApplicant] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [eyeIsHover, setEyeIsHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isHired, setHired] = useState(false);
  const [activeSection, setActiveSection] = useState('both');

  const closeModal = () => setShowModal(false);

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
          first_name: res.data.first_name,
          middle_name: res.data.middle_name,
          last_name: res.data.last_name,
          email: res.data.email,
          number: res.data.number,
          role: res.data.role,
          uin: res.data.studentProfile.uin,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
        setToastMessage(err);
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

  const fetchJobDetailsOfApplicant = async () => {
    if (data?.applicants?.length !== 0) {
      const appliedApplicant = await data.applicants.find(app => app.studentId === currentUser.id);
      if (appliedApplicant) setApplicant(appliedApplicant);
      else navigate('../404');

      if (appliedApplicant.status === 'hired') setHired(true);
    }
  };

  const handleSubmit = async () => {
    if (applicant?.status === 'hired' && !applicant?.package) {
      setToastMessage("Package Offered Required!");
      setShowToast(true);
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/student/update-status/${jobId}/${currentUser.id}`, { applicant });
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error while update job status => ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchJobDetail();
        if (data?.company) {
          await fetchCompanyData();
        }
        if (data?.applicants && currentUser?.id) {
          await fetchJobDetailsOfApplicant();
        }
        if (applicant.status === 'hired') setHired(true);
        setLoading(false);
      } catch (error) {
        setToastMessage("Error during fetching and applying job");
        setShowToast(true);
        console.error("Error during fetching and applying job:", error);
      }
    };

    fetchData();
  }, [currentUser?.id, data?.company, jobId]);

  const handleApplicantChange = (e) => {
    setApplicant({
      ...applicant,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'status' && e.target.value === 'hired') setHired(true);
    if (e.target.name === 'status' && e.target.value !== 'hired') setHired(false);
  };

  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const handleDelete = () => setShowModal(true);

  const confirmDelete = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/student/delete-offer-letter/${jobId}/${currentUser.id}`, { applicant });
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
        setShowModal(false);
        await fetchJobDetail();
        await fetchJobDetailsOfApplicant();
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      setShowModal(false);
      console.log("Error while update job status => ", error);
    }
  };

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case 'passed':
        return "bg-green-100 text-green-800 border-green-200";
      case 'failed':
        return "bg-red-100 text-red-800 border-red-200";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'applied':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'interview':
        return "bg-purple-100 text-purple-800 border-purple-200";
      case 'hired':
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case 'rejected':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="px-4 py-6 bg-gray-50 min-h-[90vh]">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Update Application Status</h1>
            <p className="mt-1 text-sm text-gray-600">
              Keep your job application status updated and track your progress
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FaSpinner className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="mt-4 text-lg font-medium text-blue-600">Loading application data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Job Overview Card */}
              <div className="p-6 overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 text-white bg-blue-600 rounded-lg">
                      <FaBriefcase className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-gray-800">{data?.jobTitle}</h2>
                      <div className="flex items-center mt-1">
                        <FaBuilding className="w-4 h-4 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-600">{company?.companyName}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 text-sm font-medium border rounded-full ${getStatusBadge(applicant?.status || 'applied')}`}>
                    {applicant?.status ? applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1) : 'Applied'}
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-6 border-b border-gray-200">
                  <button 
                    className={`px-4 py-2 text-sm font-medium -mb-px ${activeSection === 'both' || activeSection === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveSection('profile')}
                  >
                    Profile Information
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium -mb-px ${activeSection === 'both' || activeSection === 'application' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveSection('application')}
                  >
                    Application Status
                  </button>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Basic Info Section */}
                  {(activeSection === 'both' || activeSection === 'profile') && (
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-4 text-sm font-medium text-gray-500 uppercase">Personal Information</h3>

                      <div className="space-y-3">
                        <div className="flex">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                            <FaUser className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Full Name</p>
                            <p className="text-sm font-medium text-gray-800">
                              {currentUser?.first_name + " "}
                              {currentUser?.middle_name && currentUser?.middle_name + " "}
                              {currentUser?.last_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                            <FaEnvelope className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-800">{currentUser?.email}</p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                            <FaPhone className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-800">{currentUser?.number}</p>
                          </div>
                        </div>

                        {currentUser?.uin && (
                          <div className="flex">
                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                              <FaIdCard className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <p className="text-xs font-medium text-gray-500">UIN</p>
                              <p className="text-sm font-medium text-gray-800">{currentUser?.uin}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Application Status Section */}
                  {(activeSection === 'both' || activeSection === 'application') && (
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="mb-4 text-sm font-medium text-gray-500 uppercase">Application Status</h3>
                      
                      <div className="space-y-4">
                        {/* Current Round */}
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-700">Current Round</label>
                          <select
                            name="currentRound"
                            value={applicant?.currentRound || "undefined"}
                            onChange={handleApplicantChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                          >
                            <option disabled value="undefined">Select Current Round</option>
                            <option value="Aptitude Test">Aptitude Test</option>
                            <option value="Technical Interview">Technical Interview</option>
                            <option value="HR Interview">HR Interview</option>
                            <option value="Group Discussion">Group Discussion</option>
                          </select>
                        </div>

                        {/* Round Status */}
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-700">Round Status</label>
                          <select
                            name="roundStatus"
                            value={applicant?.roundStatus || "undefined"}
                            onChange={handleApplicantChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                          >
                            <option disabled value="undefined">Select Round Status</option>
                            <option value="pending">Pending</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>

                        {/* Selection Date */}
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-700">Selection Date</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FaCalendarAlt className="text-gray-400" />
                            </div>
                            <input
                              type="date"
                              name="selectionDate"
                              value={formatDate(applicant?.selectionDate)}
                              onChange={handleApplicantChange}
                              className="w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Joining Date */}
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-700">Joining Date</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FaCalendarAlt className="text-gray-400" />
                            </div>
                            <input
                              type="date"
                              name="joiningDate"
                              value={formatDate(applicant?.joiningDate)}
                              onChange={handleApplicantChange}
                              className="w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Job Status */}
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-700">Job Status</label>
                          <select
                            name="status"
                            value={applicant?.status || "undefined"}
                            onChange={handleApplicantChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                          >
                            <option disabled value="undefined">Select Job Status</option>
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        {/* Package Offered - Only shown when status is hired */}
                        {isHired && (
                          <div>
                            <label className="block mb-1 text-xs font-medium text-gray-700">
                              Package Offered (LPA) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="package"
                              step="0.01"
                              placeholder="Enter package in LPA"
                              value={applicant?.package || ""}
                              onChange={handleApplicantChange}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Offer Letter Section */}
                <div className="p-4 mt-6 rounded-lg bg-gray-50">
                  <h3 className="mb-4 text-sm font-medium text-gray-500 uppercase">Offer Letter</h3>
                  
                  <div className="flex flex-col items-start space-y-4">
                    <UploadOfferLetter jobId={jobId} fetchJobDetailsOfApplicant={fetchJobDetailsOfApplicant} />
                    
                    {applicant?.offerLetter && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        <a
                          href={BASE_URL + applicant?.offerLetter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          <FaEye className="mr-2" />
                          View Offer Letter
                        </a>
                        
                        <button
                          onClick={handleDelete}
                          className="flex items-center px-4 py-2 text-sm font-medium text-white transition bg-red-600 rounded-md hover:bg-red-700"
                        >
                          <FaTrashAlt className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => navigate('/student/job-listings')}
                    className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <FaSave className="mr-2" />
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Delete Confirmation"}
        body={"Are you sure you want to delete this offer letter? This action cannot be undone."}
        btn={"Delete Permanently"}
        confirmAction={confirmDelete}
      />
    </>
  );
}

export default UpdateJobStatus;
