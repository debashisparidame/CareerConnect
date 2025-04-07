const express = require('express');

// router after /company/
const router = express.Router();

const authenticateToken = require('../middleware/auth.middleware');


const { AddCompany, UpdateCompany, CompanyDetail, AllCompanyDetail, DeleteCompany } = require('../controllers/Company/company.all-company.controller');



router.get('/company-detail', authenticateToken, AllCompanyDetail);
// router.get('/company-detail/:companyId', authenticateToken, CompanyDetail);

// company details 
router.post('/add-company', authenticateToken, AddCompany);

router.post('/update-company', authenticateToken, UpdateCompany);

router.post('/delete-company', authenticateToken, DeleteCompany);

router.get('/company-data', CompanyDetail);





module.exports = router;