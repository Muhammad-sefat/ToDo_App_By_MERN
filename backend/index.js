require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const taskRoute = require("./routes/taskRoutes");
require("./config/passport");
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ["https://todoapp-frontend-chi.vercel.app", "http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

connectDB();

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// call route
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

app.get("/", (req, res) => {
  res.send("ToDo_App Backend is Running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
