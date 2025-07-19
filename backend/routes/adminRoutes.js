const express = require("express");
const { authMiddleware, adminRoleMiddleware } = require("../middlewares/authMiddleware");
const {
      createNewAccessCode,
      validateAccessCode,
      createInviteByAdminCode
} = require("../controllers/adminController");



const router = express.Router();


router.post("/create-access-code",  createNewAccessCode);
router.post("/validate-access-code",  validateAccessCode);
router.post("/invite-user-by-admin", authMiddleware, adminRoleMiddleware ,createInviteByAdminCode)


module.exports = router;
