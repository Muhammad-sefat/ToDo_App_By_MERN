const Task = require("../models/task");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/api/auth/google/callback";

// Create Task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      status,
      priority,
      email,
      googleAccessToken,
    } = req.body;

    console.log(googleAccessToken);

    const task = new Task({
      email,
      title,
      description,
      dueDate,
      status,
      priority,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Tasks for Logged-in User
exports.getTasks = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const tasks = await Task.find({ email });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
