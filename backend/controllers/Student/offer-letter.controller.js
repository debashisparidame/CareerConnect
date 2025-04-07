const User = require("../../models/user.model.js");
const JobSchema = require("../../models/job.model.js");
const cloudinary = require("../../config/Cloudinary.js");

// Upload Offer Letter to Cloudinary
const UploadOfferLetter = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No offer letter uploaded" });

    const job = await JobSchema.findById(req.body.jobId);
    if (!job) return res.status(404).json({ msg: "Job not found!" });

    // Finding the applicant
    const applicant = job.applicants.find((app) => app.studentId == req.body.studentId);
    if (!applicant) return res.status(400).json({ msg: "Student has not applied to this job!" });

    // Upload offer letter to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "CPMS/Offer Letter",
    });

    // Update offer letter path in MongoDB
    applicant.offerLetter = cloudinaryResponse.secure_url;

    await job.save();
    return res.json({ msg: "Offer Letter Uploaded Successfully!", url: cloudinaryResponse.secure_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error", error });
  }
};

// Delete Offer Letter from Cloudinary & MongoDB
const DeleteOfferLetter = async (req, res) => {
  try {
    if (!req.params) return res.status(400).json({ msg: "Error while receiving data!" });

    const job = await JobSchema.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: "Job not found!" });

    const applicant = job.applicants.find((app) => app.studentId == req.params.studentId);
    if (!applicant || !applicant.offerLetter) return res.status(400).json({ msg: "No offer letter found for this student!" });

    // Extract public_id from Cloudinary URL
    const publicId = applicant.offerLetter.split("/").pop().split(".")[0]; // Extract public ID
    await cloudinary.uploader.destroy(`CPMS/Offer Letter/${publicId}`, { resource_type: "raw" });

    // Remove offer letter from MongoDB
    applicant.offerLetter = null;
    await job.save();

    return res.json({ msg: "Offer Letter Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error", error });
  }
};

module.exports = {
  UploadOfferLetter,
  DeleteOfferLetter,
};
