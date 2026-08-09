import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useLandingTranslation } from "../../hooks/useTranslations";
import LanguageSwitcher from "../common/LanguageSwitcher";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { lt } = useLandingTranslation();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">

      <div className="logo">
        <span className="logo-icon">📝</span>
        <span>{t("appName")}</span>
      </div>

      <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>

        <ul className="nav-links">

          <li>
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
            >
              {lt("navbar.features")}
            </a>
          </li>

          <li>
            <a
              href="#workflow"
              onClick={() => setMenuOpen(false)}
            >
              {lt("navbar.workflow")}
            </a>
          </li>

          <li>
            <a
              href="#pricing"
              onClick={() => setMenuOpen(false)}
            >
              {lt("navbar.pricing")}
            </a>
          </li>

          <li>
            <a
              href="#faq"
              onClick={() => setMenuOpen(false)}
            >
              {lt("navbar.faq")}
            </a>
          </li>

        </ul>
        <div className="mobile-actions">

          <Link
            to="/login"
            className="mobile-login-btn"
            onClick={() => setMenuOpen(false)}
          >
            {lt("navbar.login")}
          </Link>

          <Link
            to="/register"
            className="mobile-start-btn"
            onClick={() => setMenuOpen(false)}
          >
            {lt("navbar.getStarted")}
          </Link>

        </div>

      </nav>

      <div className="nav-actions">

        <LanguageSwitcher />

        <button
          className="theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>

        <Link
          className="login-btn"
          to="/login"
        >
          {lt("navbar.login")}
        </Link>

        <Link
          className="start-btn"
          to="/register"
        >
           {lt("navbar.getStarted")}
        </Link>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

      </div>

    </header>
  );
}

export default Navbar;