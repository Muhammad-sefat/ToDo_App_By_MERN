import { useEffect, useState } from "react";
import { loginUser, googleLogin, fetchCurrentUser } from "../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Extract token and user data from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userDataEncoded = urlParams.get("user");

    if (token && userDataEncoded) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataEncoded));
        console.log("Decoded User Data:", userData);

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update Redux state
        dispatch(loginSuccess({ user: userData, token }));

        // Fetch current user from backend (optional)
        fetchCurrentUser(dispatch)
          .then(() => {
            navigate("/main-todo", { replace: true });
          })
          .catch((error) => {
            console.error("fetchCurrentUser failed:", error);
            navigate("/");
          });
      } catch (error) {
        console.error("Error decoding user data:", error);
      }
    }
  }, [dispatch, location, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData));
      fetchCurrentUser(dispatch);
      alert("Login successful");
      navigate("/main-todo");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#1e3c72] to-[#2a5298]">
      <div className="bg-[#ffffff20] backdrop-blur-lg shadow-xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-[#2b4f8e] hover:bg-[#1f427e] text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>
          <button
            type="button"
            onClick={googleLogin}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition duration-300 mt-2"
          >
            Login with Google
          </button>
          <p className="text-white text-center mt-4">
            Don't have an account?
            <span
              className="text-blue-300 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              {" "}
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
