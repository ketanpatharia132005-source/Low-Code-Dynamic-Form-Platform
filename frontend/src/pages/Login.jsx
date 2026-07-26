import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  FiLock,
  FiMail,
  FiLayers,
  FiBarChart2,
  FiGitBranch,
  FiCheckCircle,
} from "react-icons/fi";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/users/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", response.data.access_token);

      setMessage("Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <div className="logo-box">
            <FiLayers size={28} />
          </div>

          <h1>Dynamic Form Platform</h1>

          <p>
            Low-Code Dynamic Form Builder
          </p>

        </div>

        <div className="login-body">

          <div className="welcome">

            <h2>Welcome Back</h2>

            <p>
              Sign in to continue to your workspace.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>Email Address</label>

              <div className="input-box">

                <FiMail />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>

            <div className="input-group">

              <label>Password</label>

              <div className="input-box">

                <FiLock />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>

            </div>

            {message && (
              <div
                className={`login-message ${
                  message === "Login Successful!"
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}

            <button type="submit" className="login-btn">
              Sign In
            </button>

          </form>

        </div>

        <div className="login-footer">

          <div className="feature">

            <FiCheckCircle />

            Drag & Drop Builder

          </div>

          <div className="feature">

            <FiGitBranch />

            Conditional Logic

          </div>

          <div className="feature">

            <FiBarChart2 />

            Analytics Dashboard

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;