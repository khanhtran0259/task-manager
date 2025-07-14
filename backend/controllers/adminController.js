const User = require('../models/User');
const { sendInviteEmail } = require('../utils/mailService');
const crypto = require('crypto');
const createNewAccessCode = async (req, res) => {
      try {
            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                  return res.status(400).json({ message: "phoneNumber is required" });
            }

            const user = await User.findByPhoneNumber(phoneNumber);
            if (!user) {
                  return res.status(404).json({ message: "User not found" });
            }

            const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
            await User.update(user.id, { accessCode });

            // gửi SMS
            await sendAccessCodeSMS(phoneNumber, accessCode);

            res.status(200).json({ message: "Access code created and sent successfully" });
      } catch (error) {
            console.error("Error creating access code:", error);
            res.status(500).json({ message: "Internal server error" });
      }
};

const createInviteByAdminCode = async (req, res) => {
      const { email } = req.body;
      try {
            const inviteCode = crypto.randomBytes(6).toString('hex');

            let user = await User.findOne(email);
            if (user) {
                  await User.update(user.id, { inviteByAdminCode: inviteCode });
            } else {
                  const newUser = new User({
                        name: '', email, password: '', phonenumber: '', role: 'member',
                        imageUrl: '', adminInviteToken: '', inviteByAdminCode: inviteCode
                  });
                  user = await User.create(newUser);
            }

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const inviteLink = `${frontendUrl}/signup?invite=${inviteCode}`;
            await sendInviteEmail(email, inviteLink);

            res.json({ message: 'Invite code created and email sent!' });
      } catch (error) {
            console.error('Error creating invite code:', error);
            res.status(500).json({ message: 'Internal server error' });
      }
};

const validateAccessCode = async (req, res) => {
      const { phoneNumber, accessCode } = req.body;
      if (!phoneNumber || !accessCode) {
            return res.status(400).json({ message: 'phoneNumber and accessCode are required' });
      }

      try {
            const user = await User.findByPhoneNumber(phoneNumber);
            if (!user) {
                  return res.status(404).json({ message: 'User not found with this phone number' });
            }

            if (user.accessCode !== accessCode) {
                  return res.status(400).json({ message: 'Invalid access code' });
            }

            await User.update(user.id, { accessCode: '' });

            return res.json({ success: true });
      } catch (error) {
            console.error("Error validating access code:", error);
            return res.status(500).json({ message: 'Internal server error' });
      }
};

module.exports = {
      createNewAccessCode,
      validateAccessCode,
      createInviteByAdminCode
};
