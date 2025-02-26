const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jsonwebtoken");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// **Google OAuth Login**
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// **Google OAuth Callback (Fixed)**
exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect("http://localhost:5173");
    }

    // Generate JWT Token
    const token = generateToken(user._id);

    // Redirect with Token
    res.redirect(`http://localhost:5173/main-todo?token=${token}`);
  })(req, res, next);
};

// **Setup Two-Factor Authentication (2FA)**
exports.setupTwoFactorAuth = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    user.isTwoFactorEnabled = true;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, qrCode) => {
      if (err) return res.status(500).json({ msg: "Error generating QR Code" });

      res.json({ qrCode, secret: secret.base32 });
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// **Verify Two-Factor Authentication (2FA)**
exports.verifyTwoFactorAuth = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.twoFactorSecret)
      return res.status(400).json({ msg: "2FA not set up" });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) return res.status(400).json({ msg: "Invalid 2FA code" });

    res.json({ msg: "2FA verified" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
