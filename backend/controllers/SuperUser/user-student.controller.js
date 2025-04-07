const User = require("../../models/user.model");
const JobSchema = require("../../models/job.model");
const bcrypt = require("bcrypt");


const studentUsers = async (req, res) => {
  const studentUsers = await User.find({ role: "student" });
  return res.json({ studentUsers })
}

const studentAddUsers = async (req, res) => {
  const email = req.body.email;

  try {
    if (await User.findOne({ email }))
      return res.json({ msg: "User Already Exists!" });

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      first_name: req.body.first_name,
      email: req.body.email,
      number: req.body.number,
      password: hashPassword,
      role: "student",
      studentProfile: {
        isApproved: true
      }
    });

    await newUser.save();
    return res.json({ msg: "User Created!" });
  } catch (error) {
    console.log("user-student.controller => ", error);
    return res.status(500).json({ msg: 'Server error' });
  }
}

const studentDeleteUsers = async (req, res) => {
  // const user = await Users.find({email: req.body.email});
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    // delete user and releted data
    await user.deleteOne();
    return res.json({ msg: "User Deleted Successfully!" });
  } catch (error) {
    console.log("user-delete-student.controller => ", error)
    return res.status(500).json({ msg: 'Server error' });
  }
}

const studentApprove = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log(req.body)
    // console.log(user)

    if (!user)
      return res.status(404).json({ msg: 'Student not found' });

    user.studentProfile.isApproved = true;
    await user.save();
    return res.json({ msg: "Student Successfully Approved!" });
  } catch (error) {
    console.error('Error approving student user:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
}


module.exports = {
  studentUsers,
  studentAddUsers,
  studentDeleteUsers,
  studentApprove
};