const Message = require('../models/Message');
const User = require('../models/User');

const sendMessage = async (req, res) => {
  try {
    const { recipientRole, subject, content } = req.body;

    if (!recipientRole || !subject || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const message = new Message({
      sender: req.user.id,
      recipientRole,
      subject,
      content
    });

    await message.save();

    res.status(201).json({ success: true, message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const messages = await Message.find({
      $or: [
        { recipientRole: currentUser.userType },
        { sender: currentUser._id }
      ]
    })
      .populate('sender', 'firstName lastName userType email')
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages
};
