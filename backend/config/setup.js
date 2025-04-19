const User = require('../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv').config();

const setupDefaultUsers = async () => {
  try {
    // Define profile URL for Super Admin with width and height parameters
    const superAdminProfile = "https://res.cloudinary.com/dopmewbjy/image/upload/w_300,h_300,c_fill,g_face/v1736176730/samples/man-portrait.jpg";
    
    // Create or Update Super Admin
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    let superAdmin = await User.findOne({ email: superAdminEmail });
    
    if (!superAdmin) {
      // Create new Super Admin if doesn't exist
      const hashPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'superadmin123', 10);
      superAdmin = await User.create({
        first_name: "Super",
        middle_name: "_",
        last_name: "Admin",
        email: superAdminEmail,
        password: hashPassword,
        role: "superuser",
        profile: superAdminProfile
      });
    } else {
      // Force direct update rather than using findByIdAndUpdate
      superAdmin.first_name = "Super";
      superAdmin.middle_name = "_";
      superAdmin.last_name = "Admin";
      superAdmin.role = "superuser";
      superAdmin.profile = superAdminProfile;
      
      await superAdmin.save();
    }

    // Create or Update Management Admin (without setting profile)
    const managementEmail = process.env.MANAGEMENT_ADMIN_EMAIL;
    let managementAdmin = await User.findOne({ email: managementEmail });
    
    if (!managementAdmin) {
      // Create new Management Admin
      const hashPassword = await bcrypt.hash(process.env.MANAGEMENT_ADMIN_PASSWORD || 'management123', 10);
      managementAdmin = await User.create({
        first_name: "Management",
        middle_name: "",
        last_name: "Admin",
        email: managementEmail,
        password: hashPassword,
        role: "management_admin"
        // profile removed
      });
    } else {
      // Update existing Management Admin using direct update
      managementAdmin.first_name = "Management";
      managementAdmin.middle_name = "";
      managementAdmin.last_name = "Admin";
      managementAdmin.role = "management_admin";
      // profile update removed
      
      await managementAdmin.save();
    }

    // Create or Update TPO Admin (without setting profile)
    const tpoEmail = process.env.TPO_ADMIN_EMAIL;
    let tpoAdmin = await User.findOne({ email: tpoEmail });
    
    if (!tpoAdmin) {
      // Create new TPO Admin
      const hashPassword = await bcrypt.hash(process.env.TPO_ADMIN_PASSWORD || 'tpo123', 10);
      tpoAdmin = await User.create({
        first_name: "TPO",
        middle_name: "",
        last_name: "Admin",
        email: tpoEmail,
        password: hashPassword,
        role: "tpo_admin"
        // profile removed
      });
    } else {
      // Update existing TPO Admin using direct update
      tpoAdmin.first_name = "TPO";
      tpoAdmin.middle_name = "";
      tpoAdmin.last_name = "Admin";
      tpoAdmin.role = "tpo_admin";
      // profile update removed
      
      await tpoAdmin.save();
    }

    console.log('✅ All default users setup completed!');
  } catch (error) {
    console.error('❌ Error setting up default users:', error);
  }
};

module.exports = setupDefaultUsers;