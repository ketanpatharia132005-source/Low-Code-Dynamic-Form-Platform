import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
        console.error("Failed to load form settings", err);
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
            Loading settings...
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
            <h2>Unable to load form</h2>

            <button
              onClick={() =>
                navigate(`/forms/${formId}/overview`)
              }
            >
              Back to Overview
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
              navigate(`/forms/${formId}/overview`)
            }
          >
            Forms
          </button>

          <span>›</span>

          <span>{form.title}</span>

          <span>›</span>

          <strong>Settings</strong>
        </div>


        {/* Header */}

        <section className="settings-header">

          <div className="settings-title-area">

            <div className="settings-icon">
              <Settings size={24} />
            </div>

            <div>
              <h1>Form Settings</h1>

              <p>
                Manage settings for{" "}
                <strong>{form.title}</strong>
              </p>
            </div>

          </div>


          <button
            className="settings-back-btn"
            onClick={() =>
              navigate(`/forms/${formId}/overview`)
            }
          >
            <ArrowLeft size={16} />
            Back to Overview
          </button>

        </section>


        {/* Form Details */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <FileText size={20} />
            </div>

            <div>
              <h2>Form Details</h2>

              <p>
                Basic information about this form.
              </p>
            </div>

          </div>


          <div className="settings-info-grid">

            <div className="settings-info-item">
              <span>Form Name</span>
              <strong>{form.title}</strong>
            </div>

            <div className="settings-info-item">
              <span>Form ID</span>
              <strong>#{form.id}</strong>
            </div>

            <div className="settings-info-item">
              <span>Status</span>

              <span
                className={`settings-status ${form.status}`}
              >
                {form.status}
              </span>
            </div>

            <div className="settings-info-item">
              <span>Version</span>
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
              <h2>Data Retention</h2>

              <p>
                Manage how long submitted responses
                are retained.
              </p>
            </div>

          </div>


          <div className="settings-action-row">

            <div>
              <strong>
                Retention Policy
              </strong>

              <span>
                Configure retention and deletion
                settings for this form.
              </span>
            </div>

            <button
              onClick={() =>
                navigate(
                  `/forms/${formId}/retention`
                )
              }
            >
              Manage Policy
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
              <h2>Danger Zone</h2>

              <p>
                Actions that can affect the availability
                of this form.
              </p>
            </div>

          </div>


          <div className="settings-action-row">

            <div>
              <strong>
                Archive Form
              </strong>

              <span>
                Archived forms cannot be edited or
                filled.
              </span>
            </div>

            <button
              className="danger-action"
              onClick={() =>
                navigate(`/builder/${formId}`)
              }
            >
              Open Builder
            </button>

          </div>

        </section>

      </div>
    </Layout>
  );
}

export default FormSettings;