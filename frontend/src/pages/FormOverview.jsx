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
import { useTranslation } from "react-i18next";

function FormOverview() {
  const { t } = useTranslation();
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
          setError(t("formOverview.notFound"));
          return;
        }

        setForm(foundForm);
      })
      .catch((err) => {
        console.error("Failed to load form", err);

        if (!cancelled) {
          setError(t("formOverview.loadFailed"));
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
            {t("formOverview.loading")}
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
            <h2>{t("formOverview.unableToLoad")}</h2>
            <p>{error || t("formOverview.notFound")}</p>

            <button
              className="overview-primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              {t("formOverview.backToForms")}
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
            {t("formOverview.forms")}
          </button>

          <span>›</span>

          <span>{form.title}</span>

          <span>›</span>

          <strong>{t("formOverview.overview")}</strong>
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
                  {t(`formOverview.statusValues.${form.status}`, form.status)}
                </span>

              </div>

              <p>
                {form.description ||
                  t("formOverview.manageMonitor")}
              </p>

              <span className="overview-form-id">
                {t("formOverview.formId", { id: form.id })}
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
           {t("formOverview.editForm")}
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
      <span>{t("formOverview.responses")}</span>
      <strong>{t("formOverview.viewResponses")}</strong>
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
      <span>{t("formOverview.analytics")}</span>
      <strong>{t("formOverview.viewAnalytics")}</strong>
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
      <span>{t("formOverview.conditionalLogic")}</span>
      <strong>{t("formOverview.manageRules")}</strong>
    </div>

  </button>

</section>

        {/* =========================
            Form Information
            ========================= */}

        <section className="overview-section">

          <div className="overview-section-header">
            <div>
              <h2>{t("formOverview.formInformation")}</h2>
              <p>
                {t("formOverview.basicInformation")}

              </p>
            </div>
          </div>


          <div className="overview-info-card">

            <div className="overview-info-row">
              <span>{t("formOverview.formName")}</span>
              <strong>{form.title}</strong>
            </div>

            <div className="overview-info-row">
              <span>{t("formOverview.status")}</span>

              <span
                className={`overview-status ${form.status}`}
              >
                {t(`formOverview.statusValues.${form.status}`, form.status)}
              </span>
            </div>

            <div className="overview-info-row">
              <span>{t("formOverview.formIdLabel")}</span>
              <strong>#{form.id}</strong>
            </div>

            <div className="overview-info-row">
              <span>{t("formOverview.description")}</span>
              <strong>
                {form.description || t("formOverview.noDescription")}
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
            {t("formOverview.openBuilder")}
          </button>

          <button
            onClick={() =>
              navigate(`/responses/${form.id}`)
            }
          >
            <MessageSquare size={16} />
            {t("formOverview.viewResponses")}
          </button>

          <button
            onClick={() =>
              navigate(`/analytics/${form.id}`)
            }
          >
            <ExternalLink size={16} />
            {t("formOverview.analytics")}
          </button>

        </div>

      </div>
    </Layout>
  );
}

export default FormOverview;