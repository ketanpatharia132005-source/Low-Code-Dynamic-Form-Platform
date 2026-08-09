import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  BarChart3,
  GitBranch,
  Edit3,
  ExternalLink,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import api from "../api/api";
import "./FormOverview.css";

function FormOverview() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/forms/")
      .then((res) => {
        if (cancelled) return;

        const foundForm = res.data.find(
          (item) => Number(item.id) === Number(formId)
        );

        if (!foundForm) {
          setError("Form not found.");
          return;
        }

        setForm(foundForm);
      })
      .catch((err) => {
        console.error("Failed to load form", err);

        if (!cancelled) {
          setError("Failed to load form.");
        }
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
        <div className="form-overview-page">
          <div className="overview-loading">
            Loading form...
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !form) {
    return (
      <Layout>
        <div className="form-overview-page">
          <div className="overview-error">
            <h2>Unable to load form</h2>
            <p>{error || "Form not found."}</p>

            <button
              className="overview-primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Forms
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="form-overview-page">

        {/* =========================
            Breadcrumb
            ========================= */}

        <div className="overview-breadcrumb">
          <button
            onClick={() => navigate("/dashboard")}
          >
            Forms
          </button>

          <span>›</span>

          <span>{form.title}</span>

          <span>›</span>

          <strong>Overview</strong>
        </div>


        {/* =========================
            Header
            ========================= */}

        <section className="overview-header">

          <div className="overview-header-left">

            <div className="overview-form-icon">
              <FileText size={26} />
            </div>

            <div>
              <div className="overview-title-row">

                <h1>{form.title}</h1>

                <span
                  className={`overview-status ${form.status}`}
                >
                  {form.status}
                </span>

              </div>

              <p>
                {form.description ||
                  "Manage and monitor this form."}
              </p>

              <span className="overview-form-id">
                Form #{form.id}
              </span>
            </div>

          </div>


          <button
            className="overview-edit-btn"
            onClick={() =>
              navigate(`/builder/${form.id}`)
            }
          >
            <Edit3 size={16} />
            Edit Form
          </button>

        </section>


        {/* =========================
            Quick Stats
            ========================= */}

       <section className="overview-stats">

  {/* Responses */}

  <button
    className="overview-stat-card"
    onClick={() =>
      navigate(`/responses/${form.id}`)
    }
  >

    <div className="overview-stat-icon blue">
      <MessageSquare size={20} />
    </div>

    <div>
      <span>Responses</span>
      <strong>View Responses</strong>
    </div>

  </button>


  {/* Analytics */}

  <button
    className="overview-stat-card"
    onClick={() =>
     navigate(`/analytics/${form.id}`) 
    }
  >

    <div className="overview-stat-icon purple">
      <BarChart3 size={20} />
    </div>

    <div>
      <span>Analytics</span>
      <strong>View Analytics</strong>
    </div>

  </button>


  {/* Conditional Logic */}

  <button
    className="overview-stat-card"
    onClick={() =>
      navigate(`/builder/${form.id}`)
    }
  >

    <div className="overview-stat-icon green">
      <GitBranch size={20} />
    </div>

    <div>
      <span>Conditional Logic</span>
      <strong>Manage Rules</strong>
    </div>

  </button>

</section>

        {/* =========================
            Form Information
            ========================= */}

        <section className="overview-section">

          <div className="overview-section-header">
            <div>
              <h2>Form Information</h2>
              <p>
                Basic information about this form.
              </p>
            </div>
          </div>


          <div className="overview-info-card">

            <div className="overview-info-row">
              <span>Form Name</span>
              <strong>{form.title}</strong>
            </div>

            <div className="overview-info-row">
              <span>Status</span>

              <span
                className={`overview-status ${form.status}`}
              >
                {form.status}
              </span>
            </div>

            <div className="overview-info-row">
              <span>Form ID</span>
              <strong>#{form.id}</strong>
            </div>

            <div className="overview-info-row">
              <span>Description</span>
              <strong>
                {form.description || "No description"}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            Bottom Navigation
            ========================= */}

        <div className="overview-bottom-actions">

          <button
            onClick={() =>
              navigate(`/builder/${form.id}`)
            }
          >
            <Edit3 size={16} />
            Open Builder
          </button>

          <button
            onClick={() =>
              navigate(`/responses/${form.id}`)
            }
          >
            <MessageSquare size={16} />
            View Responses
          </button>

          <button
            onClick={() =>
              navigate(`/analytics/${form.id}`)
            }
          >
            <ExternalLink size={16} />
            Analytics
          </button>

        </div>

      </div>
    </Layout>
  );
}

export default FormOverview;