const express = require("express");

const { loginUser, registerUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

router.post("/upload-image", upload.single('image'), (req, res) => {
      if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
      }
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
      });
});

module.exports = router;