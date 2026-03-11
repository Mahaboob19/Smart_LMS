const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ['student', 'staff', 'admin', 'librarian', 'hod', 'principal'],
    default: 'student'
  },
  rollNumber: String,
  staffId: String,
  department: {
    type: String,
    required: function () {
      // Department is required for HOD and recommended for students/staff
      return this.userType === 'hod';
    }
  },
  year: String,
  libraryCardNumber: String,
  createdAt: { type: Date, default: Date.now }
});

// Index for department-based queries
userSchema.index({ department: 1, userType: 1 });
userSchema.index({ department: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
