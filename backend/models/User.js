const db = require('../config/firebase');
class User {
      constructor({ name, email, password, phonenumber, role, imageUrl, adminInviteToken, inviteByAdminCode, loginByEmailCode, isDeleted = false }) {
            this.name = name;
            this.email = email;
            this.password = password;
            this.phonenumber = phonenumber;
            this.role = role;
            this.inviteByAdminCode = inviteByAdminCode
            this.loginByEmailCode = loginByEmailCode
            this.imageUrl = imageUrl;
            this.adminInviteToken = adminInviteToken;
            this.createdAt = new Date().toISOString();
            this.isDeleted = isDeleted;

      }

      static async findById(id) {
            const snapshot = await db.ref(`users/${id}`).once('value');
            if (!snapshot.exists()) return null;
            const data = snapshot.val();
            return { id, ...data };
      }

      static async findOne(email) {
            const snapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
            if (!snapshot.exists()) return null;
            const data = snapshot.val();
            const userId = Object.keys(data)[0];
            return { id: userId, ...data[userId] };
      }

      static async create(userData) {
            const newUserRef = db.ref('users').push();
            await newUserRef.set(userData);
            return { id: newUserRef.key, ...userData };
      }
      static async update(id, userData) {
            await db.ref(`users/${id}`).update(userData);
            return this.findById(id);
      }

      static async findByRole(role) {
            const snapshot = await db.ref('users').orderByChild('role').equalTo(role).once('value');
            if (!snapshot.exists()) return [];
            const data = snapshot.val();
            return Object.entries(data).map(([id, user]) => ({ id, ...user }));
      }
      static async findByPhoneNumber(phoneNumber) {
            const snapshot = await db
                  .ref('users')
                  .orderByChild('phonenumber')
                  .equalTo(phoneNumber)
                  .once('value');
            if (!snapshot.exists()) return null;

            const data = snapshot.val();
            const userId = Object.keys(data)[0];
            return { id: userId, ...data[userId] };
      }

}

module.exports = User;