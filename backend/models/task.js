const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
    googleEventId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
