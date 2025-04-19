import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { BASE_URL } from '../../config/backend_url';
import { FaBriefcase, FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaFileAlt, FaUserGraduate, FaClipboardCheck } from 'react-icons/fa';

function PostJob() {
  document.title = 'CareerConnect | Post Job';
  const navigate = useNavigate();

  const { jobId } = useParams();
  const editor = useRef(null);

  const [data, setData] = useState({});
  const [companys, setCompanys] = useState(null);
  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.company || !data?.jobTitle || !data?.salary || !data?.applicationDeadline || !data?.jobDescription || !data?.eligibility || !data?.howToApply) {
      setToastMessage("All Fields Required!");
      setShowToast(true);
      return;
    }
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/post-job`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )

      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);

        const newDataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg,
        };
        navigate('../tpo/job-listings', { state: newDataToPass });
      }
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)

        setShowToast(true);
      }
      console.log("PostJob error while fetching => ", error);
    }
  }

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)
        setShowToast(true);

        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchCompanys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/company/company-detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCompanys(response.data.companys);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  useEffect(() => {
    fetchJobDetail();
    fetchCompanys();
    if (!jobId) setLoading(false);
  }, []);

  // for formating date of birth
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const customConfig = {
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'link', '|',
      'align', 'indent', 'outdent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'undo', 'redo', '|',
      'table', 'hr', '|',
      'source'
    ],
    toolbarSticky: true,
    toolbarAdaptive: true,
    toolbarStickyOffset: 80,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    height: 300,
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

      <div className="relative max-w-5xl px-4 py-6 mx-auto">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-10 bg-blue-400 rounded-full opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 -mb-10 -mr-10 bg-indigo-400 rounded-full opacity-10"></div>
        
        {/* Page header */}
        <div className="relative z-10 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {jobId ? 'Update Job Listing' : 'Post New Job Opportunity'}
          </h1>
          <p className="mt-2 text-blue-700/80">
            Create a new job listing to connect companies with talented students
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center w-full py-20 bg-white shadow-lg rounded-xl">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-blue-600">Loading job data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Company Selection Card */}
            <div className="relative mb-8 overflow-hidden bg-white shadow-lg rounded-xl">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 text-blue-600 bg-blue-100 rounded-lg">
                    <FaBuilding size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Company Information</h2>
                </div>
                
                <div className="relative">
                  <label className="block mb-2 text-sm font-semibold text-blue-700">
                    <span className="flex items-center">
                      <FaBuilding className="mr-1.5 text-blue-500" /> 
                      Select Company <span className="ml-1 text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-lg appearance-none cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    name="companySelected"
                    value={data?.company || ''}
                    onChange={(e) => {
                      setData({
                        ...data,
                        company: e.target.value
                      });
                    }}
                    style={{backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", 
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1em",
                    backgroundRepeat: "no-repeat"}}
                  >
                    <option disabled value="" className="text-gray-400">Select Company Name</option>
                    {companys?.map((company, index) => (
                      <option key={index} value={company._id}>{company.companyName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Job Details Card */}
            <div className="relative mb-8 overflow-hidden bg-white shadow-lg rounded-xl">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 text-blue-600 bg-blue-100 rounded-lg">
                    <FaBriefcase size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Job Details</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Job Title */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-blue-700">
                      <span className="flex items-center">
                        <FaBriefcase className="mr-1.5 text-blue-500" /> 
                        Job Title <span className="ml-1 text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={data?.jobTitle || ''}
                      onChange={handleDataChange}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Salary */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-blue-700">
                      <span className="flex items-center">
                        <FaMoneyBillWave className="mr-1.5 text-blue-500" /> 
                        Salary (In LPA) <span className="ml-1 text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={data?.salary || ''}
                      onChange={(e) => {
                        // Allow only numbers and decimals
                        if (!isNaN(e.target.value) && /^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
                          handleDataChange(e);
                        }
                      }}
                      placeholder="e.g. 10.5"
                      className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Application Deadline */}
                  <div className="relative">
                    <label className="block mb-2 text-sm font-semibold text-blue-700">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1.5 text-blue-500" /> 
                        Application Deadline <span className="ml-1 text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formatDate(data?.applicationDeadline) || ''}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div className="mt-8">
                  <label className="block mb-2 text-sm font-semibold text-blue-700">
                    <span className="flex items-center">
                      <FaFileAlt className="mr-1.5 text-blue-500" /> 
                      Job Description <span className="ml-1 text-red-500">*</span>
                    </span>
                  </label>
                  <div className="border-2 border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500">
                    <JoditEditor
                      ref={editor}
                      value={data?.jobDescription || ''}
                      config={customConfig}
                      tabIndex={1}
                      onChange={(content) => {
                        setData({
                          ...data,
                          jobDescription: content
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Eligibility */}
                <div className="mt-8">
                  <label className="block mb-2 text-sm font-semibold text-blue-700">
                    <span className="flex items-center">
                      <FaUserGraduate className="mr-1.5 text-blue-500" /> 
                      Eligibility Requirements <span className="ml-1 text-red-500">*</span>
                    </span>
                  </label>
                  <div className="border-2 border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500">
                    <JoditEditor
                      ref={editor}
                      value={data?.eligibility || ''}
                      config={customConfig}
                      tabIndex={2}
                      onChange={(content) => {
                        setData({
                          ...data,
                          eligibility: content
                        });
                      }}
                    />
                  </div>
                </div>

                {/* How To Apply */}
                <div className="mt-8">
                  <label className="block mb-2 text-sm font-semibold text-blue-700">
                    <span className="flex items-center">
                      <FaClipboardCheck className="mr-1.5 text-blue-500" /> 
                      Application Process <span className="ml-1 text-red-500">*</span>
                    </span>
                  </label>
                  <div className="border-2 border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500">
                    <JoditEditor
                      ref={editor}
                      value={data?.howToApply || ''}
                      config={customConfig}
                      tabIndex={3}
                      onChange={(content) => {
                        setData({
                          ...data,
                          howToApply: content
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="relative px-10 py-4 overflow-hidden text-white transition-all rounded-lg shadow-lg group bg-gradient-to-br from-blue-500 to-indigo-700 hover:shadow-blue-500/30"
              >
                <span className="relative flex items-center justify-center gap-2 text-base font-medium">
                  <FaBriefcase />
                  {jobId ? 'Update Job Listing' : 'Post New Job'}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-200 ease-in-out bg-white/30 group-hover:h-full group-hover:opacity-10"></span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ModalBox Component for Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to post job for ${data?.jobTitle}?`}
        btn={"Post"}
        confirmAction={confirmSubmit}
      />
    </>
  );
}

export default PostJob;
