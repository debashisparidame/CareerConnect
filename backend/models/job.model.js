const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  eligibility: { type: String },
  salary: { type: Number },
  howToApply: { type: String },
  postedAt: { type: Date, default: Date.now },
  applicationDeadline: { type: Date },
  // company details
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  // applicants details
  applicants: [
    {
      studentId: { type: Schema.Types.ObjectId, ref: 'Users' },
      currentRound: {
        type: String,
        enum: ['Aptitude Test', 'Technical Interview', 'HR Interview', 'Group Discussion']
      },
      roundStatus: { type: String, enum: ['pending', 'passed', 'failed'] },
      selectionDate: { type: Date },
      joiningDate: { type: Date },
      offerLetter: { type: String },
      status: { type: String, enum: ['applied', 'interview', 'hired', 'rejected'], default: 'applied' },
      appliedAt: { type: Date, default: Date.now }
    }
  ]
});


// Middleware to delete the jobId from user's appliedJobs array before deleting the job
jobSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const jobId = this._id; // Get the current job's ID

    const User = mongoose.model('Users');

    // Remove the jobId from all users' appliedJobs array
    await User.updateMany(
      { 'studentProfile.appliedJobs.jobId': jobId }, // Find users who applied to this job
      { $pull: { 'studentProfile.appliedJobs': { jobId: jobId } } } // Remove the jobId from appliedJobs array
    );

    next(); // Proceed with the job deletion
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});


module.exports = mongoose.model('Job', jobSchema);
