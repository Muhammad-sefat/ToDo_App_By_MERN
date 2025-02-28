import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { fetchCurrentUser } from "../api/auth";

const useHandleAuthRedirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userDataEncoded = urlParams.get("user");
    const googleAccessToken = urlParams.get("googleAccessToken");

    if (token && userDataEncoded) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataEncoded));

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("googleAccessToken", googleAccessToken);

        // Update Redux state with google tokens
        dispatch(
          loginSuccess({
            user: {
              ...userData,
              googleAccessToken: googleAccessToken,
            },
            token,
          })
        );

        // Fetch current user from backend
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
};

export default useHandleAuthRedirect;
