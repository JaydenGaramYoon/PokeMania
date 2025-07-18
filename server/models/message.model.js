import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  section: String,
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;