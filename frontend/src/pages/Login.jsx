import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthTranslation } from "../hooks/useTranslations";
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

  const { t } = useTranslation();
  const { at } = useAuthTranslation();

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

      setMessage(at("messages.loginSuccess"));

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.detail || at("messages.loginFailed"));
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-header">

          <div className="logo-box">
            <FiLayers size={28} />
          </div>

          <h1>{t("appName")}</h1>

          <p>
            {at("platformSubtitle")}
          </p>

        </div>

        <div className="login-body">

          <div className="welcome">

            <h2>{at("login.title")}</h2>

            <p>
              {at("login.subtitle")}
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>{at("login.emailLabel")}</label>

              <div className="input-box">

                <FiMail />

                <input
                  type="email"
                  placeholder={at("login.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>

            <div className="input-group">

              <label>{at("login.passwordLabel")}</label>

              <div className="input-box">

                <FiLock />

                <input
                  type="password"
                  placeholder={at("login.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>

            </div>

            {message && (
              <div
                className={`login-message ${
                  message === at("messages.loginSuccess")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}

            <button type="submit" className="login-btn">
              {at("login.signIn")}
            </button>

            <p className="register-text">

              {at("login.noAccount")}{" "}

              <Link to="/register" className="register-link">
                {at("login.createAccount")}
              </Link>

            </p>

          </form>

        </div>

        <div className="login-footer">

          <div className="feature">
            <FiCheckCircle />
            {at("features.dragDrop")}
          </div>

          <div className="feature">
            <FiGitBranch />
            {at("features.conditionalLogic")}
          </div>

          <div className="feature">
            <FiBarChart2 />
            {at("features.analytics")}
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;