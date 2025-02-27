import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/taskSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const userTasks = tasks.filter((task) => task.email === user.email);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          📊 My Dashboard
        </h2>
        <button
          onClick={() => navigate("/todo")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Back to To-Do List
        </button>

        <div className="mt-6 space-y-4">
          {userTasks.map((task) => (
            <div key={task._id} className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-500">Priority: {task.priority}</p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
