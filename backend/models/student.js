const mongoose = require('mongoose');
const User = require('./user');

const studentSchema = new mongoose.Schema({
  // Student-specific fields
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[0-9]{2}[A-Z]{2}[0-9]{1}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{1}$/, 'Please enter a valid roll number']
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
      'Artificial Intelligence',
      'Data Science'
    ]
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: ['I Year', 'II Year', 'III Year', 'IV Year']
  },
  section: {
    type: String,
    uppercase: true,
    enum: ['A', 'B', 'C', 'D']
  },
  
  // Academic details
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  
  // Library specific
  libraryCardNumber: {
    type: String,
    unique: true
  },
  booksBorrowed: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    borrowedDate: Date,
    dueDate: Date,
    returnDate: Date,
    fineAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue'],
      default: 'active'
    }
  }],
  
  // Statistics
  totalBooksBorrowed: {
    type: Number,
    default: 0
  },
  totalFinePaid: {
    type: Number,
    default: 0
  },
  currentFine: {
    type: Number,
    default: 0
  }
});

// Create Student model as discriminator of User
const Student = User.discriminator('student', studentSchema);

module.exports = Student;