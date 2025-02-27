const express = require("express");
const {
  register,
  login,
  googleAuth,
  googleAuthCallback,
  getCurrentUser,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// **Google OAuth**
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.get("/me", getCurrentUser);

module.exports = router;
