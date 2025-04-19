import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Students() {
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - replace with actual API call
  const departments = [
    {
      id: 'comp',
      name: 'Computer Engineering',
      icon: 'fa-laptop-code',
      color: 'blue',
      students: [
        { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@mdo', email: 'mark.otto@example.com', year: 3, cgpa: 8.7, placed: true },
        { id: 2, firstName: 'Jacob', lastName: 'Thornton', username: '@fat', email: 'jacob.t@example.com', year: 3, cgpa: 9.2, placed: false },
        { id: 3, firstName: 'Larry', lastName: 'Bird', username: '@twitter', email: 'larry.b@example.com', year: 4, cgpa: 7.9, placed: true },
        { id: 4, firstName: 'Priya', lastName: 'Sharma', username: '@psharma', email: 'priya.s@example.com', year: 3, cgpa: 9.5, placed: false },
      ]
    },
    {
      id: 'elec',
      name: 'Electronics Engineering',
      icon: 'fa-microchip',
      color: 'green',
      students: [
        { id: 5, firstName: 'Rahul', lastName: 'Gupta', username: '@rgupta', email: 'rahul.g@example.com', year: 4, cgpa: 8.3, placed: true },
        { id: 6, firstName: 'Ananya', lastName: 'Patel', username: '@apatel', email: 'ananya.p@example.com', year: 3, cgpa: 8.9, placed: false }
      ]
    },
    {
      id: 'mech',
      name: 'Mechanical Engineering',
      icon: 'fa-cogs',
      color: 'purple',
      students: [
        { id: 7, firstName: 'Vikram', lastName: 'Singh', username: '@vsingh', email: 'vikram.s@example.com', year: 4, cgpa: 7.6, placed: true },
        { id: 8, firstName: 'Neha', lastName: 'Kumar', username: '@nkumar', email: 'neha.k@example.com', year: 3, cgpa: 8.1, placed: false }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const toggleDepartment = (deptId) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const handleFilterChange = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  // Filter students based on search query and selected filters
  const filterStudents = (students) => {
    if (!searchQuery && selectedFilters.length === 0) return students;
    
    return students.filter(student => {
      const matchesSearch = searchQuery === '' || 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilters = selectedFilters.length === 0 || 
        (selectedFilters.includes('placed') && student.placed) ||
        (selectedFilters.includes('not-placed') && !student.placed);
      
      return matchesSearch && matchesFilters;
    });
  };

  return (
    <div className="py-6">
      {/* Header and Search */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          <i className="mr-2 text-blue-600 fas fa-user-graduate"></i>
          Student Directory
        </h1>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="text-gray-400 fas fa-search"></i>
            </div>
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-lg text-sm flex items-center transition-colors ${
                selectedFilters.includes('placed') 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('placed')}
            >
              <i className={`fas fa-check-circle mr-1 ${selectedFilters.includes('placed') ? 'text-green-600' : 'text-gray-500'}`}></i>
              Placed
            </button>
            
            <button
              className={`px-3 py-2 rounded-lg text-sm flex items-center transition-colors ${
                selectedFilters.includes('not-placed') 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('not-placed')}
            >
              <i className={`fas fa-clock mr-1 ${selectedFilters.includes('not-placed') ? 'text-yellow-600' : 'text-gray-500'}`}></i>
              Not Placed
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 mb-4 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="text-gray-500">Loading students data...</p>
        </div>
      ) : (
        /* Departments */
        <div className="space-y-6">
          {departments.map((dept) => (
            <div 
              key={dept.id}
              className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl"
            >
              {/* Department Header */}
              <button
                className={`w-full flex items-center justify-between p-4 transition-colors border-l-4 ${
                  expandedDepartments[dept.id] 
                    ? `bg-${dept.color}-50 border-${dept.color}-500` 
                    : 'bg-white border-transparent hover:bg-gray-50'
                }`}
                onClick={() => toggleDepartment(dept.id)}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg bg-${dept.color}-100 text-${dept.color}-600 flex items-center justify-center mr-3`}>
                    <i className={`fas ${dept.icon}`}></i>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{dept.students.length} students</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  expandedDepartments[dept.id] ? `bg-${dept.color}-100 text-${dept.color}-600` : 'bg-gray-100 text-gray-500'
                }`}>
                  <i className={`fas fa-chevron-${expandedDepartments[dept.id] ? 'up' : 'down'}`}></i>
                </div>
              </button>
              
              {/* Students Table */}
              <AnimatePresence>
                {expandedDepartments[dept.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      {filterStudents(dept.students).length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">#</th>
                              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Student</th>
                              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Username</th>
                              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Year</th>
                              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">CGPA</th>
                              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filterStudents(dept.students).map((student, index) => (
                              <tr key={student.id} className="transition-colors hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                                      {student.firstName[0]}{student.lastName[0]}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                                      <div className="text-sm text-gray-500">{student.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{student.username}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{student.year}<sup>{
                                    student.year === 1 ? 'st' : 
                                    student.year === 2 ? 'nd' : 
                                    student.year === 3 ? 'rd' : 'th'
                                  }</sup> Year</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className={`text-sm font-medium ${
                                    student.cgpa >= 9.0 ? 'text-green-700' : 
                                    student.cgpa >= 7.0 ? 'text-blue-600' : 
                                    'text-yellow-600'
                                  }`}>
                                    {student.cgpa}
                                  </div>
                                  <div className="w-16 h-1 mt-1 bg-gray-200 rounded-full">
                                    <div 
                                      className={`h-1 rounded-full ${
                                        student.cgpa >= 9.0 ? 'bg-green-500' : 
                                        student.cgpa >= 7.0 ? 'bg-blue-500' : 
                                        'bg-yellow-500'
                                      }`}
                                      style={{ width: `${(student.cgpa / 10) * 100}%` }}
                                    ></div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {student.placed ? (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                      Placed
                                    </span>
                                  ) : (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                                      Not Placed
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                  <a href={`/tpo/user/${student.id}`} className="mr-3 text-blue-600 hover:text-blue-900">
                                    <i className="fas fa-eye"></i>
                                  </a>
                                  <a href={`/tpo/edit-user/${student.id}`} className="text-gray-600 hover:text-gray-900">
                                    <i className="fas fa-edit"></i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="py-8 text-center">
                          <i className="mb-3 text-4xl text-gray-300 fas fa-search"></i>
                          <p className="text-gray-500">No students match your search criteria</p>
                          <button
                            className="mt-2 text-sm text-blue-600 hover:underline"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedFilters([]);
                            }}
                          >
                            Clear filters
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {departments.length === 0 && (
            <div className="py-16 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <i className="text-xl text-gray-400 fas fa-school"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No departments found</h3>
              <p className="mt-1 text-gray-500">There are no departments configured in the system.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Students;
