const User = require("../../models/user.model");
const jobSchema = require("../../models/job.model");


const AppliedToJob = async (req, res) => {
  try {
    // console.log(req.params);
    // if studentId is not defined return
    if (req.params.studentId === "undefined") return;
    if (req.params.jobId === "undefined") return;

    const user = await User.findById(req.params.studentId);
    const job = await jobSchema.findById(req.params.jobId);

    // retune if already applied
    if (user?.studentProfile?.appliedJobs?.some(job => job.jobId == req.params.jobId)) return res.json({ msg: "Already Applied!" });

    if (!user?.studentProfile?.resume) return res.json({ msg: 'Please Upload Resume First, Under "Placements" > "Placement Profile"' });

    user?.studentProfile?.appliedJobs?.push({ jobId: req.params.jobId, status: "applied" });
    job?.applicants?.push({ studentId: user._id });

    await user.save();
    await job.save();
    return res.status(201).json({ msg: "Applied Successfully!" });
  } catch (error) {
    console.log("apply-job.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const CheckAlreadyApplied = async (req, res) => {
  try {
    // if studentId is not defined return
    if (req.params.studentId === "undefined") return;
    if (req.params.jobId === "undefined") return;

    const user = await User.findById(req.params.studentId);

    // retune if already applied
    if (user?.studentProfile?.appliedJobs?.some(job => job.jobId == req.params.jobId)) return res.json({ applied: true });
    else return res.json({ applied: false });

  } catch (error) {
    console.log("apply-job.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = {
  AppliedToJob,
  CheckAlreadyApplied
};