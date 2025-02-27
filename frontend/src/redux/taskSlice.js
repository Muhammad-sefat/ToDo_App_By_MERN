import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [] },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTaskState: (state, action) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) state.tasks[index] = action.payload;
    },
    deleteTaskState: (state, action) => {
      state.tasks = state.tasks.filter((t) => t._id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTaskState, deleteTaskState } =
  taskSlice.actions;
export default taskSlice.reducer;
