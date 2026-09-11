import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Settings,
  FileText,
  Clock3,
  Archive,
  ArrowLeft,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import api from "../api/api";
import "./FormSettings.css";

function FormSettings() {
  const { t } = useTranslation();

  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/forms/${formId}`)
      .then((res) => {
        if (!cancelled) {
          setForm(res.data);
        }
      })
      .catch((err) => {
        console.error(
          "Failed to load form settings",
          err
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formId]);

  if (loading) {
    return (
      <Layout>
        <div className="form-settings-page">
          <div className="settings-loading">
            {t("formSettings.loading")}
          </div>
        </div>
      </Layout>
    );
  }

  if (!form) {
    return (
      <Layout>
        <div className="form-settings-page">
          <div className="settings-error">
            <h2>
              {t("formSettings.unableToLoad")}
            </h2>

            <button
              onClick={() =>
                navigate(
                  `/forms/${formId}/overview`
                )
              }
            >
              {t("formSettings.backToOverview")}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="form-settings-page">

        {/* Breadcrumb */}

        <div className="settings-breadcrumb">
          <button
            onClick={() =>
              navigate(
                `/forms/${formId}/overview`
              )
            }
          >
            {t("formSettings.forms")}
          </button>

          <span>›</span>

          {/* User-created form title — DO NOT translate */}
          <span>{form.title}</span>

          <span>›</span>

          <strong>
            {t("formSettings.settings")}
          </strong>
        </div>


        {/* Header */}

        <section className="settings-header">

          <div className="settings-title-area">

            <div className="settings-icon">
              <Settings size={24} />
            </div>

            <div>
              <h1>
                {t("formSettings.title")}
              </h1>

              <p>
                {t("formSettings.manageSettings")}{" "}
                <strong>{form.title}</strong>
              </p>
            </div>

          </div>


          <button
            className="settings-back-btn"
            onClick={() =>
              navigate(
                `/forms/${formId}/overview`
              )
            }
          >
            <ArrowLeft size={16} />

            {t("formSettings.backToOverview")}
          </button>

        </section>


        {/* Form Details */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <FileText size={20} />
            </div>

            <div>
              <h2>
                {t("formSettings.formDetails")}
              </h2>

              <p>
                {t(
                  "formSettings.formDetailsDescription"
                )}
              </p>
            </div>

          </div>


          <div className="settings-info-grid">

            <div className="settings-info-item">
              <span>
                {t("formSettings.formName")}
              </span>

              {/* User-created form title */}
              <strong>{form.title}</strong>
            </div>


            <div className="settings-info-item">
              <span>
                {t("formSettings.formId")}
              </span>

              <strong>#{form.id}</strong>
            </div>


            <div className="settings-info-item">
              <span>
                {t("formSettings.status")}
              </span>

              <span
                className={`settings-status ${form.status}`}
              >
                {t(
                  `formSettings.statusValues.${form.status}`,
                  {
                    defaultValue:
                      form.status,
                  }
                )}
              </span>
            </div>


            <div className="settings-info-item">
              <span>
                {t("formSettings.version")}
              </span>

              <strong>
                {form.version || 1}
              </strong>
            </div>

          </div>

        </section>


        {/* Retention */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <h2>
                {t("formSettings.dataRetention")}
              </h2>

              <p>
                {t(
                  "formSettings.dataRetentionDescription"
                )}
              </p>
            </div>

          </div>


          <div className="settings-action-row">

            <div>
              <strong>
                {t(
                  "formSettings.retentionPolicy"
                )}
              </strong>

              <span>
                {t(
                  "formSettings.retentionPolicyDescription"
                )}
              </span>
            </div>

            <button
              onClick={() =>
                navigate(
                  `/forms/${formId}/retention`
                )
              }
            >
              {t(
                "formSettings.managePolicy"
              )}
            </button>

          </div>

        </section>


        {/* Danger Zone */}

        <section className="settings-card danger-card">

          <div className="settings-card-header">

            <div className="settings-card-icon danger">
              <Archive size={20} />
            </div>

            <div>
              <h2>
                {t("formSettings.dangerZone")}
              </h2>

              <p>
                {t(
                  "formSettings.dangerZoneDescription"
                )}
              </p>
            </div>

          </div>


          <div className="settings-action-row">

            <div>
              <strong>
                {t(
                  "formSettings.archiveForm"
                )}
              </strong>

              <span>
                {t(
                  "formSettings.archiveFormDescription"
                )}
              </span>
            </div>

            <button
              className="danger-action"
              onClick={() =>
                navigate(
                  `/builder/${formId}`
                )
              }
            >
              {t(
                "formSettings.openBuilder"
              )}
            </button>

          </div>

        </section>

      </div>
    </Layout>
  );
}

export default FormSettings;