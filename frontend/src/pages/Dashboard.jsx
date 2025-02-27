import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "../redux/taskSlice";
import { getTasks } from "../api/taskApi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const user = useSelector((state) => state.user?.user);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTasks();
      dispatch(setTasks(data));
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUserTasks(tasks.filter((task) => task.email === user.email));
    }
  }, [tasks, user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">📌 Your Tasks</h2>
      <div className="mt-4 space-y-2">
        {userTasks.map((task) => (
          <div key={task._id} className="p-4 border rounded-lg shadow">
            <h3 className="font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <p className="text-sm text-gray-600">{task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
