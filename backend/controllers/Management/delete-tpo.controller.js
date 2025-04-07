const Users = require('../../models/user.model');

const DeleteTPO = async (req, res) => {
  // const user = await Users.find({email: req.body.email});
  const ress = await Users.deleteOne({ email: req.body.email });
  if (ress.acknowledged) {
    return res.json({ msg: "User Deleted Successfully!" });
  } else {
    return res.json({ msg: "Error While Deleting User!" });
  }
}

module.exports = DeleteTPO;