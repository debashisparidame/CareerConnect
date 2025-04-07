const Users = require('../../models/user.model');

const UsersTPO = async (req, res) => {
  const tpoUsers = await Users.find({ role: "tpo_admin" });
  return res.json({ tpoUsers })
}

module.exports = UsersTPO;