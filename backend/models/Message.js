const db = require('../config/firebase');

class Message {
      constructor({ senderId, receiverId, content, timestamp }) {
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.content = content;
            this.timestamp = timestamp || new Date().toISOString();
      }

      static getConversationId(user1Id, user2Id) {
            return [user1Id, user2Id].sort().join('_'); // sắp xếp để tránh lặp
      }

      static async create({ senderId, receiverId, content }) {
            const timestamp = new Date().toISOString();
            const conversationId = this.getConversationId(senderId, receiverId);

            const newMessageRef = db.ref(`conversations/${conversationId}`).push();
            const data = { senderId, receiverId, content, timestamp };

            await newMessageRef.set(data);
            return { id: newMessageRef.key, ...data };
      }

      static async getConversation(user1Id, user2Id) {
            const conversationId = this.getConversationId(user1Id, user2Id);
            const snapshot = await db.ref(`conversations/${conversationId}`).once('value');

            if (!snapshot.exists()) return [];

            const allMessages = Object.entries(snapshot.val()).map(([id, msg]) => ({ id, ...msg }));
            return allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      }
}
module.exports = Message;
