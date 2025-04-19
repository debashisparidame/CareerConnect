import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config/backend_url';
import { FaChevronDown, FaGraduationCap, FaEnvelope, FaPhone, FaFileAlt, FaBriefcase, FaSuitcase } from 'react-icons/fa';

const StudentTable = ({ branchName, studentData }) => {
  const [currentUser, setCurrentUser] = useState({ role: '' });
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch user details
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("StudentTableTemplate.jsx => ", err);
      });
  }, []);

  // Sort students by roll number
  const sortedStudents = [...(studentData || [])].sort((a, b) => {
    const rollA = parseInt(a?.studentProfile?.rollNumber || 0);
    const rollB = parseInt(b?.studentProfile?.rollNumber || 0);
    return rollA - rollB;
  });

  return (
    <div className="mb-4 overflow-hidden bg-white border shadow-sm rounded-xl">
      {/* Accordion Header */}
      <div 
        className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${
          isExpanded ? "bg-blue-50 border-b border-blue-100" : "hover:bg-gray-50"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <FaGraduationCap className="text-white" size={18} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{branchName}</h3>
            <p className="text-sm text-gray-500">
              {studentData?.length || 0} Students
            </p>
          </div>
        </div>
        
        <div className={`p-1 bg-gray-100 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <FaChevronDown className="text-blue-600" />
        </div>
      </div>

      {/* Accordion Content - Using CSS transitions */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 overflow-x-auto">
          {studentData?.length > 0 ? (
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Roll No.
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Full Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    UIN
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Contact
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Resume
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                    Experience
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStudents.map((student, index) => (
                  <tr 
                    key={index} 
                    className="transition-colors hover:bg-blue-50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-blue-800 bg-blue-100 rounded">
                        {student?.studentProfile?.rollNumber || 'N/A'}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {(currentUser.role === 'tpo_admin' || currentUser.role === 'management_admin') ? (
                        <Link 
                          to={`/${currentUser.role === 'tpo_admin' ? 'tpo' : 'management'}/user/${student?._id}`} 
                          className="flex items-center font-medium text-blue-600 transition hover:text-blue-800"
                        >
                          <span className="underline-offset-2 hover:underline">
                            {student?.first_name} {student?.middle_name} {student?.last_name}
                          </span>
                        </Link>
                      ) : (
                        <span>{student?.first_name} {student?.middle_name} {student?.last_name}</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {student?.studentProfile?.UIN || 'N/A'}
                    </td>
                    
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <a
                          href={`mailto:${student?.email}`}
                          className="flex items-center mb-1 transition hover:text-blue-700"
                        >
                          <FaEnvelope className="mr-2 text-blue-500" size={14} />
                          <span className="truncate max-w-[180px]">{student?.email || 'N/A'}</span>
                        </a>
                        <div className="flex items-center text-gray-600">
                          <FaPhone className="mr-2 text-green-500" size={14} />
                          <span>{student?.number || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {student?.studentProfile?.resume ? (
                        <a
                          href={student?.studentProfile?.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white transition-colors rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <FaFileAlt className="mr-1.5" />
                          View CV
                        </a>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                          Not Available
                        </span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex justify-center space-x-5">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center px-2 py-1 text-sm font-medium text-orange-800 bg-orange-100 border border-orange-200 rounded">
                            <FaBriefcase className="mr-1.5 text-orange-500" size={12} />
                            <span>{student?.studentProfile?.internships?.length || 0}</span>
                          </div>
                          <span className="mt-1 text-xs text-gray-500">Internships</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="flex items-center px-2 py-1 text-sm font-medium text-green-800 bg-green-100 border border-green-200 rounded">
                            <FaSuitcase className="mr-1.5 text-green-500" size={12} />
                            <span>{student?.studentProfile?.appliedJobs?.length || 0}</span>
                          </div>
                          <span className="mt-1 text-xs text-gray-500">Applied Jobs</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 mb-4 text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-medium text-gray-600">No Students Found</h3>
              <p className="text-sm text-gray-500">No students have been registered for this branch yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTable;