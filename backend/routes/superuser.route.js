const express = require('express');

// router after /admin/
const router = express.Router();

const authenticateToken = require('../middleware/auth.middleware');

const Login = require('../controllers/SuperUser/login.controller.js');

// management methods
const { managementUsers, managementAddUsers, managementDeleteUsers } = require('../controllers/SuperUser/user-management.controller.js');
// tpo methods
const { tpoUsers, tpoAddUsers, tpoDeleteUsers } = require('../controllers/SuperUser/user-tpo.controller.js');
// student methods
const { studentUsers, studentAddUsers, studentDeleteUsers, studentApprove } = require('../controllers/SuperUser/user-student.controller.js');



router.post('/login', Login);

// management routes
router.get('/management-users', authenticateToken, managementUsers);
router.post('/management-add-user', authenticateToken, managementAddUsers);
router.post('/management-delete-user', authenticateToken, managementDeleteUsers);

// tpo routes
router.get('/tpo-users', authenticateToken, tpoUsers);
router.post('/tpo-add-user', authenticateToken, tpoAddUsers);
router.post('/tpo-delete-user', authenticateToken, tpoDeleteUsers);

// student routes
router.get('/student-users', authenticateToken, studentUsers);
router.post('/student-add-user', authenticateToken, studentAddUsers);
router.post('/student-delete-user', authenticateToken, studentDeleteUsers);
// approve student
router.post('/student-approve', authenticateToken, studentApprove);


module.exports = router;