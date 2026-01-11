const mongoose = require('mongoose');
const User = require('./user');

const staffSchema = new mongoose.Schema({
  // Common fields for all staff (including HOD/Principal)
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    enum: [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Head of Department',
      'Principal',
      'Lab Assistant',
      'Technical Staff',
      'Administrative Staff',
      'Library Staff'
    ]
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Information Technology',
      'Administration',
      'Library'
    ]
  },
  
  // Employment details
  joiningDate: {
    type: Date
  },
  
  // Additional permissions
  permissions: {
    canManageBooks: {
      type: Boolean,
      default: false
    },
    canManageUsers: {
      type: Boolean,
      default: false
    },
    canViewReports: {
      type: Boolean,
      default: false
    },
    canManageLibrary: {
      type: Boolean,
      default: false
    }
  },
  
  // Library specific for library staff
  libraryPermissions: {
    canIssueBooks: {
      type: Boolean,
      default: false
    },
    canReceiveBooks: {
      type: Boolean,
      default: false
    },
    canManageInventory: {
      type: Boolean,
      default: false
    },
    canManageFines: {
      type: Boolean,
      default: false
    }
  }
});

// Create discriminator models
const Staff = User.discriminator('staff', staffSchema);
const HOD = User.discriminator('hod', staffSchema);
const Librarian = User.discriminator('librarian', staffSchema);

module.exports = { Staff, HOD, Librarian };