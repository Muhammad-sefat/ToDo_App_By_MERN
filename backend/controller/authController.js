const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { generateToken } = require("../utils/jsonwebtoken");
const speakeasy = require("speakeasy");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Google Authenticator Secret Key
    const secret = speakeasy.generateSecret({ name: `TodoApp (${email})` });

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      twoFASecret: secret.base32,
    });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Generate QR Code for Google Authenticator
    const data_url = await generateQRCode(secret.otpauth_url);

    // Send user data and QR code
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      qrCode: data_url,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate token
    const token = generateToken(user._id);

    // Send response without password
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// **Google OAuth Login**
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// **Google OAuth Callback (Fixed)**
exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        return res.redirect("https://todoapp-frontend-chi.vercel.app");
      }
      // Generate JWT Token
      const token = generateToken(user._id);

      // Convert user object to a JSON string and encode it
      const userData = encodeURIComponent(
        JSON.stringify({ id: user._id, name: user.name, email: user.email })
      );

      // Send token in the URL instead of cookies
      res.redirect(
        `https://todoapp-frontend-chi.vercel.app/?token=${token}&user=${userData}&googleAccessToken=${info.access_token}&googleRefreshToken=${info.refresh_token}`
      );
    }
  )(req, res, next);
};

// send the current user
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user, token });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
