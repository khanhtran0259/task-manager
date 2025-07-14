const express = require("express");
const { authMiddleware, adminRoleMiddleware } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser, validateInviteByAdminCode, createLoginByEmailCode, validateLoginByEmailCode } = require("../controllers/userController");
const router = express.Router();

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.post("/", authMiddleware, adminRoleMiddleware, deleteUser);
router.post("/validate-invite-code", validateInviteByAdminCode);
router.post("/create-login-code", createLoginByEmailCode);
router.post("/validate-login-code", validateLoginByEmailCode);

module.exports = router;