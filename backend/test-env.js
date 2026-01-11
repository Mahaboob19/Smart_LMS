// test-env.js
require('dotenv').config();

console.log('=== Environment Variables Test ===');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Loaded' : '✗ NOT LOADED');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Loaded' : '✗ NOT LOADED');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('==============================');

// Test JWT generation
const jwt = require('jsonwebtoken');

if (process.env.JWT_SECRET) {
  try {
    const token = jwt.sign({ test: 'data' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✓ JWT Token generation test successful');
    console.log('Token sample (first 20 chars):', token.substring(0, 20) + '...');
  } catch (error) {
    console.error('✗ JWT Token generation failed:', error.message);
  }
}