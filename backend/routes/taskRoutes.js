const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
// const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
