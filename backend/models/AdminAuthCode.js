const mongoose = require('mongoose');

// Admin Management Schema for Auth Codes
const adminAuthCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['admin', 'librarian', 'hod', 'principal'],
    required: true
  },
  department: String, // For HOD-specific codes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

const AdminAuthCode = mongoose.model('AdminAuthCode', adminAuthCodeSchema);

module.exports = AdminAuthCode;
