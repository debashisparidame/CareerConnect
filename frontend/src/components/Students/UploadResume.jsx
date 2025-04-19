import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/backend_url';
import { FaFileAlt, FaCloudUploadAlt, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const UploadResume = ({ fetchCurrentUserData }) => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // success, error, loading
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // useState for load data
  const [currentUser, setCurrentUser] = useState({
    id: '',
    role: '',
  });
  const [isUploading, setIsUploading] = useState(false);

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
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("UploadResume.jsx => ", err);
      });
  }, []);

  // Handle file select
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    await uploadFile(file);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      await uploadFile(file);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    inputRef.current.click();
  };

  // Upload the file
  const uploadFile = async (file) => {
    if (!file) {
      setUploadStatus('Please select a file');
      setStatusType('error');
      return;
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      setUploadStatus('Only PDF and Word documents are allowed');
      setStatusType('error');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('File size must be less than 5MB');
      setStatusType('error');
      return;
    }

    setIsUploading(true);
    setStatusType('loading');
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', currentUser.id);

    try {
      await axios.post(
        `${BASE_URL}/student/upload-resume`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setUploadStatus('Resume uploaded successfully!');
      setStatusType('success');
      if (fetchCurrentUserData) fetchCurrentUserData();
    } catch (error) {
      console.error('Error uploading the resume', error);
      setUploadStatus(error.response?.data?.message || 'Error uploading the resume');
      setStatusType('error');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!fileName) return <FaFileAlt className="w-6 h-6 text-gray-400" />;
    
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    if (ext === '.pdf') {
      return <FaFileAlt className="w-6 h-6 text-red-500" />;
    } else if (ext === '.doc' || ext === '.docx') {
      return <FaFileAlt className="w-6 h-6 text-blue-500" />;
    }
    
    return <FaFileAlt className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-base font-medium text-gray-700">Update Resume</div>
      
      {/* Main upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : statusType === 'success'
              ? 'border-green-300 bg-green-50'
              : statusType === 'error'
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center">
          {isUploading ? (
            // Loading state
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 rounded-full">
                <FaSpinner className="w-full h-full text-blue-500 animate-spin" />
              </div>
              <p className="text-sm font-medium text-gray-700">Uploading your resume...</p>
              <p className="mt-1 text-xs text-gray-500">This may take a moment</p>
            </div>
          ) : fileName ? (
            // File selected state
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-gray-700 bg-gray-100 rounded-full">
                {getFileIcon()}
              </div>
              <p className="text-sm font-medium text-gray-700">{fileName}</p>
              {statusType === 'success' ? (
                <div className="flex items-center mt-2 text-green-600">
                  <FaCheckCircle className="mr-1" />
                  <span className="text-xs">{uploadStatus}</span>
                </div>
              ) : statusType === 'error' ? (
                <div className="flex items-center mt-2 text-red-600">
                  <FaExclamationCircle className="mr-1" />
                  <span className="text-xs">{uploadStatus}</span>
                </div>
              ) : null}
              <button
                onClick={handleButtonClick}
                className="px-4 py-2 mt-4 text-sm font-medium text-blue-700 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
              >
                Change File
              </button>
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-blue-500 bg-blue-100 rounded-full">
                <FaCloudUploadAlt className="w-8 h-8" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-gray-700">Drag & Drop your resume here</h3>
              <p className="mb-4 text-xs text-center text-gray-500">
                Upload your latest resume in PDF or Word format (Max 5MB)
              </p>
              <button
                onClick={handleButtonClick}
                className="px-6 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips section */}
      <div className="mt-3 text-xs text-gray-500">
        <p className="font-medium">Resume Tips:</p>
        <ul className="pl-4 mt-1 list-disc">
          <li>Keep your resume up to date with your latest experience</li>
          <li>Ensure your contact details are correct</li>
          <li>Tailor your resume to match job requirements</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadResume;
