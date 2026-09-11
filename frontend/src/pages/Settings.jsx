import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  User,
  Shield,
  Database,
  Sun,
  Moon,
  Languages,
  Briefcase,
  Info,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../api/api";
import "./Settings.css";

function Settings() {
  const { i18n, t: lt } = useTranslation();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("i18nextLng") || i18n.language || "en"
  );
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const currentLanguage =
      language.startsWith("hi") ? "hi" : "en";

    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }

    localStorage.setItem(
      "i18nextLng",
      currentLanguage
    );
  }, [language, i18n]);

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);

      const res = await api.get("/users/me");

      setProfile(res.data);
    } catch (err) {
      console.error(
        "Failed to load profile:",
        err
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const handleRetentionPolicies = () => {
    window.location.href = "/retention";
  };

  return (
    <Layout>

      {/* Header */}
      <section className="settings-page-header">

        <div>
          <h1>{lt("settings.title")}</h1>

          <p>
            {lt("settings.subtitle")}
          </p>
        </div>

      </section>


      {/* Profile */}
      <section
        className="settings-page-card settings-profile-menu"
        onClick={() => navigate("/profile")}
      >

        <div className="settings-page-card-header">

          <div className="settings-page-card-icon">
            <User size={20} />
          </div>

          <div>
            <h2>{lt("settings.profile.title")}</h2>

            <p>
                {lt("settings.profile.description")}

            </p>
          </div>

        </div>

        <div className="settings-profile-arrow">
          <ChevronRight size={20} />
        </div>

      </section>


      {/* Appearance */}
      <section className="settings-page-card">

        <div className="settings-page-card-header">

          <div className="settings-page-card-icon">
            {theme === "dark" ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </div>

          <div>
            <h2>{lt("settings.appearance.title")}</h2>

            <p>
              {lt("settings.appearance.description")}
            </p>
          </div>

        </div>


        <div className="settings-option-row">

          <div>
            <strong>{lt("settings.appearance.theme")}</strong>

            <span>
             {lt("settings.appearance.themeDescription")}
            </span>
          </div>


          <div className="settings-toggle-group">

            <button
              type="button"
              className={
                theme === "light"
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                handleThemeChange("light")
              }
            >
              <Sun size={15} />
              {lt("settings.appearance.light")}
            </button>


            <button
              type="button"
              className={
                theme === "dark"
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                handleThemeChange("dark")
              }
            >
              <Moon size={15} />
              {lt("settings.appearance.dark")}
            </button>

          </div>

        </div>

      </section>


      {/* Language */}
      <section className="settings-page-card">

        <div className="settings-page-card-header">

          <div className="settings-page-card-icon">
            <Languages size={20} />
          </div>

          <div>
            <h2>{lt("settings.language.title")}</h2>

            <p>
              {lt("settings.language.description")}
            </p>
          </div>

        </div>


        <div className="settings-option-row">

          <div>
            <strong>{lt("settings.language.applicationLanguage")}</strong>

            <span>
              {lt("settings.language.savedAutomatically")}
            </span>
          </div>


          <select
            className="settings-select"
            value={
              language.startsWith("hi")
                ? "hi"
                : "en"
            }
            onChange={(e) =>
              handleLanguageChange(
                e.target.value
              )
            }
          >

            <option value="en">
              English
            </option>

            <option value="hi">
              हिन्दी
            </option>

          </select>

        </div>

      </section>


      {/* Workspace */}
      <section className="settings-page-card">

        <div className="settings-page-card-header">

          <div className="settings-page-card-icon">
            <Briefcase size={20} />
          </div>

          <div>
            <h2>{lt("settings.workspace.title")}</h2>

            <p>
              {lt("settings.workspace.description")}
            </p>
          </div>

        </div>


        <div className="settings-account-grid">

          <div className="settings-info-item">

            <span>{lt("settings.workspace.name")}</span>

            <strong>
              Form Craft
            </strong>

          </div>


          <div className="settings-info-item">

            <span>{lt("settings.workspace.type")}</span>

            <strong>
              Form Management Platform
            </strong>

          </div>

        </div>


        <div className="settings-workspace-description">

          <strong>
            {lt("settings.workspace.tagline")}
          </strong>

          <span>
            {lt("settings.workspace.details")}
          </span>

        </div>

      </section>


      {/* Security */}
      <section className="settings-page-card">

        <div className="settings-page-card-header">

          <div className="settings-page-card-icon">
            <Shield size={20} />
          </div>

          <div>
            <h2>{lt("settings.security.title")}</h2>

            <p>
              {lt("settings.security.description")}

            </p>
          </div>

        </div>


        <div className="settings-option-row">

          <div>
            <strong>{lt("settings.security.password")}</strong>

            <span>
              {lt("settings.security.passwordDescription")}
            </span>
          </div>

          <span className="settings-info-badge">
            {lt("settings.security.protected")}
          </span>

        </div>

      </section>


      {/* Data Management */}
      <section className="settings-page-card">

        <div className="settings-page-card-header">

          <div className="settings-page-card-icon">
            <Database size={20} />
          </div>

          <div>
            <h2>{lt("settings.dataManagement.title")}</h2>

            <p>
                {lt("settings.dataManagement.description")}

            </p>
          </div>

        </div>


        <button
          type="button"
          className="settings-option-row settings-clickable-row"
          onClick={handleRetentionPolicies}
        >

          <div>
            <strong>{lt("settings.dataManagement.retentionPolicies")}</strong>

            <span>
              {lt("settings.dataManagement.retentionDescription")}
            </span>
          </div>


          <div className="settings-row-action">

            <span className="settings-info-badge">
               {lt("settings.dataManagement.formSpecific")}
            </span>

            <ChevronRight size={18} />

          </div>

        </button>

      </section>


      {/* About Form Craft */}
      <section className="settings-page-card">

        <div className="settings-page-card-header">

          <div className="settings-page-card-icon">
            <Info size={20} />
          </div>

          <div>
            <h2>{lt("settings.about.title")}</h2>

            <p>
              {lt("settings.about.description")}
            </p>
          </div>

        </div>


        <div className="settings-account-grid">

          <div className="settings-info-item">

            <span>{lt("settings.about.product")}</span>

            <strong>
              {lt("settings.about.platform")}
            </strong>

          </div>


          <div className="settings-info-item">

            <span>Platform</span>

            <strong>
              Dynamic Form Workflow
            </strong>

          </div>

        </div>


        <div className="settings-workspace-description">

          <span>
           {lt("settings.about.details")}
          </span>

        </div>

      </section>

    </Layout>
  );
}

export default Settings;