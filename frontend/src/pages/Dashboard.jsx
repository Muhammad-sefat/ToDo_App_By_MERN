import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTasks, updateTaskState, deleteTaskState } from "../redux/taskSlice";
import { getTasks, updateTask, removeTask } from "../api/taskApi";
import { FaTrash, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const user = useSelector((state) => state.user?.user);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (user?.email) {
      const fetchData = async () => {
        const data = await getTasks(user.email);
        dispatch(setTasks(data));
      };
      fetchData();
    }
  }, [dispatch, user?.email]);

  // Change Task Status
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      dispatch(updateTaskState(updatedTask));
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // Remove Task
  const handleRemoveTask = async (id) => {
    try {
      await removeTask(id);
      dispatch(deleteTaskState(id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  // Filtered Tasks
  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus ? task.status === filterStatus : true) &&
      (filterPriority ? task.priority === filterPriority : true) &&
      (filterDate ? task.dueDate.split("T")[0] === filterDate : true)
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">📌 Your Tasks</h2>

      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <select
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded bg-white"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-2 border rounded bg-white"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          type="date"
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 border rounded bg-white"
        />
      </div>

      {/* Tasks List */}
      <div className="space-y-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="p-5 bg-gradient-to-r from-gray-200 to-blue-50 border border-gray-300 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition-all duration-300"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {task.title}
                </h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">
                  📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>

                <p
                  className={`px-3 py-1 inline-block rounded-full text-white text-sm mt-2 ${
                    task.priority === "High"
                      ? "bg-red-500 shadow-md"
                      : task.priority === "Medium"
                      ? "bg-yellow-500 shadow-md"
                      : "bg-green-500 shadow-md"
                  }`}
                >
                  ⚡ {task.priority} Priority
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleStatusChange(task._id, task.status)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${
                    task.status === "Pending"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {task.status === "Pending" ? (
                    <FaHourglassHalf />
                  ) : (
                    <FaCheckCircle />
                  )}
                  {task.status}
                </button>

                <button
                  onClick={() => handleRemoveTask(task._id)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white flex items-center gap-2 font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-red-600"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 font-semibold text-lg">
            🚀 No tasks found. Add a new task!
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
