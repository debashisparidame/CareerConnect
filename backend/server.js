const express = require('express');
const mongoose = require('mongoose');
const setupDefaultUsers = require('./config/setup');
// other imports...

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Call setupDefaultUsers AFTER MongoDB connection is established
    await setupDefaultUsers();
    
    console.log('Server setup complete');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});