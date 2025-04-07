const StudentUser = require("../../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await StudentUser.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User Doesn't Exist!" });

    // password match 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || user.role !== "student")
      return res.status(400).json({ msg: 'Credentials Not Matched!' });

    // check if tpo has approved student
    // if (!user.studentProfile.isApproved) 
    //   return res.status(400).json({ msg: 'TPO has not approved you application, please try after some time!' });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.token = token;
    await user.save();

    return res.json({ token });
  } catch (error) {
    console.log("student.login.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = Login;