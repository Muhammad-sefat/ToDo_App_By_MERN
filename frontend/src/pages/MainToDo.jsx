import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, addTask } from "../redux/taskSlice";
import { getTasks, createTask } from "../api/taskApi";
import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";
import { logoutUser } from "../api/auth";

const MainToDo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  useEffect(() => {
    if (user?.email) {
      const fetchData = async () => {
        const data = await getTasks(user.email);
        dispatch(setTasks(data));
      };
      fetchData();
    }
  }, [dispatch, user?.email]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim() || !taskData.description.trim()) return;

    const newTask = {
      ...taskData,
      status: "Pending",
      email: user.email,
      dueDate: new Date().toISOString(),
    };
    try {
      const addedTask = await createTask(newTask, user.googleAccessToken);
      dispatch(addTask(addedTask));
      setTaskData({ title: "", description: "", priority: "Medium" });
      alert("Task added successfully!");
    } catch (error) {
      alert("Error adding task!");
    }
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
            📋 Hello, {user?.name}!
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
      </div>
    </div>
  );
};

export default MainToDo;
