const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkPrincipal() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const principals = await User.find({ userType: 'principal' });
    console.log(`Found ${principals.length} Principals:`);
    principals.forEach(p => {
      console.log(`- ${p.firstName} ${p.lastName} (${p.email}): Department: ${p.department || 'NONE'}`);
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkPrincipal();
