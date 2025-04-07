const mongoose = require('mongoose');
const Notice = require('../../models/notice.model');

const SendNotice = async (req, res) => {
  try {
    if (!req.body.receiver_role) var receiver_role = "student";
    else var receiver_role = req.body.receiver_role;

    const sender_role = req.body.sender_role;
    const title = req.body.title;
    const message = req.body.message;
    const sender = new mongoose.Types.ObjectId(req.body.sender);

    await Notice.create({ sender, sender_role, receiver_role, title, message });
    return res.json({ msg: "Notice Sended Successfully!" });
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

const GetAllNotice = async (req, res) => {
  try {
    const notices = await Notice.find();
    return res.json(notices);
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

const GetNotice = async (req, res) => {
  try {
    // console.log(req.query.noticeId)
    const notice = await Notice.findById(req.query.noticeId);
    // console.log(notice)
    return res.json(notice);
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

const DeleteNotice = async (req, res) => {
  try {
    if (!req.query.noticeId) return res.json({ msg: "Error while deleting notice!" });
    await Notice.findByIdAndDelete(req?.query?.noticeId);
    return res.json({ msg: "Notice Deleted Successfully!" });
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

module.exports = {
  SendNotice,
  GetAllNotice,
  DeleteNotice,
  GetNotice,
};