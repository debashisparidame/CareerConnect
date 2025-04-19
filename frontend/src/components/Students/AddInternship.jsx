import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { BASE_URL } from '../../config/backend_url';
import { FaBriefcase, FaBuilding, FaGlobe, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';

function AddInternship() {
  document.title = 'CareerConnect | Add Internships';
  const [loading, setLoading] = useState(true);
  const { internshipId } = useParams();
  const navigate = useNavigate();

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState('');

  const closeModal = () => setShowModal(false);

  // store internship info
  const [internship, setInternship] = useState({});
  const [currentUserData, setCurrentUserData] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setCurrentUserData({ id: response.data.id });
        if (!internshipId) setLoading(false);
      } catch (error) {
        console.log("addinternship.jsx => ", error);
      }
    }
    fetchCurrentUserData();
  }, []);

  const fetchInternshipData = async () => {
    try {
      // if no studentId or internshipId then return back none 
      if (!currentUserData?.id || !internshipId) return;
      const response = await axios.get(`${BASE_URL}/student/internship?studentId=${currentUserData?.id}&internshipId=${internshipId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setInternship(response.data.internship);
      setModalBody(response.data.internship.companyName);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log("error while updating internship ", error);
      if (error.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
      } else {
        setToastMessage("Error while updating internship please try again later!");
      }
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }

  const handleDataChange = (e) => {
    setInternship({ ...internship, [e.target.name]: e.target.value });
    if (e.target.name === "companyName")
      setModalBody(e.target.value);
      
    // Clear any error for this field when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  }

  // for formatting date
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const validateForm = () => {
    const errors = {};
    if (!internship?.companyName?.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!internship?.internshipDuration) {
      errors.internshipDuration = 'Duration is required';
    } else if (internship.internshipDuration <= 0) {
      errors.internshipDuration = 'Duration must be greater than 0';
    }
    
    if (!internship?.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!internship?.type || internship?.type === "undefined") {
      errors.type = 'Internship type is required';
    }

    if (internship?.companyWebsite && !isValidUrl(internship.companyWebsite)) {
      errors.companyWebsite = 'Please enter a valid URL';
    }
    
    return errors;
  };
  
  const isValidUrl = (url) => {
    try {
      // Add http if not present
      if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
      }
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToastMessage('Please fix the highlighted fields');
      setShowToast(true);
      return;
    }
    
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/student/update-internship?studentId=${currentUserData?.id}&internshipId=${internshipId}`, { internship }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
        if (response?.data?.msg === "Internship Updated Successfully!") {
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: response?.data?.msg
          }
          navigate('/student/internship', { state: dataToPass })
        }
      }
    } catch (error) {
      console.log("error while updating internship ", error);
      if (error.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
      } else {
        setToastMessage("Error while updating internship please try again later!");
      }
      setShowToast(true);
    }
    setShowModal(false);
  }

  useEffect(() => {
    fetchInternshipData();
  }, [currentUserData?.id]);

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

      <div className="max-w-4xl px-4 py-10 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {internshipId ? 'Update Internship' : 'Add New Internship'}
          </h1>
          <p className="text-blue-600">Track your professional experience and showcase your skills</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-72">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-blue-600">Loading internship data...</p>
          </div>
        ) : (
          <>
            {/* Internship Form Card */}
            <div className="overflow-hidden bg-white shadow-lg rounded-xl">
              {/* Header Bar */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              {/* Form Content */}
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 mr-4 text-blue-500 bg-blue-100 rounded-lg">
                    <FaBriefcase size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Internship Details</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Company Name */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaBuilding className="mr-1.5 text-blue-500" />
                        Company Name <span className="ml-1 text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="e.g. Google"
                      value={internship?.companyName || ""}
                      onChange={handleDataChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
                        formErrors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>
                    )}
                  </div>

                  {/* Company Website */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaGlobe className="mr-1.5 text-blue-500" />
                        Company Website
                      </span>
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      placeholder="e.g. https://example.com"
                      value={internship?.companyWebsite || ""}
                      onChange={handleDataChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
                        formErrors.companyWebsite ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.companyWebsite && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.companyWebsite}</p>
                    )}
                  </div>

                  {/* Internship Duration */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1.5 text-blue-500" />
                        Internship Duration (Days) <span className="ml-1 text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      name="internshipDuration"
                      min="1"
                      placeholder="e.g. 90"
                      value={internship?.internshipDuration || ""}
                      onChange={handleDataChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
                        formErrors.internshipDuration ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.internshipDuration && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.internshipDuration}</p>
                    )}
                  </div>

                  {/* Monthly Stipend */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaMoneyBillWave className="mr-1.5 text-blue-500" />
                        Monthly Stipend (₹)
                      </span>
                    </label>
                    <input
                      type="number"
                      name="monthlyStipend"
                      min="0"
                      step="500"
                      placeholder="e.g. 10000"
                      value={internship?.monthlyStipend || ""}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>

                  {/* Start Date */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1.5 text-blue-500" />
                        Start Date <span className="ml-1 text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formatDate(internship?.startDate) || ""}
                      onChange={handleDataChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
                        formErrors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1.5 text-blue-500" />
                        End Date
                      </span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formatDate(internship?.endDate) || ""}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>

                  {/* Internship Type */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaBriefcase className="mr-1.5 text-blue-500" />
                        Internship Type <span className="ml-1 text-red-500">*</span>
                      </span>
                    </label>
                    <select
                      name="type"
                      value={internship?.type || "undefined"}
                      onChange={handleDataChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
                        formErrors.type ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      style={{backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", 
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1em",
                      backgroundRepeat: "no-repeat"}}
                    >
                      <option disabled value="undefined" className="text-gray-400">Select Internship Type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="On-Site">On-Site</option>
                      <option value="Work From Home">Work From Home</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.type && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                    )}
                  </div>

                  {/* Company Address */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1.5 text-blue-500" />
                        Company Address
                      </span>
                    </label>
                    <textarea
                      name="companyAddress"
                      placeholder="Enter company address"
                      value={internship?.companyAddress || ""}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                      rows={3}
                    ></textarea>
                  </div>

                  {/* Internship Description - Full width */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FaFileAlt className="mr-1.5 text-blue-500" />
                        Internship Description
                      </span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your roles, responsibilities and learning outcomes"
                      value={internship?.description || ""}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                      rows={5}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-2 mt-8">
              <button
                type="button"
                onClick={handleSubmit}
                className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white rounded-lg group bg-gradient-to-br from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <span className="relative flex items-center gap-2">
                  {internshipId ? 
                    <>Update Internship <FaBriefcase /></> : 
                    <>Add Internship <FaBriefcase /></>}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-200 ease-in-out bg-white/30 group-hover:h-full group-hover:opacity-10"></span>
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/student/internship')}
                className="mt-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
              >
                Cancel and Return to Internships
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal for confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to ${internshipId ? 'update' : 'add'} internship ${modalBody ? `at ${modalBody}` : ''}?`}
        btn={internshipId ? "Update" : "Add"}
        confirmAction={confirmSubmit}
      />
    </>
  );
}

export default AddInternship;
