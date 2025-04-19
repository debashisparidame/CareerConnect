import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { BASE_URL } from '../../config/backend_url';
import { FaBuilding, FaLocationDot, FaLink, FaCircleCheck, FaStar } from 'react-icons/fa6';
import { HiDocumentText } from 'react-icons/hi';

// Custom InputField component for consistent styling
const InputField = ({ icon, label, name, type = "text", value = "", onChange, placeholder = "", required = false }) => (
  <div className="relative">
    <label className="absolute flex items-center gap-2 px-4 text-sm font-semibold text-blue-700">
      {icon}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 pb-3 text-gray-700 transition-all duration-200 border-2 border-gray-200 pt-7 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:outline-none"
    />
  </div>
);

function AddCompany() {
  document.title = 'CareerConnect | Add Company';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { companyId } = useParams();

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.companyName || !data?.companyDescription || !data?.companyDifficulty || !data?.companyLocation || !data?.companyWebsite)
      return setError("All Fields Required!");
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    const url = companyId
      ? `${BASE_URL}/company/update-company?companyId=${companyId}`
      : `${BASE_URL}/company/add-company`;
    try {
      const response = await axios.post(url, data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      if (response?.status === 201) {
        setShowModal(false);
        setToastMessage(response?.data?.msg);
        const dataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg
        }
        navigate('../tpo/companys', { state: dataToPass });
      }
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
      setShowModal(false);
      setToastMessage(error?.response?.data?.msg);
      setShowToast(true);
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${companyId}`);
      setData(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (companyId) fetchCompanyData() }, [companyId])

  useEffect(() => {
    if (!companyId) setLoading(false);
  }, [])

  const handleDataChange = (e) => {
    setError('');
    setData({ ...data, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} delay={3000} position="bottom-end" />

      <div className="min-h-screen p-6 bg-gray-50/30">
        <div className="relative max-w-4xl mx-auto">
          {/* Enhanced decorative elements */}
          <div className="absolute top-0 right-0 bg-purple-300 rounded-full w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 left-0 bg-blue-300 rounded-full w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bg-indigo-300 rounded-full -bottom-8 left-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

          {/* Modern Page Header */}
          <div className="relative">
            <div className="p-6 mb-8 text-center border shadow-lg bg-white/60 backdrop-blur-lg rounded-2xl border-white/20">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {companyId ? 'Update Company Profile' : 'Add New Company'}
              </h1>
              <p className="mt-2 text-gray-600">
                {companyId 
                  ? 'Update company information in the CareerConnect database' 
                  : 'Add a new company to the CareerConnect database for placement opportunities'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center w-full py-20 shadow-lg bg-white/80 backdrop-blur-lg rounded-2xl">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
              <p className="mt-4 text-lg font-medium text-blue-600">Loading company data...</p>
            </div>
          ) : (
            <div className="relative overflow-hidden border shadow-xl bg-white/80 backdrop-blur-lg rounded-2xl border-white/20">
              {/* Modern gradient top accent */}
              <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <Form onSubmit={handleSubmit} className="p-8">
                <div className="grid gap-8">
                  {/* Company name and location row */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InputField
                      icon={<FaBuilding className="text-blue-500" />}
                      label="Company Name"
                      name="companyName"
                      value={data?.companyName}
                      onChange={handleDataChange}
                      required
                    />
                    <InputField
                      icon={<FaLocationDot className="text-blue-500" />}
                      label="Company Location"
                      name="companyLocation"
                      value={data?.companyLocation}
                      onChange={handleDataChange}
                      required
                    />
                  </div>

                  {/* Website input */}
                  <InputField
                    icon={<FaLink className="text-blue-500" />}
                    label="Company Website"
                    name="companyWebsite"
                    type="url"
                    value={data?.companyWebsite}
                    onChange={handleDataChange}
                    placeholder="https://example.com"
                    required
                  />

                  {/* Enhanced difficulty selector */}
                  <div className="relative">
                    <label className="absolute flex items-center gap-2 px-4 text-sm font-semibold text-blue-700">
                      <FaStar className="text-blue-500" />
                      Difficulty Level
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="companyDifficulty"
                      value={data?.companyDifficulty || ''}
                      onChange={handleDataChange}
                      className="w-full px-4 pb-3 text-gray-700 transition-all duration-200 border-2 border-gray-200 appearance-none pt-7 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="" disabled>Select difficulty level</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <div className="absolute flex gap-2 -translate-y-1/2 right-4 top-1/2">
                      <span className={`w-2 h-2 rounded-full transition-colors duration-200
                                   ${data?.companyDifficulty === 'Easy' ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                      <span className={`w-2 h-2 rounded-full transition-colors duration-200
                                   ${data?.companyDifficulty === 'Moderate' ? 'bg-yellow-500' : 'bg-gray-200'}`}></span>
                      <span className={`w-2 h-2 rounded-full transition-colors duration-200
                                   ${data?.companyDifficulty === 'Hard' ? 'bg-red-500' : 'bg-gray-200'}`}></span>
                    </div>
                  </div>

                  {/* Description textarea */}
                  <div className="relative">
                    <label className="absolute flex items-center gap-2 px-4 text-sm font-semibold text-blue-700">
                      <HiDocumentText className="text-blue-500" />
                      Company Description
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="companyDescription"
                      value={data?.companyDescription || ''}
                      onChange={handleDataChange}
                      rows="5"
                      className="w-full px-4 pb-3 text-gray-700 transition-all duration-200 border-2 border-gray-200 resize-none pt-7 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter detailed description about the company..."
                    ></textarea>
                  </div>

                  {/* Error message with animation */}
                  {error && (
                    <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-xl animate-slideIn">
                      <div className="flex items-center gap-2 text-red-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modern submit button */}
                <div className="flex justify-center mt-8">
                  <button
                    type="submit"
                    className="group relative px-8 py-3 text-sm font-medium text-white bg-gradient-to-r 
                             from-blue-600 to-indigo-600 rounded-xl shadow-lg transition-all duration-200
                             hover:shadow-blue-500/25 hover:translate-y-[-2px] active:translate-y-[1px]"
                  >
                    <span className="relative flex items-center gap-2">
                      <FaCircleCheck className="text-white/90" />
                      {companyId ? 'Update Company' : 'Add Company'}
                    </span>
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 animate-shimmer"></div>
                    </div>
                  </button>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>

      <ModalBox
        show={showModal}
        close={closeModal}
        header="Confirmation"
        body={`Do you want to ${companyId ? 'update' : 'add'} company ${data?.companyName}?`}
        btn={companyId ? "Update" : "Post"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}

export default AddCompany;
