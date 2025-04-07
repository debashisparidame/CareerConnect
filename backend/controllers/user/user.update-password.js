const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

const UpdatePassword = async (req, res) => {
  const { oldpass, newpass } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.send("User Not Found!");

    const isMatch = await bcrypt.compare(oldpass, user.password);

    if (isMatch) {
      const hashPassword = await bcrypt.hash(newpass, 10);
      user.password = hashPassword;
      await user.save();

      return res.send("Password Updated Successfully!");

    } else return res.send("Password Did Not Matched!");

  } catch (error) {
    console.log("UpdatePassword.js => ", error)
    return res.status(500).send('Server error');
  }
}

module.exports = UpdatePassword;