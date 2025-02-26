const express = require("express");
const {
  register,
  login,
  googleAuth,
  googleAuthCallback,
  setupTwoFactorAuth,
  verifyTwoFactorAuth,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// **Google OAuth**
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

// **Two-Factor Authentication (2FA)**
router.post("/setup-2fa", setupTwoFactorAuth);
router.post("/verify-2fa", verifyTwoFactorAuth);

module.exports = router;
