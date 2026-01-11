const User = require('../models/user');

const createInitialAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      // Create admin user
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD, // Will be hashed by pre-save hook
        userType: 'admin',
        isActive: true,
        isVerified: true,
        phone: '0000000000'
      });
      
      await admin.save();
      console.log('✅ Initial admin user created');
      console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}`);
      console.log('⚠️  Please change the default password immediately!');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

module.exports = { createInitialAdmin };