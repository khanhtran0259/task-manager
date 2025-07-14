const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../config/firebase.js");

const generateToken = (user) => {
      return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const registerUser = async (req, res) => {
      try {
            const { name, email, password, phonenumber, adminInviteToken, imageUrl } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne(email);
            if (existingUser) {
                  return res.status(400).json({ message: 'User already exists' });
            }

            let role = "member";
            if(adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) { 
                  role = "admin";
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create( {
                  name,
                  email,
                  password: hashedPassword,
                  phonenumber,
                  role,
                  imageUrl: imageUrl || null,
                  adminInviteToken : adminInviteToken || null
            });

            res.status(201).json({
                  message: 'User registered successfully',
                  user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        phonenumber: newUser.phonenumber,
                        role: newUser.role,
                        imageUrl: newUser.imageUrl || null,
                        token: generateToken(newUser.id)
                  }
            });

      } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Server error' });

      }
}
const loginUser = async (req, res) => {
      try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne(email);
            if (!user) {
                  return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                  return res.status(400).json({ message: 'Invalid email or password' });
            }

            res.status(200).json({
                  message: 'Login successful',
                  user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phonenumber: user.phonenumber,
                        role: user.role,
                        imageUrl : user.imageUrl || null,
                        token: generateToken(user)
                  }
                  
            });

      } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error' });
            
      }
 }
const getUserProfile = async (req, res) => {
      try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  phonenumber: user.phonenumber,
                  role: user.role,
                  imageUrl: user.imageUrl || null,
            });

      } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Server error' });
      }
 }
const updateUserProfile = async (req, res) => { 
      try {
            const userId = req.user.id;
            const { name, email, phonenumber, imageUrl } = req.body;

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }

            // Update user details
            user.name = name || user.name;
            user.email = email || user.email;
            user.phonenumber = phonenumber || user.phonenumber;
            user.imageUrl = user.imageUrl || null;

            // Save updated user
            await db.ref(`users/${userId}`).update({
                  name: user.name,
                  email: user.email,
                  phonenumber: user.phonenumber,
                  imageUrl: user.imageUrl
            });

            res.status(200).json({
                  message: 'Profile updated successfully',
                  user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phonenumber: user.phonenumber,
                        role: user.role,
                        imageUrl: user.imageUrl
                  }
            });

      } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Server error' });
      }
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };