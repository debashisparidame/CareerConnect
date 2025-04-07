const User = require('../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv').config();

const setupDefaultUsers = async () => {
  try {
    // Create Super Admin
    const superAdminExists = await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
    if (!superAdminExists) {
      const hashPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
      await User.create({
        first_name: "Super Admin",
        email: process.env.SUPER_ADMIN_EMAIL,
        password: hashPassword,
        role: "superuser"
      });
    }

    // Create Management Admin
    const managementExists = await User.findOne({ email: process.env.MANAGEMENT_ADMIN_EMAIL });
    if (!managementExists) {
      const hashPassword = await bcrypt.hash(process.env.MANAGEMENT_ADMIN_PASSWORD, 10);
      await User.create({
        first_name: "Management Admin",
        email: process.env.MANAGEMENT_ADMIN_EMAIL,
        password: hashPassword,
        role: "management_admin"
      });
    }

    // Create TPO Admin  
    const tpoExists = await User.findOne({ email: process.env.TPO_ADMIN_EMAIL });
    if (!tpoExists) {
      const hashPassword = await bcrypt.hash(process.env.TPO_ADMIN_PASSWORD, 10);
      await User.create({
        first_name: "TPO Admin",
        email: process.env.TPO_ADMIN_EMAIL,
        password: hashPassword,
        role: "tpo_admin"
      });
    }

    console.log('Default users created successfully');
  } catch (error) {
    console.error('Error creating default users:', error);
  }
};

module.exports = setupDefaultUsers;