import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api, { getFormAnalytics } from "../api/api";
import "./Dashboard.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

import {
  FileText,
  CheckCircle,
  ClipboardList,
  BarChart3,
} from "lucide-react";

function CustomXAxisTick({ x, y, payload }) {
  const text = String(payload.value || "");

  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (testLine.length > 9) {
      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return (
    <g transform={`translate(${x},${y + 12})`}>
      <text
        textAnchor="middle"
        fill="#334155"
        fontSize={10}
        fontWeight={600}
      >
        {lines.map((line, index) => (
          <tspan
            key={index}
            x="0"
            dy={index === 0 ? 0 : 15}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}


function Analytics() {

  const { formId } = useParams();

  
  const [stats, setStats] = useState({
    total_forms: 0,
    published_forms: 0,
    total_responses: 0,
    completion_rate: 0,
  });

  // NEW STATES
  const [details, setDetails] = useState(null);

  const [selectedFormId, setSelectedFormId] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  const [formAnalytics, setFormAnalytics] = useState({
    total_submissions: 0,
    completed_forms: 0,
    incomplete_forms: 0,
    completion_rate: 0,
    average_completion_time: 0,
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
  let cancelled = false;

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      /* ==========================================
         FORM-SPECIFIC ANALYTICS
         /analytics/:formId
         ========================================== */

      if (formId) {

        const [formsResponse, analyticsResponse] =
          await Promise.all([
            api.get("/forms/"),
            getFormAnalytics(Number(formId)),
          ]);

        if (cancelled) return;

        const foundForm = formsResponse.data.find(
          (form) => Number(form.id) === Number(formId)
        );

        setSelectedForm(foundForm || null);

        setSelectedFormId(Number(formId));

        setFormAnalytics(analyticsResponse.data);

        setLoading(false);

        return;
      }


      /* ==========================================
         GLOBAL ANALYTICS
         /analytics
         ========================================== */

      const [statsResponse, detailsResponse] =
        await Promise.all([
          api.get("/forms/dashboard/stats"),
          api.get("/forms/analytics/details"),
        ]);

      if (cancelled) return;

      setStats(statsResponse.data);

      setDetails(detailsResponse.data);

      setLoading(false);

    } catch (err) {

      console.error(
        "Failed to load analytics",
        err
      );

      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadAnalytics();

  return () => {
    cancelled = true;
  };

}, [formId]);
  const openCard = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };
  const closeAnalyticsModal = () => {
    setShowAnalyticsModal(false);
    setSelectedFormId(null);
  };

  const loadFormAnalytics = async (formId) => {
  try {
    

    const res = await getFormAnalytics(formId);

    setSelectedFormId(formId);
    setFormAnalytics(res.data);

    setShowAnalyticsModal(true);
  } catch (err) {
    console.error("Failed to load analytics",err);
  }
};

  const filteredForms =
  details?.all_forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const chartData =
  details?.responses.map((item) => ({
    name: item.title,
      
    responses: item.responses,
  })) || [];

  const uniqueFieldDistributions = (() => {
  const fields = formAnalytics.field_distributions || [];
  const fieldMap = new Map();

  fields.forEach((field) => {
    const existing = fieldMap.get(field.field_id);

    const currentHasData =
      Array.isArray(field.distribution) &&
      field.distribution.some(
        (item) => Number(item.count) > 0
      );

    const existingHasData =
      existing &&
      Array.isArray(existing.distribution) &&
      existing.distribution.some(
        (item) => Number(item.count) > 0
      );

    if (!existing || (currentHasData && !existingHasData)) {
      fieldMap.set(field.field_id, field);
    }
  });

  return Array.from(fieldMap.values());
})();
  const fieldDistributions = (() => {
  const distributions = formAnalytics.field_distributions || [];
  const fieldMap = new Map();

  distributions.forEach((field) => {
    const existing = fieldMap.get(field.field_id);

    const currentHasData =
      Array.isArray(field.distribution) &&
      field.distribution.some((item) => Number(item.count) > 0);

    const existingHasData =
      existing &&
      Array.isArray(existing.distribution) &&
      existing.distribution.some((item) => Number(item.count) > 0);

    if (!existing || (currentHasData && !existingHasData)) {
      fieldMap.set(field.field_id, field);
    }
  });

  return Array.from(fieldMap.values());
})();

 return (
  <Layout>
    <div className="dashboard-container">

      <section className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p>View insights and statistics for your forms.</p>
        </div>
      </section>

      {loading ? (
        <div className="empty-state">
          Loading analytics...
        </div>
      ) : formId ? (
        <>
          {/* =========================
              FORM-SPECIFIC ANALYTICS
              ========================= */}

          <section className="form-analytics-header">

            <div>
              <div className="analytics-breadcrumb">

                <button
                  onClick={() => navigate("/analytics")}
                >
                  Analytics
                </button>

                <span>›</span>

                <strong>
                  {selectedForm?.title || `Form #${formId}`}
                </strong>

              </div>

              <h2>
                {selectedForm?.title || `Form #${formId}`}
              </h2>

              <p>
                Analytics and performance for this form only.
              </p>
            </div>

            <button
              className="analytics-back-btn"
              onClick={() => navigate("/analytics")}
            >
              ← All Analytics
            </button>

          </section>

          {/* =========================
              FORM METRICS
              ========================= */}

          <section className="metrics-grid analytics-metrics">

            <div className="metric-card">

              <div className="metric-icon blue">
                <ClipboardList size={22} />
              </div>

              <div>
                <span>Total Submissions</span>

                <h2>
                  {formAnalytics.total_submissions}
                </h2>
              </div>

            </div>

            <div className="metric-card">

              <div className="metric-icon green">
                <CheckCircle size={22} />
              </div>

              <div>
                <span>Completed Forms</span>

                <h2>
                  {formAnalytics.completed_forms}
                </h2>
              </div>

            </div>

            <div className="metric-card">

              <div className="metric-icon orange">
                <FileText size={22} />
              </div>

              <div>
                <span>Incomplete Forms</span>

                <h2>
                  {formAnalytics.incomplete_forms}
                </h2>
              </div>

            </div>

            <div className="metric-card">

              <div className="metric-icon purple">
                <BarChart3 size={22} />
              </div>

              <div>
                <span>Completion Rate</span>

                <h2>
                  {formAnalytics.completion_rate}%
                </h2>
              </div>

            </div>

          </section>

          {/* =========================
              AVERAGE COMPLETION TIME
              ========================= */}

          <section className="chart-section">

            <div className="chart-card">

              <h2>Average Completion Time</h2>

              <div className="form-analytics-time">

                <strong>
                  {formAnalytics.average_completion_time}
                </strong>

                <span>seconds</span>

              </div>

            </div>

          </section>

          {/* =========================
              PER-FIELD ANALYTICS
              ========================= */}

          <section className="form-field-analytics">

            <div className="form-field-analytics-header">

              <div>
                <h2>Per-Field Distribution</h2>

                <p>
                  See how respondents answered each field in this form.
                </p>
              </div>

            </div>

            {formAnalytics.field_distributions?.length > 0 ? (

              <div className="form-field-analytics-grid">

                {uniqueFieldDistributions.map((field) => (

                  <div
                    key={field.field_id}
                    className="form-field-chart-card"
                  >

                    <div className="form-field-chart-header">

                      <div>

                        <h3>
                          {field.field_label}
                        </h3>

                        <span>
                          {field.field_type}
                        </span>

                      </div>

                    </div>

                    {field.field_type === "dropdown" ? (

                      <ResponsiveContainer
                        width="100%"
                        height={280}
                      >

                        <PieChart>

                          <Pie
                            data={field.distribution}
                            dataKey="count"
                            nameKey="label"
                            outerRadius={90}
                            label
                          >

                            {field.distribution.map(
                              (entry, index) => (

                                <Cell
                                  key={index}
                                  fill={
                                    COLORS[
                                      index % COLORS.length
                                    ]
                                  }
                                />

                              )
                            )}

                          </Pie>

                          <Tooltip />

                          <Legend />

                        </PieChart>

                      </ResponsiveContainer>

                    ) : (

                      <ResponsiveContainer
                        width="100%"
                        height={280}
                      >

                        <BarChart
                          data={field.distribution}
                        >

                          <CartesianGrid
                            strokeDasharray="3 3"
                          />

                          <XAxis
                            dataKey="label"
                          />

                          <YAxis
                            allowDecimals={false}
                          />

                          <Tooltip />

                          <Bar
                            dataKey="count"
                            fill="#3b82f6"
                            radius={[6, 6, 0, 0]}
                          />

                        </BarChart>

                      </ResponsiveContainer>

                    )}

                  </div>

                ))}

              </div>

            ) : (

              <div className="empty-state">
                No field distribution data available.
              </div>

            )}

          </section>

        </>

      ) : (

        <>
          {/* =========================
              GLOBAL METRICS
              ========================= */}

          <section className="metrics-grid analytics-metrics">

            <div
              className="metric-card clickable"
              onClick={() => openCard("responses")}
            >

              <div className="metric-icon blue">
                <ClipboardList size={22} />
              </div>

              <div>
                <span>Total Submissions</span>

                <h2>
                  {stats.total_responses}
                </h2>
              </div>

            </div>

            <div
              className="metric-card clickable"
              onClick={() => openCard("completion")}
            >

              <div className="metric-icon purple">
                <BarChart3 size={22} />
              </div>

              <div>
                <span>Completion Rate</span>

                <h2>
                  {stats.completion_rate}%
                </h2>
              </div>

            </div>

            <div
              className="metric-card clickable"
              onClick={() => openCard("published")}
            >

              <div className="metric-icon green">
                <CheckCircle size={22} />
              </div>

              <div>
                <span>Published Forms</span>

                <h2>
                  {stats.published_forms}
                </h2>
              </div>

            </div>

            <div
              className="metric-card clickable"
              onClick={() => openCard("forms")}
            >

              <div className="metric-icon orange">
                <FileText size={22} />
              </div>

              <div>
                <span>Total Forms</span>

                <h2>
                  {stats.total_forms}
                </h2>
              </div>

            </div>

          </section>

          {/* =========================
              FORM ANALYTICS TABLE
              ========================= */}

          <section className="analytics-forms-section">

            <div className="analytics-section-header">

              <div>

                <h2>Form Analytics</h2>

                <p>
                  View responses and analytics for each form.
                </p>

              </div>

              <span className="analytics-form-count">
                {filteredForms.length} Forms
              </span>

            </div>

            <div className="analytics-forms-table">

              <table>

                <thead>

                  <tr>
                    <th>Form</th>
                    <th>Status</th>
                    <th>Responses</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredForms.map((form) => (

                    <tr key={form.id}>

                      <td>

                        <div className="analytics-form-name">

                          <strong>
                            {form.title}
                          </strong>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`status-badge ${form.status}`}
                        >
                          {form.status}
                        </span>

                      </td>

                      <td>
                        <strong>
                          {form.responses}
                        </strong>
                      </td>

                      <td>

                        <div className="analytics-actions">

                          <button
                            className="view-btn"
                            onClick={() =>
                              navigate(`/responses/${form.id}`)
                            }
                          >
                            Responses
                          </button>

                          <button
                            className="view-btn analytics-btn"
                            onClick={() =>
                              navigate(`/analytics/${form.id}`)
                            }
                          >
                            View Analytics
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>

          {/* =========================
              RESPONSES BY FORM
              ========================= */}

          <section className="chart-section responses-by-form-section">

            <div className="chart-card responses-by-form-card">

              <div className="responses-chart-header">

                <div>

                  <h2>Responses by Form</h2>

                  <p>
                    Overview of total responses collected for each form.
                  </p>

                </div>

              </div>

              <div className="responses-chart-wrapper">

                <div className="reponses-chart-inner">

                  <ResponsiveContainer
                    width="100%"
                    height={500}
                  >

                    <BarChart
                      data={chartData}
                      margin={{
                        top: 35,
                        right: 30,
                        left: 10,
                        bottom: 140,
                      }}
                      barCategoryGap="25%"
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        interval={0}
                        height={90}
                        tick={<CustomXAxisTick />}
                        tickLine={false}
                        axisLine={{
                          stroke: "#cbd5e1",
                        }}
                      />

                      <YAxis
                        allowDecimals={false}
                        axisLine={{
                          stroke: "#cbd5e1",
                        }}
                        tickLine={false}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="responses"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={42}
                        label={{
                          position: "top",
                          fill: "#2563eb",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

              <div className="responses-chart-note">
                This chart shows the total number of responses received
                for each form.
              </div>

            </div>

          </section>

        </>

      )}

    </div>

    {/* =========================
        GLOBAL ANALYTICS MODAL
        ========================= */}

    {showModal && (

      <div
        className="analytics-modal-overlay"
        onClick={closeModal}
      >

        <div
          className="analytics-modal"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="analytics-modal-header">

            <h2>
              {selectedCard === "forms" && "All Forms"}
              {selectedCard === "published" && "Published Forms"}
              {selectedCard === "responses" && "Response Summary"}
              {selectedCard === "completion" && "Completion Details"}
            </h2>

            <button
              className="analytics-close-btn"
              onClick={closeModal}
            >
              ✕
            </button>

          </div>

          <div className="analytics-modal-body">

            {/* ---------------- ALL FORMS ---------------- */}

            {selectedCard === "forms" && (

              <>

                <div className="analytics-search">

                  <input
                    type="text"
                    placeholder="🔍 Search forms.."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                  />

                </div>

                <table className="analytics-table">

                  <thead>

                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Responses</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredForms.map((form) => (

                      <tr key={form.id}>

                        <td>
                          {form.title}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${form.status}`}
                          >
                            {form.status}
                          </span>

                        </td>

                        <td>
                          {form.responses}
                        </td>

                        <td>

                          <div className="analytics-actions">

                            <button
                              className="view-btn"
                              onClick={() =>
                                navigate(`/responses/${form.id}`)
                              }
                            >
                              Responses
                            </button>

                            <button
                              className="view-btn analytics-btn"
                              onClick={() =>
                                loadFormAnalytics(form.id)
                              }
                            >
                              Analytics
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

                {selectedFormId && (

                  <div className="analytics-summary-card">

                    <h3>
                      Form Analytics
                    </h3>

                    <div className="analytics-summary-grid">

                      <div>
                        <strong>
                          Total Submissions
                        </strong>

                        <p>
                          {formAnalytics.total_submissions}
                        </p>
                      </div>

                      <div>
                        <strong>
                          Completed Forms
                        </strong>

                        <p>
                          {formAnalytics.completed_forms}
                        </p>
                      </div>

                      <div>
                        <strong>
                          Incomplete Forms
                        </strong>

                        <p>
                          {formAnalytics.incomplete_forms}
                        </p>
                      </div>

                      <div>
                        <strong>
                          Completion Rate
                        </strong>

                        <p>
                          {formAnalytics.completion_rate}%
                        </p>
                      </div>

                      <div>
                        <strong>
                          Average Completion Time
                        </strong>

                        <p>
                          {formAnalytics.average_completion_time} sec
                        </p>
                      </div>

                    </div>

                  </div>

                )}

              </>

            )}

            {/* ---------------- PUBLISHED ---------------- */}

            {selectedCard === "published" && (

              <table className="analytics-table">

                <thead>

                  <tr>
                    <th>Title</th>
                    <th>Responses</th>
                  </tr>

                </thead>

                <tbody>

                  {details?.published_forms.map((form) => (

                    <tr key={form.id}>

                      <td>
                        {form.title}
                      </td>

                      <td>
                        {form.responses}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

            {/* ---------------- RESPONSES ---------------- */}

            {selectedCard === "responses" && (

              <table className="analytics-table">

                <thead>

                  <tr>
                    <th>Form</th>
                    <th>Total Responses</th>
                  </tr>

                </thead>

                <tbody>

                  {details?.responses.map((item) => (

                    <tr key={item.id}>

                      <td>
                        {item.title}
                      </td>

                      <td>
                        {item.responses}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

            {/* ---------------- COMPLETION ---------------- */}

            {selectedCard === "completion" && (

              <div className="completion-details">

                <div className="completion-item">

                  <span>
                    Total Forms
                  </span>

                  <strong>
                    {details?.completion.total_forms}
                  </strong>

                </div>

                <div className="completion-item">

                  <span>
                    Published
                  </span>

                  <strong>
                    {details?.completion.published_forms}
                  </strong>

                </div>

                <div className="completion-item">

                  <span>
                    Draft
                  </span>

                  <strong>
                    {details?.completion.draft_forms}
                  </strong>

                </div>

                <div className="completion-item">

                  <span>
                    Archived
                  </span>

                  <strong>
                    {details?.completion.archived_forms}
                  </strong>

                </div>

                <div className="completion-progress">

                  <div
                    className="completion-progress-fill"
                    style={{
                      width: `${details?.completion.completion_rate}%`,
                    }}
                  />

                </div>

                <h2>
                  {details?.completion.completion_rate}%
                </h2>

              </div>

            )}

          </div>

        </div>

      </div>

    )}

    {/* =========================
        FORM ANALYTICS MODAL
        ========================= */}

    {showAnalyticsModal && (

      <div
        className="analytics-modal-overlay"
        onClick={closeAnalyticsModal}
      >

        <div
          className="analytics-modal"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="analytics-modal-header">

            <h2>
              Form Analytics
            </h2>

            <button
              className="analytics-close-btn"
              onClick={closeAnalyticsModal}
            >
              X
            </button>

          </div>

          <div className="analytics-summary-grid">

            <div className="metric-card">

              <span>
                Total Submissions
              </span>

              <h2>
                {formAnalytics.total_submissions}
              </h2>

            </div>

            <div className="metric-card">

              <span>
                Completed Forms
              </span>

              <h2>
                {formAnalytics.completed_forms}
              </h2>

            </div>

            <div className="metric-card">

              <span>
                Incomplete Forms
              </span>

              <h2>
                {formAnalytics.incomplete_forms}
              </h2>

            </div>

            <div className="metric-card">

              <span>
                Completion Rate
              </span>

              <h2>
                {formAnalytics.completion_rate}
              </h2>

            </div>

            <div className="metric-card">

              <span>
                Average Complete Time
              </span>

              <h2>
                {formAnalytics.average_completion_time} sec
              </h2>

            </div>

          </div>

          {/* ============================
              FIELD DISTRIBUTION CHARTS
              ============================= */}

          {formAnalytics.field_distributions?.map((field) => (

            <div
              key={field.field_id}
              className="chart-card"
              style={{
                marginTop: "30px",
              }}
            >

              <h3>
                {field.field_label}
              </h3>

              {Array.isArray(field.distribution) &&
              field.distribution.some(
                (item) => Number(item.count) > 0
              ) ? (

                field.field_type === "dropdown" ? (

                  <ResponsiveContainer
                    width="100%"
                    height={320}
                  >

                    <PieChart>

                      <Pie
                        data={field.distribution}
                        dataKey="count"
                        nameKey="label"
                        outerRadius={100}
                        label
                      >

                        {field.distribution.map(
                          (entry, index) => (

                            <Cell
                              key={index}
                              fill={
                                COLORS[
                                  index % COLORS.length
                                ]
                              }
                            />

                          )
                        )}

                      </Pie>

                      <Tooltip />

                      <Legend />

                    </PieChart>

                  </ResponsiveContainer>

                ) : (

                  <ResponsiveContainer
                    width="100%"
                    height={320}
                  >

                  <BarChart
                    data={field.distribution}
                  >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="label"
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            )

          ) : (

            <div className="empty-state">
              No responses yet for this field.
            </div> 

          )}
        </div>
      ))}
      </div>
      </div>
    )}
    </Layout>
 );
}
export default Analytics;

