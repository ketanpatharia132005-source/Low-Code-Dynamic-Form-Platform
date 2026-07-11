import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import Layout from "../components/layout/Layout";
import "../components/builder/Builder.css"; // Only use our clean design token stylesheet

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    api
      .get("/forms/")
      .then((res) => {
        if (!cancelled) setForms(res.data);
      })
      .catch((err) => {
        console.error("Failed to load forms", err);
        if (!cancelled) setError("Could not load your forms.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const createForm = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Enter a form title before creating a form.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const res = await api.post("/forms/", {
        title: cleanTitle,
        description: description.trim(),
      });
      navigate(`/builder/${res.data.id}`);
    } catch (err) {
      console.error("Failed to create form", err);
      setError("Could not create the form. Check that the backend is running.");
    } finally {
      setCreating(false);
    }
  };

  const deleteForm = async (form) => {
    if (!window.confirm(`Delete "${form.title}" and all of its fields?`)) {
      return;
    }

    setError("");

    try {
      await api.delete(`/forms/${form.id}`);
      setForms((prev) => prev.filter((item) => item.id !== form.id));
    } catch (err) {
      console.error("Failed to delete form", err);
      setError("Could not delete the form. Please try again.");
    }
  };

  const totalFormsCount = forms.length;
  const totalFieldsCount = forms.reduce((sum, f) => sum + (f.fields?.length || 0), 0);

  return (
    <Layout>
      <div className="dashboard-container" style={{ padding: "32px 40px" }}>
        
        {/* Modern Clean Header Row */}
        <header className="dashboard-header" style={{ marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "1.85rem", color: "var(--text-main)", fontWeight: "700" }}>Dashboard</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
              Smart Form Builder with Dynamic Logic
            </p>
          </div>
        </header>

        {/* Floating Metrics Overview Grid */}
        <section className="metrics-grid" style={{ marginBottom: "32px" }}>
          <div className="metric-card">
            <div className="metric-title">🟣 Total Templates</div>
            <div className="metric-value">{totalFormsCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">🟢 Active Components</div>
            <div className="metric-value">{totalFieldsCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">⚙️ Workspace Status</div>
            <div className="metric-value" style={{ fontSize: "1.1rem", color: "var(--status-pub-text)", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", backgroundColor: "var(--status-pub-text)", borderRadius: "50%" }}></span> 
              Connected Natively
            </div>
          </div>
        </section>

        {/* Spacious Top-to-Bottom Layout Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* 1. Full-Width Main Templates Table Card */}
          <div className="main-content-card">
            <div style={{ padding: "24px 24px 16px 24px", borderBottom: "1px solid var(--border-color)" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-main)", margin: "0" }}>Your Active Templates</h2>
            </div>

            {loading && <p style={{ padding: "24px", color: "var(--text-muted)" }}>Querying native records database...</p>}

            {!loading && forms.length === 0 && (
              <p style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>
                No active forms found in your workspace. Use the panel below to build one.
              </p>
            )}

            {forms.length > 0 && (
              <table className="modern-table" style={{ width: "100%", tableLayout: "auto" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", width: "40%" }}>Template Identifier</th>
                    <th style={{ textAlign: "left", width: "25%" }}>Structural Volume</th>
                    <th style={{ textAlign: "left", width: "15%" }}>Status Badge</th>
                    <th style={{ textAlign: "right", width: "20%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map((form) => (
                    <tr key={form.id}>
                      <td style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.95rem" }}>{form.title}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>{form.description || "No metadata description provided."}</div>
                      </td>
                      <td style={{ textAlign: "left", color: "var(--text-muted)", fontWeight: "500" }}>
                        {form.fields?.length || 0} modular components
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span className={`status-pill ${form.fields?.length > 0 ? "published" : "draft"}`}>
                          {form.fields?.length > 0 ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", alignItems: "center" }}>
                          <button 
                            type="button" 
                            className="btn-primary" 
                            style={{ padding: "8px 16px", fontSize: "0.85rem", borderRadius: "6px" }}
                            onClick={() => navigate(`/builder/${form.id}`)}
                          >
                            Open Canvas
                          </button>
                          <button
                            type="button"
                            style={{ background: "none", border: "none", color: "#ef4444", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}
                            onClick={() => deleteForm(form)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 2. Full-Width Inline Creator Form Card */}
          <div className="main-content-card" style={{ padding: "28px" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-main)", margin: "0 0 20px 0" }}>Create New Form</h2>
            
            <form onSubmit={createForm} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="form-label" style={{ marginBottom: "6px" }}>Form Title</label>
                <input
                  className="form-input"
                  type="text"
                  style={{ width: "100%", background: "#ffffff", color: "var(--text-main)", border: "1px solid var(--border-color)" }}
                  placeholder="e.g., Client Onboarding Form"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ marginBottom: "6px" }}>Description</label>
                <textarea
                  className="form-textarea"
                  style={{ width: "100%", minHeight: "80px", resize: "none", background: "#ffffff", color: "var(--text-main)", border: "1px solid var(--border-color)" }}
                  placeholder="Describe the target audience or use-case..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: "0" }}>
                  ⚠️ {error}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-primary" type="submit" style={{ minWidth: "160px" }} disabled={creating}>
                  {creating ? "Processing..." : "Create Form Space"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;