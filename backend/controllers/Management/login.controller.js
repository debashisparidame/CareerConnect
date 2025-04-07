const User = require("../../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User Doesn't Exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || user.role !== "management_admin")
      return res.status(400).json({ msg: 'Credentials Not Matched!' });

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