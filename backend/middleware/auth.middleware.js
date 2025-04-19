const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.header('Authorization');
    
    // Check if header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Invalid authorization format. Please login again.' });
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ msg: 'Login Required!' });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with matching ID
    const user = await User.findOne({ _id: decoded.userId });
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found. Please login again.' });
    }
    
    // Add user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.log("auth.middleware.js => ", error);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: 'Session Expired! Please Login Again.' });
    }
    
    return res.status(401).json({ msg: 'Authentication failed. Please login again.' });
  }
};

module.exports = authenticateToken;
