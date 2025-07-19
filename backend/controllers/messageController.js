const Message = require('../models/Message');

const sendMessage = async (req, res) => {
      const { receiverId, content } = req.body;
      const senderId = req.user.id; 
      try {
            const newMsg = await Message.create({ senderId, receiverId, content });
            res.status(201).json(newMsg);
      } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Internal server error' });
      }
};

const getMessages = async (req, res) => {
      const currentUserId = req.user.id;
      const otherUserId = req.query.userId;

      if (!otherUserId) {
            return res.status(400).json({ error: 'Missing userId in query' });
      }

      try {
            const messages = await Message.getConversation(currentUserId, otherUserId);
            res.status(200).json(messages);
      } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Internal server error' });
      }
};


module.exports = {
      sendMessage,
      getMessages,
};
