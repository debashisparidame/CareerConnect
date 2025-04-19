import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentTable from './StudentTableTemplate';
import { BASE_URL } from '../../config/backend_url';
import { FaGraduationCap, FaChevronDown, FaUserGraduate, FaSearch } from 'react-icons/fa';

function StudentYearAndBranchView() {
  document.title = 'CareerConnect | All Students';

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedYear, setExpandedYear] = useState('fourth');
  
  const [firstYearComputer, setFirstYearComputer] = useState([]);
  const [firstYearCivil, setFirstYearCivil] = useState([]);
  const [firstYearMechanical, setFirstYearMechanical] = useState([]);
  const [firstYearAIDS, setFirstYearAIDS] = useState([]);
  const [firstYearECS, setFirstYearECS] = useState([]);
  const [secondYearComputer, setSecondYearComputer] = useState([]);
  const [secondYearCivil, setSecondYearCivil] = useState([]);
  const [secondYearMechanical, setSecondYearMechanical] = useState([]);
  const [secondYearECS, setSecondYearECS] = useState([]);
  const [secondYearAIDS, setSecondYearAIDS] = useState([]);
  const [thirdYearComputer, setThirdYearComputer] = useState([]);
  const [thirdYearCivil, setThirdYearCivil] = useState([]);
  const [thirdYearMechanical, setThirdYearMechanical] = useState([]);
  const [thirdYearECS, setThirdYearECS] = useState([]);
  const [thirdYearAIDS, setThirdYearAIDS] = useState([]);
  const [fourthYearComputer, setFourthYearComputer] = useState([]);
  const [fourthYearCivil, setFourthYearCivil] = useState([]);
  const [fourthYearMechanical, setFourthYearMechanical] = useState([]);
  const [fourthYearECS, setFourthYearECS] = useState([]);
  const [fourthYearAIDS, setFourthYearAIDS] = useState([]);

  const fetchStudentsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/student/all-students-data-year-and-branch`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setFirstYearComputer(response.data.firstYearComputer);
      setFirstYearCivil(response.data.firstYearCivil);
      setFirstYearMechanical(response.data.firstYearMechanical);
      setFirstYearECS(response.data.firstYearECS);
      setFirstYearAIDS(response.data.firstYearAIDS);

      setSecondYearComputer(response.data.secondYearComputer);
      setSecondYearCivil(response.data.secondYearCivil);
      setSecondYearMechanical(response.data.secondYearMechanical);
      setSecondYearECS(response.data.secondYearECS);
      setSecondYearAIDS(response.data.secondYearAIDS);

      setThirdYearComputer(response.data.thirdYearComputer);
      setThirdYearCivil(response.data.thirdYearCivil);
      setThirdYearMechanical(response.data.thirdYearMechanical);
      setThirdYearECS(response.data.thirdYearECS);
      setThirdYearAIDS(response.data.thirdYearAIDS);

      setFourthYearComputer(response.data.fourthYearComputer);
      setFourthYearCivil(response.data.fourthYearCivil);
      setFourthYearMechanical(response.data.fourthYearMechanical);
      setFourthYearECS(response.data.fourthYearECS);
      setFourthYearAIDS(response.data.fourthYearAIDS);

    } catch (error) {
      console.log("Error fetching students data ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentsData();
  }, []);

  // Calculate total students per year
  const firstYearTotal = firstYearComputer.length + firstYearCivil.length + firstYearMechanical.length + firstYearAIDS.length + firstYearECS.length;
  const secondYearTotal = secondYearComputer.length + secondYearCivil.length + secondYearMechanical.length + secondYearAIDS.length + secondYearECS.length;
  const thirdYearTotal = thirdYearComputer.length + thirdYearCivil.length + thirdYearMechanical.length + thirdYearAIDS.length + thirdYearECS.length;
  const fourthYearTotal = fourthYearComputer.length + fourthYearCivil.length + fourthYearMechanical.length + fourthYearAIDS.length + fourthYearECS.length;
  const totalStudents = firstYearTotal + secondYearTotal + thirdYearTotal + fourthYearTotal;

  // Year toggle handler
  const toggleYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-blue-600">Loading student data...</p>
        </div>
      ) : (
        <div className="px-6 py-8">
          {/* Header Stats */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold text-gray-800">Student Directory</h1>
            <p className="text-gray-600">Browse and manage all students in the system</p>
            
            <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-5">
              {/* Total Students Card */}
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 text-white bg-blue-500 rounded-lg">
                    <FaUserGraduate size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                    <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
                  </div>
                </div>
              </div>
              
              {/* First Year Students */}
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 text-white rounded-lg bg-emerald-500">
                    <FaGraduationCap size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">First Year</h3>
                    <p className="text-2xl font-bold text-gray-800">{firstYearTotal}</p>
                  </div>
                </div>
              </div>
              
              {/* Second Year Students */}
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 text-white bg-yellow-500 rounded-lg">
                    <FaGraduationCap size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Second Year</h3>
                    <p className="text-2xl font-bold text-gray-800">{secondYearTotal}</p>
                  </div>
                </div>
              </div>
              
              {/* Third Year Students */}
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 text-white bg-orange-500 rounded-lg">
                    <FaGraduationCap size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Third Year</h3>
                    <p className="text-2xl font-bold text-gray-800">{thirdYearTotal}</p>
                  </div>
                </div>
              </div>
              
              {/* Fourth Year Students */}
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 text-white bg-red-500 rounded-lg">
                    <FaGraduationCap size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Fourth Year</h3>
                    <p className="text-2xl font-bold text-gray-800">{fourthYearTotal}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 pl-10 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                placeholder="Search students by name, roll number or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            </div>
          </div>

          {/* Year Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => toggleYear('fourth')}
              className={`px-4 py-2 text-sm font-medium transition-colors border rounded-md ${
                expandedYear === 'fourth' 
                  ? 'bg-red-500 border-red-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-red-50'
              }`}
            >
              Fourth Year
            </button>
            
            <button
              onClick={() => toggleYear('third')}
              className={`px-4 py-2 text-sm font-medium transition-colors border rounded-md ${
                expandedYear === 'third' 
                  ? 'bg-orange-500 border-orange-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50'
              }`}
            >
              Third Year
            </button>
            
            <button
              onClick={() => toggleYear('second')}
              className={`px-4 py-2 text-sm font-medium transition-colors border rounded-md ${
                expandedYear === 'second' 
                  ? 'bg-yellow-500 border-yellow-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-yellow-50'
              }`}
            >
              Second Year
            </button>
            
            <button
              onClick={() => toggleYear('first')}
              className={`px-4 py-2 text-sm font-medium transition-colors border rounded-md ${
                expandedYear === 'first' 
                  ? 'bg-emerald-500 border-emerald-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50'
              }`}
            >
              First Year
            </button>
          </div>

          {/* Fourth Year Content */}
          <div className={`transition-all duration-300 ${expandedYear === 'fourth' ? 'block' : 'hidden'}`}>
            <div className="p-4 mb-8 bg-white border-l-4 border-red-500 shadow rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Fourth Year Students</h3>
              <div className="space-y-4">
                <StudentTable branchName="Computer Science" studentData={fourthYearComputer} />
                <StudentTable branchName="Civil Engineering" studentData={fourthYearCivil} />
                <StudentTable branchName="Electronics & Communication" studentData={fourthYearECS} />
                <StudentTable branchName="AI & Data Science" studentData={fourthYearAIDS} />
                <StudentTable branchName="Mechanical Engineering" studentData={fourthYearMechanical} />
              </div>
            </div>
          </div>

          {/* Third Year Content */}
          <div className={`transition-all duration-300 ${expandedYear === 'third' ? 'block' : 'hidden'}`}>
            <div className="p-4 mb-8 bg-white border-l-4 border-orange-500 shadow rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Third Year Students</h3>
              <div className="space-y-4">
                <StudentTable branchName="Computer Science" studentData={thirdYearComputer} />
                <StudentTable branchName="Civil Engineering" studentData={thirdYearCivil} />
                <StudentTable branchName="Electronics & Communication" studentData={thirdYearECS} />
                <StudentTable branchName="AI & Data Science" studentData={thirdYearAIDS} />
                <StudentTable branchName="Mechanical Engineering" studentData={thirdYearMechanical} />
              </div>
            </div>
          </div>

          {/* Second Year Content */}
          <div className={`transition-all duration-300 ${expandedYear === 'second' ? 'block' : 'hidden'}`}>
            <div className="p-4 mb-8 bg-white border-l-4 border-yellow-500 shadow rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Second Year Students</h3>
              <div className="space-y-4">
                <StudentTable branchName="Computer Science" studentData={secondYearComputer} />
                <StudentTable branchName="Civil Engineering" studentData={secondYearCivil} />
                <StudentTable branchName="Electronics & Communication" studentData={secondYearECS} />
                <StudentTable branchName="AI & Data Science" studentData={secondYearAIDS} />
                <StudentTable branchName="Mechanical Engineering" studentData={secondYearMechanical} />
              </div>
            </div>
          </div>

          {/* First Year Content */}
          <div className={`transition-all duration-300 ${expandedYear === 'first' ? 'block' : 'hidden'}`}>
            <div className="p-4 mb-8 bg-white border-l-4 shadow border-emerald-500 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">First Year Students</h3>
              <div className="space-y-4">
                <StudentTable branchName="Computer Science" studentData={firstYearComputer} />
                <StudentTable branchName="Civil Engineering" studentData={firstYearCivil} />
                <StudentTable branchName="Electronics & Communication" studentData={firstYearECS} />
                <StudentTable branchName="AI & Data Science" studentData={firstYearAIDS} />
                <StudentTable branchName="Mechanical Engineering" studentData={firstYearMechanical} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentYearAndBranchView;
