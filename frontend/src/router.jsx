import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import MainToDo from "./pages/MainToDo";

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/main-todo",
    element: <MainToDo />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
