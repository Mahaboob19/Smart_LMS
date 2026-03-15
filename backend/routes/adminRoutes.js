const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getDepartments,
  getUsersByDepartment,
  generateAdminCode,
  getAdminAuthCodes,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');

router.get('/departments', getDepartments);
router.get('/users/department/:department', verifyToken, getUsersByDepartment);
router.post('/admin/generate-code', verifyToken, generateAdminCode);
router.get('/admin/auth-codes', verifyToken, getAdminAuthCodes);

router.get('/users', verifyToken, getAllUsers);
router.put('/users/:id', verifyToken, updateUserRole);
router.delete('/users/:id', verifyToken, deleteUser);

module.exports = router;
