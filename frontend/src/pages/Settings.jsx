import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  User,
  Shield,
  Database,
  Sun,
  Moon,
  Languages,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import api from "../api/api";
import "./Settings.css";

function Settings() {
  const { i18n } = useTranslation();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("i18nextLng") || i18n.language || "en"
  );

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

  return (
    <Layout>
      <div className="dashboard-container">

        {/* Header */}

        <section className="settings-page-header">

          <div>
            <h1>Settings</h1>

            <p>
              Manage your account, appearance,
              language and workspace preferences.
            </p>
          </div>

        </section>


        {/* Account */}

        <section className="settings-page-card">

          <div className="settings-page-card-header">

            <div className="settings-page-card-icon">
              <User size={20} />
            </div>

            <div>
              <h2>Account</h2>

              <p>
                Your current account information.
              </p>
            </div>

          </div>


          {loadingProfile ? (

            <div className="settings-loading">
              Loading account information...
            </div>

          ) : profile ? (

            <div className="settings-account-grid">

              <div className="settings-info-item">

                <span>Username</span>

                <strong>
                  {profile.username}
                </strong>

              </div>


              <div className="settings-info-item">

                <span>Email</span>

                <strong>
                  {profile.email}
                </strong>

              </div>

            </div>

          ) : (

            <div className="settings-loading">
              Unable to load account information.
            </div>

          )}

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
              <h2>Appearance</h2>

              <p>
                Choose how the application looks.
              </p>
            </div>

          </div>


          <div className="settings-option-row">

            <div>
              <strong>Theme</strong>

              <span>
                Select your preferred appearance.
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
                Light
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
                Dark
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
              <h2>Language</h2>

              <p>
                Choose the language used throughout
                the application.
              </p>
            </div>

          </div>


          <div className="settings-option-row">

            <div>
              <strong>Application Language</strong>

              <span>
                Your selected language is saved
                automatically.
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


        {/* Security */}

        <section className="settings-page-card">

          <div className="settings-page-card-header">

            <div className="settings-page-card-icon">
              <Shield size={20} />
            </div>

            <div>
              <h2>Security</h2>

              <p>
                Manage your account security.
              </p>
            </div>

          </div>


          <div className="settings-option-row">

            <div>
              <strong>Password</strong>

              <span>
                Password management will be
                available here.
              </span>
            </div>

            <button
              type="button"
              className="settings-disabled-btn"
              disabled
            >
              Change Password
            </button>

          </div>

        </section>


        {/* Data Management */}

        <section className="settings-page-card">

          <div className="settings-page-card-header">

            <div className="settings-page-card-icon">
              <Database size={20} />
            </div>

            <div>
              <h2>Data Management</h2>

              <p>
                Manage data retention and deletion
                policies for your forms.
              </p>
            </div>

          </div>


          <div className="settings-option-row">

            <div>
              <strong>Retention Policies</strong>

              <span>
                Configure retention settings
                for individual forms.
              </span>
            </div>

            <span className="settings-info-badge">
              Form specific
            </span>

          </div>

        </section>

      </div>
    </Layout>
  );
}

export default Settings;