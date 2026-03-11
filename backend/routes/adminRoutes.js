const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getDepartments,
  getUsersByDepartment,
  generateAdminCode,
  getAdminAuthCodes
} = require('../controllers/adminController');

router.get('/departments', getDepartments);

router.use(verifyToken);
router.get('/users/department/:department', getUsersByDepartment);
router.post('/admin/generate-code', generateAdminCode);
router.get('/admin/auth-codes', getAdminAuthCodes);

module.exports = router;
