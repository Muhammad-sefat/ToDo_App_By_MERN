import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "../redux/taskSlice";
import { motion } from "framer-motion";
import { Trash2, Clock, CheckCircle, Flag } from "lucide-react";

const MainToDo = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const getStatusColor = (status) => {
    return status === "Completed"
      ? "text-green-600 bg-green-100"
      : "text-yellow-600 bg-yellow-100";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-100";
      case "Medium":
        return "text-blue-600 bg-blue-100";
      case "Low":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📋 My To-Do List
        </h2>

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
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        task.status
                      )}`}
                    >
                      <CheckCircle className="inline w-4 h-4 mr-1" />{" "}
                      {task.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                        task.priority
                      )}`}
                    >
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
