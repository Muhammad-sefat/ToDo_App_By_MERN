import { useEffect, useState } from "react";
import { registerUser, googleLogin, fetchCurrentUser } from "../api/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      await dispatch(registerUser(formData));
      alert("Registered successfully");
      navigate("/main-todo");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#2c003e] to-[#6a0572]">
      <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#c800ff]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#c800ff]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#c800ff]"
          />
          <button
            type="submit"
            className="w-full bg-[#a032bf] hover:bg-[#5f1c72] text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Register
          </button>
          <button
            type="button"
            onClick={googleLogin}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition duration-300 mt-2"
          >
            Register with Google
          </button>
        </form>
        <p className="text-white text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-pink-300 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
