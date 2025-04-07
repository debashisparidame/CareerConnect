const User = require("../../models/user.model.js");
const cloudinary = require("../../config/Cloudinary.js");
const path = require("path");

const UploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No resume uploaded" });
    }

    // Check for PDF MIME type
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ msg: "Only PDF files are allowed" });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ msg: "Student not found!" });
    }

    // Delete old resume from Cloudinary if it exists
    if (user.studentProfile.resume) {
      const oldResumeUrl = user.studentProfile.resume;
      const oldResumeFileName = oldResumeUrl.substring(oldResumeUrl.lastIndexOf("/") + 1).split(".")[0];
      const oldResumePublicId = `CPMS/Resume/${oldResumeFileName}`;

      await cloudinary.uploader.destroy(oldResumePublicId, { resource_type: "raw" });
    }

    // Generate a unique filename based on original name + timestamp + userId
    const originalName = path.parse(req.file.originalname).name;
    const uniqueFilename = `${originalName}_${Date.now()}_${req.body.userId}`;

    // Upload the new resume
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "CPMS/Resume",
      public_id: uniqueFilename,
    });

    // Update resume path in MongoDB
    user.studentProfile.resume = cloudinaryResponse.secure_url;
    await user.save();

    return res.status(200).json({ msg: "Resume uploaded successfully!", url: cloudinaryResponse.secure_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error", error });
  }
};

module.exports = UploadResume;
