import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask, deleteTask } from "../redux/taskSlice";
import { motion } from "framer-motion";
import {
  Trash2,
  Clock,
  CheckCircle,
  Flag,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";

const MainToDo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const user = useSelector((state) => state.user?.user);
  console.log(user);
  if (!user) {
    return <p>Loading...</p>;
  }

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  useEffect(() => {
    if (!user) {
      fetchCurrentUser(dispatch);
    }
  }, [user, dispatch]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskData.title.trim() || !taskData.description.trim()) return;
    const newTask = {
      ...taskData,
      status: "Pending",
      email: user.email,
      dueDate: new Date().toISOString(),
    };
    dispatch(addTask(newTask));
    setTaskData({ title: "", description: "", priority: "Medium" });
  };

  const handleLogout = () => {
    logoutUser(dispatch);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            📋 Hello,{user?.name} !
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        <form
          onSubmit={handleAddTask}
          className="bg-gray-50 p-4 rounded-lg shadow-md mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">Add a New Task</h3>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Task Description"
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
          >
            ➕ Add Task
          </button>
        </form>

        {/* Task List */}
        {loading ? (
          <p className="text-center text-gray-600">Loading tasks...</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-yellow-600 bg-yellow-100">
                      <CheckCircle className="inline w-4 h-4 mr-1" />{" "}
                      {task.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-100">
                      <Flag className="inline w-4 h-4 mr-1" /> {task.priority}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-gray-600 bg-gray-200">
                      <Clock className="inline w-4 h-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(deleteTask(task._id))}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainToDo;
