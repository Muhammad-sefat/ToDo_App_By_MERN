import { useState } from "react";
import { loginUser, googleLogin, verifyTwoFactor } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [show2FA, setShow2FA] = useState(false);
  const [userId, setUserId] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Response:", res.data);
    try {
      const res = await loginUser(formData);

      if (res.data.requires2FA) {
        setUserId(res.data.userId);
        setShow2FA(true);
      } else {
        localStorage.setItem("token", res.data.token);
        alert("Login successful");
        navigate("/main-todo");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    console.log("Verifying 2FA for User ID:", userId, "Code:", twoFactorCode);
    try {
      await verifyTwoFactor({ userId, token: twoFactorCode });
      alert("2FA Verified. Login successful");
      navigate("/main-todo");
    } catch (err) {
      alert("Invalid 2FA code");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#1e3c72] to-[#2a5298]">
      <div className="bg-[#ffffff20] backdrop-blur-lg shadow-xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Login
        </h2>
        {!show2FA ? (
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
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <input
              type="text"
              name="twoFactorCode"
              placeholder="Enter 2FA Code"
              onChange={(e) => setTwoFactorCode(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Verify 2FA
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
