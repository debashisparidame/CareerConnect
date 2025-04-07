const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ msg: 'Login Required!' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user with the matching token
    const user = await User.findOne({ _id: decoded.userId, token });

    if (!user) return res.status(401).json({ msg: 'Token is not valid! Plase Login.' });
    // console.log(user);

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ msg: 'Session Expired! Please Login Again.' });
    } else {
      console.log("auth.middleware.js => ", error);
      res.status(401).json({ msg: 'Please Login First' });
    }
  }
}

module.exports = authenticateToken;
