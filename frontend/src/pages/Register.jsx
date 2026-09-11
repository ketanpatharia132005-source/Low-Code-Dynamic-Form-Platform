import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthTranslation } from "../hooks/useTranslations";
import api from "../api/api";
import {
  FiUser,
  FiMail,
  FiLock,
  FiLayers,
} from "react-icons/fi";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { at } = useAuthTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setMessage(at("messages.fillAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      setMessage(at("messages.passwordMismatch"));
      return;
    }

    try {
      await api.post("/users/register", {
        username,
        email,
        password,
      });

      alert(at("messages.registrationSuccess"));

      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          at("messages.registrationFailed")
      );
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

          <p>{at("register.headerSubtitle")}</p>

        </div>

        <div className="login-body">

          <div className="welcome">

            <h2>{at("register.title")}</h2>

            <p>{at("register.subtitle")}</p>

          </div>

          <form onSubmit={handleRegister}>

            <div className="input-group">

              <label>{at("register.usernameLabel")}</label>

              <div className="input-box">

                <FiUser />

                <input
                  type="text"
                  placeholder={at("register.usernamePlaceholder")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

              </div>

            </div>

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

            <div className="input-group">

              <label>{at("register.confirmPasswordLabel")}</label>

              <div className="input-box">

                <FiLock />

                <input
                  type="password"
                  placeholder={at("register.confirmPasswordPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

              </div>

            </div>

            {message && (
              <div className="login-message error">
                {message}
              </div>
            )}

            <button className="login-btn" type="submit">
              {at("register.createAccount")}
            </button>

          </form>

          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            {at("register.alreadyHaveAccount")}{" "}

            <Link to="/login" className="register-link">
              {at("login.signIn")}
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;