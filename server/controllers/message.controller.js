import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const createMessage = async (req, res) => {
  const { section, message } = req.body;
  
  if (!section || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let sender = 'Guest';
    if (req.auth && req.auth.name) {
      sender = req.auth.name;
    }

    console.log('Creating message with sender:', sender, 'Auth info:', req.auth);

    const newMessage = new Message({
      section,
      sender,
      message
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    console.error('Message save error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

export const getMessagesBySection = async (req, res) => {
  const section = req.query.section;
  if (!section) return res.status(400).json({ error: 'Missing section parameter' });

  try {
    const messages = await Message.find({ section }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

export default {
  createMessage,
  getMessagesBySection
};