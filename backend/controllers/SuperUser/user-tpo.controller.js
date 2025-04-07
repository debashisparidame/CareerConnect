const User = require("../../models/user.model");
const bcrypt = require("bcrypt");


const tpoUsers = async (req, res) => {
  const tpoUsers = await User.find({ role: "tpo_admin" });
  res.json({ tpoUsers })
}

const tpoAddUsers = async (req, res) => {
  const email = req.body.email;

  try {
    if (await User.findOne({ email }))
      return res.json({ msg: "User Already Exists!" });

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({ first_name: req.body.first_name, email: req.body.email, number: req.body.number, password: hashPassword, role: "tpo_admin" });
    await newUser.save();
    return res.json({ msg: "User Created!" });
  } catch (error) {
    console.log("user-tpo.controller => ", error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

const tpoDeleteUsers = async (req, res) => {
  // const user = await Users.find({email: req.body.email});
  const ress = await User.deleteOne({ email: req.body.email });
  if (ress.acknowledged) {
    return res.json({ msg: "User Deleted Successfully!" });
  } else {
    return res.json({ msg: "Error While Deleting User!" });
  }
}


module.exports = {
  tpoUsers,
  tpoAddUsers,
  tpoDeleteUsers
};