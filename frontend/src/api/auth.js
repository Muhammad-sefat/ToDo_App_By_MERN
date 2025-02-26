import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// register user
export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// login user
export const loginUser = async (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};
// Setup Two-Factor Authentication (2FA)
export const setupTwoFactor = async (userId) => {
  return axios.post(`${API_URL}/setup-2fa`, { userId });
};

// Verify 2FA Code
export const verifyTwoFactor = async (userId, token) => {
  return axios.post(`${API_URL}/verify-2fa`, { userId, token });
};

export const googleLogin = () => {
  window.location.href = `${API_URL}/google`;
};
