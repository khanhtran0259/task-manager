const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendLoginCodeEmail } = require('../utils/mailService');

const createLoginByEmailCode = async (req, res) => {
      const { email } = req.body;
      try {
            const user = await User.findOne(email);
            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }
            const code = Math.random().toString(36).substring(2, 8);
            await User.update(user.id, { loginByEmailCode: code });
            await sendLoginCodeEmail(email, code);
            res.json({ message: 'Login code sent to email' });
      } catch (error) {
            console.error('Error creating login code:', error);
            res.status(500).json({ message: 'Internal server error' });
      }
};


const validateLoginByEmailCode = async (req, res) => {
      const { email, code } = req.body;
      console.log('Received validate login code:', req.body);
      try {
            const user = await User.findOne(email);
            if (!user || user.loginByEmailCode !== code) {
                  return res.status(400).json({ message: 'Invalid code' });
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await User.update(user.id, { loginByEmailCode: "" });
            res.json({ message: 'Login successful', user: { ...user, token } });
      } catch (error) {
            console.error('Error validating login code:', error);
            res.status(500).json({ message: 'Internal server error' });
      }
};

const getAllUsers = async (req, res) => {
      try {
            const users = await User.findAll();
            res.json(users);
      } catch (error) {
            console.error('Error fetching all users:', error);
            res.status(500).json({ message: 'Internal server error' });
      }
};

const getUsers = async (req, res) => {
      try {
            const users = await User.findByRole('member');
            const userWithTaskCount = await Promise.all(
                  users.map(async (user) => {
                        const pendingTasks = await Task.countByStatus(user.id, 'Pending');
                        const inprogressTasks = await Task.countByStatus(user.id, 'In Progress');
                        const completedTasks = await Task.countByStatus(user.id, 'Completed');
                        return {
                              ...user,
                              taskCount: {
                              pending: pendingTasks,
                              inProgress: inprogressTasks,
                              completed: completedTasks
                        }
                  };
            }));
            res.json(userWithTaskCount);
      } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal server error" });
      }
}
const getUserById = async (req, res) => {
      const userId = req.params.id;
      try {
            const user = await User.findById(userId);
            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
      } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal server error" });
      }
}
const deleteUser = async (req, res) => {
      const userId = req.params.id;
      try {
            const user = await User.findById(userId);
            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }
            await User.update(userId, { isDeleted: true });
            res.json({ message: 'User deleted successfully' });
      } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ error: "Internal server error" });
      }
};

const validateInviteByAdminCode = async (req, res) => {
      const { inviteCode } = req.body;
      try {
            const users = await User.findByRole('member');
            const user = users.find(u => u.inviteByAdminCode === inviteCode);
            if (!user) {
                  return res.status(400).json({ message: 'Invalid invite code' });
            }
            res.json({ message: 'Invite code is valid', userId: user.id });
      } catch (error) {
            console.error('Error validating invite code:', error);
            res.status(500).json({ message: 'Internal server error' });
      }
};
module.exports = {
      getUsers,
      getUserById,
      deleteUser,
      validateInviteByAdminCode,
      createLoginByEmailCode,
      validateLoginByEmailCode,
      getAllUsers,
};