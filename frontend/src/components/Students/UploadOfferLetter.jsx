import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/backend_url';
import { FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle, FaFileAlt, FaSpinner } from 'react-icons/fa';

const UploadOfferLetter = ({ jobId, fetchJobDetailsOfApplicant }) => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // success, error, loading
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
        console.log("UploadOfferLetter.jsx => ", err);
      });
  }, []);

  // Handle file selection
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
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    fileInputRef.current.click();
  };

  // Upload the file
  const uploadFile = async (file) => {
    if (!file) {
      setUploadStatus('Please select a file');
      setStatusType('error');
      return;
    }

    // Check file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      setUploadStatus('Only PDF and Word documents are allowed');
      setStatusType('error');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('File size must be less than 5MB');
      setStatusType('error');
      return;
    }

    setIsUploading(true);
    setStatusType('loading');
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('offerLetter', file);
    formData.append('studentId', currentUser.id);
    formData.append('jobId', jobId);

    try {
      await axios.post(
        `${BASE_URL}/student/upload-offer-letter`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setUploadStatus('Offer letter uploaded successfully!');
      setStatusType('success');
      if (fetchJobDetailsOfApplicant) fetchJobDetailsOfApplicant();
    } catch (error) {
      console.error('Error uploading the offer letter', error);
      setUploadStatus(error.response?.data?.message || 'Error uploading the offer letter');
      setStatusType('error');
    } finally {
      setIsUploading(false);
    }
  };

  // Get file icon and color based on file extension
  const getFileIconAndColor = () => {
    if (!fileName) return { icon: <FaFileAlt />, color: 'text-gray-400' };
    
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    if (ext === '.pdf') {
      return { icon: <FaFileAlt />, color: 'text-red-500' };
    } else if (ext === '.doc' || ext === '.docx') {
      return { icon: <FaFileAlt />, color: 'text-blue-500' };
    }
    
    return { icon: <FaFileAlt />, color: 'text-gray-400' };
  };

  const { icon, color } = getFileIconAndColor();

  return (
    <div className="w-full">
      {/* Drag & Drop Upload Area */}
      <div 
        className={`relative flex flex-col items-center justify-center w-full p-6 transition-all border-2 border-dashed rounded-lg ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : statusType === 'success'
              ? 'border-green-300 bg-green-50'
              : statusType === 'error'
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {isUploading ? (
          // Loading state
          <div className="flex flex-col items-center">
            <FaSpinner className="w-10 h-10 mb-2 text-blue-500 animate-spin" />
            <p className="mb-1 text-sm font-medium text-gray-700">Uploading offer letter...</p>
            <p className="text-xs text-gray-500">Please wait</p>
          </div>
        ) : fileName ? (
          // File selected state
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 mb-2 ${color}`}>
              {icon}
            </div>
            <p className="mb-1 text-sm font-medium text-gray-700">{fileName}</p>
            {statusType === 'success' ? (
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="mr-1" />
                <span className="text-xs">{uploadStatus}</span>
              </div>
            ) : statusType === 'error' ? (
              <div className="flex items-center text-red-600">
                <FaExclamationTriangle className="mr-1" />
                <span className="text-xs">{uploadStatus}</span>
              </div>
            ) : null}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center">
            <FaCloudUploadAlt className="w-10 h-10 mb-2 text-blue-500" />
            <p className="mb-1 text-sm font-medium text-gray-700">Drag and drop your offer letter here</p>
            <p className="mb-4 text-xs text-gray-500">PDF or Word documents, max 5MB</p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Select File
            </button>
          </div>
        )}
      </div>
      
      {/* Status message outside the drop area */}
      {uploadStatus && !fileName && (
        <div className={`mt-2 text-xs ${
          statusType === 'success' ? 'text-green-600' : 
          statusType === 'error' ? 'text-red-600' : 
          'text-gray-500'
        }`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default UploadOfferLetter;
