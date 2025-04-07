const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  sender_role: { type: String, enum: ['student', 'tpo_admin', 'management_admin'], required: true },
  receiver_role: { type: String, enum: ['student', 'tpo_admin', 'management_admin'], required: true },
  title: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema);
