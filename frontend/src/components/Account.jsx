import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaRegSave, FaCamera, FaIdCard, FaLock, FaHome } from 'react-icons/fa';
import { RiKeyFill, RiShieldUserFill } from "react-icons/ri";
import { FaMapLocationDot } from "react-icons/fa6";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Toast from './Toast';
import { BASE_URL } from '../config/backend_url';

function Account() {
  document.title = 'CareerConnect | Account';

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Account.jsx => ", error);
      setLoading(false);
    }
  }

  const handleBasicDetailChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleBasicDetailSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/user/update-profile`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      setToastMessage(response.data.msg);
      setShowToast(true);
    } catch (error) {
      if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
      else setToastMessage(error.message)
      setShowToast(true);
      console.log("handleBasicDetailSubmit => ", error);
    } finally {
      fetchUserData();
      setTimeout(() => setSaving(false), 500);
    }
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoLoading(true);
      const formData = new FormData();
      formData.append('profileImgs', file);
      formData.append('userId', data.id);

      try {
        const response = await axios.post(`${BASE_URL}/user/upload-photo`, formData);
        setToastMessage(response.data.msg);
        setShowToast(true);
      } catch (error) {
        setToastMessage(error.message);
        setShowToast(true);
        console.error('Error uploading photo:', error);
      } finally {
        fetchUserData();
        setTimeout(() => setPhotoLoading(false), 800);
      }
    }
  }

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  // useState for passwords
  const [passData, setPassData] = useState({
    oldpass: "",
    newpass: "",
    newcfmpass: "",
    error: "",
  });

  function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value })
  }

  // password update
  const handlePassUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!passData.oldpass || !passData.newpass || !passData.newcfmpass) {
      setPassData({ ...passData, error: "All Fields Required!" });
      setSaving(false);
      return;
    }

    if (!validatePassword(passData?.newpass)) {
      setPassData({ ...passData, error: 'Password Must Contains: Minimum 8 Char with atleast 1 Special Char, 1 Number, 1 Uppercase, 1 Lowercase' });
      setSaving(false);
      return;
    }

    // if newpass and newcfmpass is matching or not
    if (passData.newpass != passData.newcfmpass) {
      setPassData({ ...passData, error: "New Password & Confirm New Password Didn't Match" });
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/user/change-password`,
        passData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      if (response?.data) {
        setToastMessage(response?.data);
        setShowToast(true);
        setPassData({
          oldpass: "",
          newpass: "",
          newcfmpass: "",
          error: "",
        });
      }
    } catch (error) {
      console.log("Account.jsx updatepass =>", error);
      setPassData({ ...passData, error: error.message });
    } finally {
      fetchUserData();
      setTimeout(() => setSaving(false), 500);
    }
  }

  // for formating date of birth
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-blue-600">Loading your profile...</p>
        </div>
      ) : (
        <div className="px-4 py-6 mx-auto max-w-7xl">
          {/* Toast notification */}
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            message={toastMessage}
            delay={3000}
            position="bottom-end"
          />

          {/* Profile header card */}
          <div className="relative mb-8 overflow-hidden shadow-xl rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute top-0 right-0 w-64 h-64 -mt-24 -mr-24 bg-blue-400 rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 -mb-24 -ml-24 bg-indigo-400 rounded-full opacity-20"></div>
            
            <div className="relative z-10 flex flex-col items-center px-8 py-10 md:flex-row">
              {/* Profile picture with edit button */}
              <div className="relative flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <div className="relative group">
                  <div className="relative w-32 h-32 overflow-hidden transition-transform border-4 border-white rounded-full shadow-lg group-hover:scale-105">
                    {photoLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="w-10 h-10 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
                      </div>
                    ) : (
                      <img 
                        src={data.profile || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  
                  <label htmlFor="photo-upload" className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 text-white transition-all transform bg-blue-500 border-2 border-white rounded-full shadow-md cursor-pointer hover:bg-blue-600 hover:scale-110">
                    <FaCamera size={16} />
                    <input 
                      type="file" 
                      id="photo-upload" 
                      className="hidden" 
                      accept=".jpg, .jpeg, .png" 
                      onChange={handlePhotoChange} 
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-center text-blue-100">Click icon to change photo</p>
              </div>
              
              {/* User info */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">
                  {`${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`}
                </h1>
                <div className="flex flex-col gap-2 mt-2 md:flex-row md:items-center md:gap-4">
                  <span className="flex items-center justify-center text-blue-100 md:justify-start">
                    <i className="mr-2 fas fa-envelope"></i>
                    {data.email || 'No email provided'}
                  </span>
                  <span className="flex items-center justify-center text-blue-100 md:justify-start">
                    <i className="mr-2 fas fa-phone"></i>
                    {data.number || 'No phone number'}
                  </span>
                </div>
                <div className="flex justify-center mt-4 space-x-2 md:justify-start">
                  <span className="flex items-center px-3 py-1 text-xs text-blue-100 rounded-full bg-blue-800/40 backdrop-blur-sm">
                    <i className="mr-1 fas fa-user-shield"></i>
                    {data.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="flex items-center px-3 py-1 text-xs text-green-100 rounded-full bg-green-500/30 backdrop-blur-sm">
                    <i className="mr-1 fas fa-check-circle"></i>
                    Active Account
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 overflow-x-auto bg-white divide-x divide-gray-200 rounded-lg shadow-md">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`flex items-center px-4 py-3 min-w-[150px] transition-all ${activeTab === 'personal' ? 
                'text-blue-600 border-b-2 border-blue-500 font-bold' : 
                'text-gray-600 hover:text-blue-500'}`}>
              <RiShieldUserFill className="mr-2" size={20} />
              Personal Details
            </button>
            <button 
              onClick={() => setActiveTab('address')}
              className={`flex items-center px-4 py-3 min-w-[150px] transition-all ${activeTab === 'address' ? 
                'text-blue-600 border-b-2 border-blue-500 font-bold' : 
                'text-gray-600 hover:text-blue-500'}`}>
              <FaHome className="mr-2" size={20} />
              Address Info
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center px-4 py-3 min-w-[150px] transition-all ${activeTab === 'security' ? 
                'text-blue-600 border-b-2 border-blue-500 font-bold' : 
                'text-gray-600 hover:text-blue-500'}`}>
              <FaLock className="mr-2" size={20} />
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl">
            {/* Personal Details Section */}
            <div className={`transition-opacity duration-300 ${activeTab === 'personal' ? 'block opacity-100' : 'hidden opacity-0'}`}>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 text-blue-600 bg-blue-100 rounded-lg">
                    <FaIdCard size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                </div>

                <Form onSubmit={handleBasicDetailSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="form-group">
                      <FloatingLabel label="First Name" className="font-medium text-gray-600">
                        <Form.Control
                          type="text"
                          autoComplete="first_name"
                          placeholder="First Name"
                          name='first_name'
                          value={data.first_name || ''}
                          onChange={handleBasicDetailChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </FloatingLabel>
                    </div>
                      
                    <div className="form-group">
                      <FloatingLabel label="Middle Name" className="font-medium text-gray-600">
                        <Form.Control
                          type="text"
                          autoComplete="middle_name"
                          placeholder="Middle Name"
                          name='middle_name'
                          value={data.middle_name || ''}
                          onChange={handleBasicDetailChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </FloatingLabel>
                    </div>
                      
                    <div className="form-group">
                      <FloatingLabel label="Last Name" className="font-medium text-gray-600">
                        <Form.Control
                          type="text"
                          autoComplete="last_name"
                          placeholder="Last Name"
                          name='last_name'
                          value={data.last_name || ''}
                          onChange={handleBasicDetailChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </FloatingLabel>
                    </div>

                    <div className="form-group">
                      <FloatingLabel label="Phone Number" className="font-medium text-gray-600">
                        <Form.Control
                          type="number"
                          autoComplete="number"
                          placeholder="Number"
                          name='number'
                          value={data.number || ''}
                          onChange={handleBasicDetailChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          onInput={(e) => {
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          }}
                          required
                        />
                      </FloatingLabel>
                    </div>

                    <div className="form-group md:col-span-2">
                      <FloatingLabel label="Email Address" className="font-medium text-gray-600">
                        <Form.Control
                          type="email"
                          autoComplete="email"
                          placeholder="Email"
                          name='email'
                          value={data.email || ''}
                          onChange={handleBasicDetailChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </FloatingLabel>
                    </div>

                    <div className="form-group">
                      <FloatingLabel controlId="floatingBirthDate" label="Date of Birth" className="font-medium text-gray-600">
                        <Form.Control
                          type="date"
                          placeholder="Date of Birth"
                          name='dateOfBirth'
                          value={formatDate(data?.dateOfBirth)}
                          onChange={handleBasicDetailChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </FloatingLabel>
                    </div>

                    <div className="form-group">
                      <FloatingLabel controlId="floatingSelectGender" label="Gender" className="font-medium text-gray-600">
                        <Form.Select
                          aria-label="Floating label select gender"
                          className="transition-all border border-gray-300 cursor-pointer focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          name='gender'
                          value={data?.gender === undefined ? "undefined" : data?.gender}
                          onChange={handleBasicDetailChange}
                        >
                          <option disabled value="undefined" className="text-gray-400">Enter Your Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </FloatingLabel>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={saving}
                      className="relative flex items-center justify-center px-6 py-3 overflow-hidden text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-70"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <FaRegSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                      <div className="absolute inset-0 w-0 transition-all bg-blue-800/30 group-hover:w-full"></div>
                    </button>
                  </div>
                </Form>
              </div>
            </div>

            {/* Address Section */}
            <div className={`transition-opacity duration-300 ${activeTab === 'address' ? 'block opacity-100' : 'hidden opacity-0'}`}>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 text-blue-600 bg-blue-100 rounded-lg">
                    <FaMapLocationDot size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Address Information</h2>
                </div>
                
                <Form onSubmit={handleBasicDetailSubmit}>
                  <div className="space-y-4">
                    <div className="form-group">
                      <FloatingLabel className="font-medium text-gray-600" controlId="floatingTextareaAddress" label="Full Address">
                        <Form.Control
                          as="textarea"
                          placeholder="Enter Full Address here..."
                          style={{ height: '150px', resize: "none" }}
                          name='address'
                          value={data?.fullAddress?.address || ''}
                          onChange={(e) => {
                            setData({
                              ...data,
                              fullAddress: {
                                ...data?.fullAddress,
                                address: e.target.value
                              }
                            });
                          }}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </FloatingLabel>
                    </div>
                    
                    <div className="max-w-xs form-group">
                      <FloatingLabel controlId="floatingAddressPincode" label="Postal/ZIP Code" className="font-medium text-gray-600">
                        <Form.Control
                          type="number"
                          placeholder="Pincode"
                          maxLength={6}
                          name='pincode'
                          value={data?.fullAddress?.pincode || ''}
                          onChange={(e) => {
                            setData({
                              ...data,
                              fullAddress: {
                                ...data?.fullAddress,
                                pincode: e.target.value
                              }
                            });
                          }}
                          pattern="\d{6}"
                          onInput={(e) => {
                            if (e.target.value.length > 6) {
                              e.target.value = e.target.value.slice(0, 6);
                            }
                          }}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </FloatingLabel>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={saving}
                      className="relative flex items-center justify-center px-6 py-3 overflow-hidden text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-70"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Updating Address...
                        </>
                      ) : (
                        <>
                          <FaMapLocationDot className="mr-2" />
                          Update Address
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              </div>
            </div>

            {/* Security Section */}
            <div className={`transition-opacity duration-300 ${activeTab === 'security' ? 'block opacity-100' : 'hidden opacity-0'}`}>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 text-blue-600 bg-blue-100 rounded-lg">
                    <RiKeyFill size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Password & Security</h2>
                </div>
                
                <Form onSubmit={handlePassUpdate}>
                  <div className="max-w-lg space-y-4">
                    <div className="form-group">
                      <FloatingLabel label="Current Password" className="font-medium text-gray-600">
                        <Form.Control
                          type="password"
                          autoComplete="current-password"
                          placeholder="Current Password"
                          name="oldpass"
                          value={passData.oldpass || ''}
                          onChange={handlePassChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </FloatingLabel>
                    </div>
                    
                    <div className="form-group">
                      <FloatingLabel label="New Password" className="font-medium text-gray-600">
                        <Form.Control
                          type="password"
                          autoComplete="new-password"
                          placeholder="New Password"
                          name="newpass"
                          value={passData.newpass || ''}
                          onChange={handlePassChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </FloatingLabel>
                    </div>
                    
                    <div className="form-group">
                      <FloatingLabel label="Confirm New Password" className="font-medium text-gray-600">
                        <Form.Control
                          type="password"
                          autoComplete="new-password"
                          placeholder="Confirm New Password"
                          name="newcfmpass"
                          value={passData.newcfmpass || ''}
                          onChange={handlePassChange}
                          className="transition-all border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </FloatingLabel>
                    </div>
                    
                    {passData?.error && (
                      <div className="p-3 border border-red-200 rounded-md bg-red-50">
                        <span className="flex items-center text-red-600">
                          <i className="mr-2 fas fa-exclamation-circle"></i>
                          {passData?.error}
                        </span>
                      </div>
                    )}

                    <div className="p-3 mt-2 border border-blue-100 rounded-md bg-blue-50">
                      <h4 className="mb-1 text-sm font-semibold text-blue-800">Password Requirements:</h4>
                      <ul className="pl-4 text-xs text-blue-700 list-disc">
                        <li>At least 8 characters long</li>
                        <li>Include at least one uppercase letter (A-Z)</li>
                        <li>Include at least one lowercase letter (a-z)</li>
                        <li>Include at least one number (0-9)</li>
                        <li>Include at least one special character (!@#$%^&*)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={saving}
                      className="relative flex items-center justify-center px-6 py-3 overflow-hidden text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-70"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <RiKeyFill className="mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Account;
