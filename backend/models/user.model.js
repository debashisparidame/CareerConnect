const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: { type: String, trim: true },
  middle_name: { type: String, trim: true },
  last_name: { type: String, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  number: { type: Number, },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tpo_admin', 'management_admin', 'superuser'], required: true },
  profile: {
    type: String,
    default: 'https://res.cloudinary.com/dgu6xwnzx/image/upload/v1743159225/defaultProfileImg_cmmurk.jpg',
  },
  fullAddress: {
    address: { type: String },
    pincode: { type: Number }
  },
  dateOfBirth: { type: Date, },
  createdAt: { type: Date, default: new Date() },
  token: { type: String },
  isProfileCompleted: { type: Boolean, default: false },
  // Student specific fields
  studentProfile: {
    isApproved: { type: Boolean },
    rollNumber: { type: Number },
    resume: { type: String, },
    UIN: { type: String, unique: true, sparse: true, trim: true },
    department: { type: String, enum: ['Computer', 'Civil', 'ECS', 'AIDS', 'Mechanical'] },
    year: { type: Number, enum: [1, 2, 3, 4] },
    addmissionYear: { type: Number },
    gap: { type: Boolean, default: false },
    liveKT: { type: Number, default: 0 },
    SGPA: {
      sem1: { type: Number },
      sem2: { type: Number },
      sem3: { type: Number },
      sem4: { type: Number },
      sem5: { type: Number },
      sem6: { type: Number },
      sem7: { type: Number },
      sem8: { type: Number }
    },
    pastQualification: {
      ssc: {
        board: { type: String },
        percentage: { type: Number },
        year: { type: Number }
      },
      hsc: {
        board: { type: String },
        percentage: { type: Number },
        year: { type: Number }
      },
      diploma: {
        department: { type: String },
        percentage: { type: Number },
        year: { type: Number }
      },
    },
    appliedJobs: [
      {
        // Reference to job posting
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        // Track application status
        status: { type: String, enum: ['applied', 'interview', 'hired', 'rejected'], default: 'applied' },
        package: { type: Number },
        appliedAt: { type: Date, default: Date.now }
      }
    ],
    internships: [
      {
        type: { type: String, enum: ['Full Time', "Part Time", "On-Site", "Work From Home", "Other"] },
        companyName: { type: String },
        companyAddress: { type: String },
        companyWebsite: { type: String },
        internshipDuration: { type: Number },
        startDate: { type: Date },
        endDate: { type: Date },
        monthlyStipend: { type: Number },
        description: { type: String },
      }
    ],
  },

  // TPO Admin specific fields
  // more for tpo
  tpoProfile: { position: { type: String, trim: true }, },

  // Management Admin specific fields
  // more for management
  managementProfile: { position: { type: String, trim: true }, }

});


// Middleware to delete job applicants before deleting the user
UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const userId = this._id; // Get the current user's ID

    const Notice = mongoose.model('Notice');
    const Job = mongoose.model('Job');

    // Remove the studentId from any jobs where the user is listed as an applicant
    await Job.updateMany(
      { 'applicants.studentId': userId }, // Find jobs with the user as an applicant
      { $pull: { applicants: { studentId: userId } } } // Remove the user from the applicants array
    );

    await Notice.updateMany(
      { "sender": userId }, // Find jobs with the user as an applicant
      { $pull: { sender: userId } } // Remove the user from the applicants array
    );

    next(); // Proceed with the user deletion
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});



module.exports = mongoose.model("Users", UserSchema);