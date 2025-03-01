import axios from "axios";
import { loginSuccess, logout } from "../redux/userSlice";

const API_URL = "http://localhost:5000/api/auth";

// register user
export const registerUser = (userData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
    return res.data;
  } catch (error) {
    throw error;
  }
};

// login user
export const loginUser = (userData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
    return res.data;
  } catch (error) {
    throw error;
  }
};

// google sign up
export const googleLogin = () => {
  window.open(`${API_URL}/google`, "_self");
};

// Fetch user after Google login
export const fetchCurrentUser = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const googleAccessToken = localStorage.getItem("googleAccessToken");

    if (!token) {
      console.error("No token found!");
      return;
    }

    const res = await axios.get(
      "https://todoapp-backend-sandy.vercel.app/api/auth/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    dispatch(
      loginSuccess({
        user: { ...res.data.user, googleAccessToken: googleAccessToken },
        token,
      })
    );
  } catch (error) {
    console.error("Failed to fetch user:", error.response?.data || error);
  }
};

// Logout user
export const logoutUser = (dispatch) => {
  dispatch(logout());
};
