import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../api/api";
import "./Dashboard.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  FileText,
  CheckCircle,
  ClipboardList,
  BarChart3,
} from "lucide-react";


function Analytics() {

  
  const [stats, setStats] = useState({
    total_forms: 0,
    published_forms: 0,
    total_responses: 0,
    completion_rate: 0,
  });

  // NEW STATES
  const [details, setDetails] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;

    // Dashboard summary stats
    api
      .get("/forms/dashboard/stats")
      .then((res) => {
        if (!cancelled) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load analytics", err);
      });

    // Detailed analytics
    api
      .get("/forms/analytics/details")
      .then((res) => {
        if (!cancelled) {
          setDetails(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load analytics details", err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openCard = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const filteredForms =
  details?.all_forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const chartData =
  details?.responses.map((item) => ({
    name:
      item.title.length > 18
        ? item.title.substring(0, 18) + "..."
        : item.title,
    responses: item.responses,
  })) || [];

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
        ) : (
            <>
          <section className="metrics-grid">

            {/* Total Forms */}
            <div
              className="metric-card clickable"
              onClick={() => openCard("forms")}
            >
              <div className="metric-icon orange">
                <FileText size={22} />
              </div>

              <div>
                <span>Total Forms</span>
                <h2>{stats.total_forms}</h2>
              </div>
            </div>

            {/* Published Forms */}
            <div
              className="metric-card clickable"
              onClick={() => openCard("published")}
            >
              <div className="metric-icon green">
                <CheckCircle size={22} />
              </div>

              <div>
                <span>Published Forms</span>
                <h2>{stats.published_forms}</h2>
              </div>
            </div>

            {/* Total Responses */}
            <div
              className="metric-card clickable"
              onClick={() => openCard("responses")}
            >
              <div className="metric-icon blue">
                <ClipboardList size={22} />
              </div>

              <div>
                <span>Total Responses</span>
                <h2>{stats.total_responses}</h2>
              </div>
            </div>

            {/* Completion Rate */}
            <div
              className="metric-card clickable"
              onClick={() => openCard("completion")}
            >
              <div className="metric-icon purple">
                <BarChart3 size={22} />
              </div>

              <div>
                <span>Completion Rate</span>
                <h2>{stats.completion_rate}%</h2>
              </div>
            </div>

          </section>

          <section className="chart-section">
            <div className="chart-card">
               <h2>Responses by Form</h2>

               <ResponsiveContainer width="100%" height={350}>
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="responses"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                      />
                   </BarChart>
                </ResponsiveContainer>
            </div>
          </section>
</>

          
        )}

      </div>


      {showModal && (
  <div className="analytics-modal-overlay" onClick={closeModal}>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    <td>{form.title}</td>

                    <td>
                      <span className={`status-badge ${form.status}`}>
                        {form.status}
                      </span>
                    </td>

                    <td>{form.responses}</td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/responses/${form.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
                  <td>{form.title}</td>
                  <td>{form.responses}</td>
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
                  <td>{item.title}</td>
                  <td>{item.responses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ---------------- COMPLETION ---------------- */}

        {selectedCard === "completion" && (
          <div className="completion-details">

            <div className="completion-item">
              <span>Total Forms</span>
              <strong>{details?.completion.total_forms}</strong>
            </div>

            <div className="completion-item">
              <span>Published</span>
              <strong>{details?.completion.published_forms}</strong>
            </div>

            <div className="completion-item">
              <span>Draft</span>
              <strong>{details?.completion.draft_forms}</strong>
            </div>

            <div className="completion-item">
              <span>Archived</span>
              <strong>{details?.completion.archived_forms}</strong>
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
    </Layout>
  );
}

export default Analytics;