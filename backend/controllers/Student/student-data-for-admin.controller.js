const User = require("../../models/user.model");
const Job = require("../../models/job.model");


const StudentDataYearBranchWise = async (req, res) => {
  try {
    // first year 
    const firstYearComputer = await User.find({ role: "student", "studentProfile.department": "Computer", "studentProfile.year": 1 });
    const firstYearCivil = await User.find({ role: "student", "studentProfile.department": "Civil", "studentProfile.year": 1 });
    const firstYearECS = await User.find({ role: "student", "studentProfile.department": "ECS", "studentProfile.year": 1 });
    const firstYearAIDS = await User.find({ role: "student", "studentProfile.department": "AIDS", "studentProfile.year": 1 });
    const firstYearMechanical = await User.find({ role: "student", "studentProfile.department": "Mechanical", "studentProfile.year": 1 });

    // second year 
    const secondYearComputer = await User.find({ role: "student", "studentProfile.department": "Computer", "studentProfile.year": 2 });
    const secondYearCivil = await User.find({ role: "student", "studentProfile.department": "Civil", "studentProfile.year": 2 });
    const secondYearECS = await User.find({ role: "student", "studentProfile.department": "ECS", "studentProfile.year": 2 });
    const secondYearAIDS = await User.find({ role: "student", "studentProfile.department": "AIDS", "studentProfile.year": 2 });
    const secondYearMechanical = await User.find({ role: "student", "studentProfile.department": "Mechanical", "studentProfile.year": 2 });

    // third year 
    const thirdYearComputer = await User.find({ role: "student", "studentProfile.department": "Computer", "studentProfile.year": 3 });
    const thirdYearCivil = await User.find({ role: "student", "studentProfile.department": "Civil", "studentProfile.year": 3 });
    const thirdYearECS = await User.find({ role: "student", "studentProfile.department": "ECS", "studentProfile.year": 3 });
    const thirdYearAIDS = await User.find({ role: "student", "studentProfile.department": "AIDS", "studentProfile.year": 3 });
    const thirdYearMechanical = await User.find({ role: "student", "studentProfile.department": "Mechanical", "studentProfile.year": 3 });

    // fourth year 
    const fourthYearComputer = await User.find({ role: "student", "studentProfile.department": "Computer", "studentProfile.year": 4 });
    const fourthYearCivil = await User.find({ role: "student", "studentProfile.department": "Civil", "studentProfile.year": 4 });
    const fourthYearECS = await User.find({ role: "student", "studentProfile.department": "ECS", "studentProfile.year": 4 });
    const fourthYearAIDS = await User.find({ role: "student", "studentProfile.department": "AIDS", "studentProfile.year": 4 });
    const fourthYearMechanical = await User.find({ role: "student", "studentProfile.department": "Mechanical", "studentProfile.year": 4 });

    return res.json({ firstYearComputer, firstYearCivil, firstYearECS, firstYearAIDS, firstYearMechanical, secondYearComputer, secondYearCivil, secondYearECS, secondYearAIDS, secondYearMechanical, thirdYearComputer, thirdYearCivil, thirdYearECS, thirdYearAIDS, thirdYearMechanical, fourthYearComputer, fourthYearCivil, fourthYearECS, fourthYearAIDS, fourthYearMechanical });
  } catch (error) {
    console.log("student-data-for-admin.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const NotifyStudentStatus = async (req, res) => {
  try {
    const filteredStudents = await User.find({
      role: 'student',
      'studentProfile.appliedJobs.status': { $in: ['interview', 'hired'] }
    })
      .select('_id first_name last_name studentProfile.year studentProfile.department studentProfile.appliedJobs')
      .lean();

    const studentsWithJobDetails = [];

    for (const student of filteredStudents) {
      // Filter applied jobs with status 'interview' or 'hired'
      const appliedJobs = student.studentProfile.appliedJobs.filter(job => ['interview', 'hired'].includes(job.status));

      // Fetch job details for each jobId in the applied jobs
      const jobDetails = await Job.find({
        _id: { $in: appliedJobs.map(job => job.jobId) } // Match the job IDs
      })
        .populate('company', 'companyName')
        .select('company jobTitle _id') // Select company name and job title
        .lean();

      // Map through filtered applied jobs and add the job details (company and title)
      const jobsWithDetails = appliedJobs.map(job => {
        const jobDetail = jobDetails.find(jd => String(jd._id) === String(job.jobId)); // Match jobId
        return {
          status: job.status,
          companyName: jobDetail?.company?.companyName || 'Unknown Company',
          jobId: jobDetail?._id || 'Unknown JobId',
          jobTitle: jobDetail?.jobTitle || 'Unknown Job Title'
        };
      });

      // Push the student info along with only the filtered job details into the final array
      studentsWithJobDetails.push({
        _id: student._id,
        name: `${student.first_name} ${student.last_name}`,
        year: student.studentProfile.year,
        department: student.studentProfile.department,
        jobs: jobsWithDetails // Only the filtered jobs with status 'interview' or 'hired'
      });
    }

    return res.status(200).json({ studentsWithJobDetails });
  } catch (error) {
    console.log("student-data-for-admin.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}


module.exports = {
  StudentDataYearBranchWise,
  NotifyStudentStatus
};