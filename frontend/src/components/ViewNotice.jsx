import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BASE_URL } from '../config/backend_url';

function ViewNotice() {
  document.title = 'CareerConnect | Notice';
  const navigate = useNavigate();
  const noticeId = useParams();
  const [notice, setNotice] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      if (!noticeId) return;
      const response = await axios.get(`${BASE_URL}/management/get-notice?noticeId=${noticeId.noticeId}`);
      setNotice(response?.data);
      setLoading(false);
    } catch (error) {
      console.log("error while fetching notice => ", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotice();
    if (notice === null) navigate('/404');
  }, [noticeId]);

  // Helper function to format date in a more readable way
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Function to determine badge color based on notice priority/category
  const getBadgeColor = () => {
    if (!notice?.category) return 'bg-blue-100 text-blue-800';
    
    switch (notice.category.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'important':
        return 'bg-yellow-100 text-yellow-800';
      case 'academic':
        return 'bg-green-100 text-green-800';
      case 'event':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Calculate how long ago the notice was posted
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading notice...</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          {/* Header with gradient background */}
          <div className="relative px-6 py-8 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-white opacity-20" style={{ 
                backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')",
                backgroundSize: "24px 24px"
              }}></div>
            </div>

            {/* Notice category badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor()}`}>
                  {notice?.category || 'General Notice'}
                </span>
                <p className="mt-1 text-sm text-blue-100">
                  Posted {getTimeAgo(notice?.createdAt)}
                </p>
              </div>
              <Link 
                to="/student/notices"
                className="text-white transition-opacity opacity-80 hover:opacity-100"
              >
                <i className="mr-1 fas fa-arrow-left"></i> Back to Notices
              </Link>
            </div>

            {/* Notice title */}
            <h1 className="relative z-10 mt-4 text-3xl font-bold text-white">{notice?.title}</h1>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Notice details */}
            <div className="prose max-w-none">
              <p className="leading-relaxed text-gray-800 whitespace-pre-line">
                {notice?.message}
              </p>
            </div>
            
            {/* Metadata footer */}
            <div className="pt-6 mt-8 border-t border-gray-200">
              <div className="flex flex-col text-sm text-gray-500 sm:flex-row sm:justify-between">
                <div className="flex items-center mb-2 sm:mb-0">
                  <i className="mr-2 text-blue-500 fas fa-calendar-alt"></i>
                  <span>Posted on: {formatDate(notice?.createdAt)}</span>
                </div>
                
                {notice?.postedBy && (
                  <div className="flex items-center">
                    <i className="mr-2 text-blue-500 fas fa-user"></i>
                    <span>Posted by: {notice.postedBy}</span>
                  </div>
                )}
              </div>
              
              {/* Attachments section if available */}
              {notice?.attachments && notice.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-500">Attachments</h3>
                  <div className="space-y-2">
                    {notice.attachments.map((attachment, index) => (
                      <a 
                        key={index} 
                        href={attachment.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-lg">
                          <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="flex-1 ml-3">
                          <p className="text-sm font-medium text-blue-600">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.size}</p>
                        </div>
                        <div>
                          <i className="text-gray-400 fas fa-download"></i>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-wrap justify-end gap-3 mt-6">
                {notice?.noticeUrl && (
                  <a 
                    href={notice.noticeUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <i className="mr-2 fas fa-external-link-alt"></i>
                    Visit Link
                  </a>
                )}
                <button 
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <i className="mr-2 fas fa-print"></i>
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Optional: Related notices section */}
          {notice?.relatedNotices && notice.relatedNotices.length > 0 && (
            <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Related Notices</h2>
              <div className="space-y-3">
                {notice.relatedNotices.map((relatedNotice, index) => (
                  <Link
                    key={index}
                    to={`/student/notice/${relatedNotice.id}`}
                    className="block p-4 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-blue-50"
                  >
                    <p className="font-medium text-blue-600">{relatedNotice.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{new Date(relatedNotice.createdAt).toLocaleDateString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewNotice;
