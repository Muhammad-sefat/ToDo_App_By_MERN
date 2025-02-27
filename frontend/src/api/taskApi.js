import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const getTasks = async (email) => {
  const response = await axios.get(`${API_URL}?email=${email}`, {
    withCredentials: true,
  });
  return response.data;
};

export const createTask = async (newTask) => {
  const response = await axios.post(API_URL, newTask, {
    withCredentials: true,
  });
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await axios.put(`${API_URL}/${id}`, task, {
    withCredentials: true,
  });
  return response.data;
};

export const removeTask = async (id) => {
  await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};
