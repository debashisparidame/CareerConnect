const express = require('express');

// router after /student/
const router = express.Router();

// import multer for student resume upadate 
const upload = require('../config/Multer.js');

const authenticateToken = require('../middleware/auth.middleware');

// student sign controller
const Signup = require('../controllers/Student/signup.controller.js');
// student login controller
const Login = require('../controllers/Student/login.controller.js');

const UploadResume = require('../controllers/Student/resume.controller.js');
const { UploadOfferLetter, DeleteOfferLetter } = require('../controllers/Student/offer-letter.controller.js');

const { AppliedToJob, CheckAlreadyApplied } = require('../controllers/Student/apply-job.controller.js');

const { UpdateJobStatus } = require('../controllers/Student/update-job-status.controller.js');

const { GetInternships, UpdateInternship, DeleteInternship } = require('../controllers/Student/internship.controller.js');

const { StudentDataYearBranchWise, NotifyStudentStatus } = require('../controllers/Student/student-data-for-admin.controller.js');

// signup post request for student
router.post('/signup', Signup);

// login post request for student
router.post('/login', Login);


// Route to upload resume
router.post('/upload-resume', upload.single('resume'), UploadResume);

// Route to upload offer letter
router.post('/upload-offer-letter', upload.single('offerLetter'), UploadOfferLetter);
// Route to delete offer letter
router.post('/delete-offer-letter/:jobId/:studentId', authenticateToken, DeleteOfferLetter);

// apply to job
router.put('/job/:jobId/:studentId', AppliedToJob);

// check applied or not to job
router.get('/check-applied/:jobId/:studentId', CheckAlreadyApplied);

// update job status
router.post('/update-status/:jobId/:studentId', UpdateJobStatus);

// get all internship of a student
router.get('/internship', authenticateToken, GetInternships);
// update internship of a student
router.post('/update-internship', authenticateToken, UpdateInternship);
// delete internship of a student
router.post('/delete-internship', authenticateToken, DeleteInternship);



// for tpo and management only
// student arrays
router.get('/all-students-data-year-and-branch', authenticateToken, StudentDataYearBranchWise)
// student who is on interview or hired
router.get('/notify-interview-hired', authenticateToken, NotifyStudentStatus)

module.exports = router;