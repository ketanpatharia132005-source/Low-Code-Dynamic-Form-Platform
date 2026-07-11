import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/layout/Layout";
import "../components/builder/Builder.css";

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
    api.get("/forms/").then((res) => {
        if (!cancelled) setForms(res.data);
      }).catch((err) => {
        console.error("Failed to load forms", err);
        if (!cancelled) setError("Could not load your forms.");
      }).finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const createForm = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) { setError("Enter a form title."); return; }
    setCreating(true);
    try {
      const res = await api.post("/forms/", { title: cleanTitle, description: description.trim() });
      navigate(`/builder/${res.data.id}`);
    } catch (err) {
      setError("Could not create form.");
    } finally {
      setCreating(false);
    }
  };

  const deleteForm = async (form) => {
    if (!window.confirm(`Delete "${form.title}"?`)) return;
    try {
      await api.delete(`/forms/${form.id}`);
      setForms((prev) => prev.filter((item) => item.id !== form.id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        
        {/* Header */}
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="text-muted">Smart Form Builder with Dynamic Logic</p>
        </header>

        {/* Metrics */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-title">🟣 Total Templates</div>
            <div className="metric-value">{forms.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">🟢 Active Components</div>
            <div className="metric-value">{forms.reduce((sum, f) => sum + (f.fields?.length || 0), 0)}</div>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="dashboard-content-stack">
          
          {/* Active Templates Table */}
          <div className="main-content-card">
            <div className="card-header">
              <h2>Your Active Templates</h2>
            </div>
            {loading ? <p style={{padding: "20px"}}>Loading...</p> : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Template</th>
                    <th>Components</th>
                    <th>Status</th>
                    <th style={{textAlign: "right"}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map((form) => (
                    <tr key={form.id}>
                      <td>
                        <div className="table-title">{form.title}</div>
                        <div className="table-desc">{form.description || "No description"}</div>
                      </td>
                      <td>{form.fields?.length || 0}</td>
                      <td><span className={`status-pill ${form.fields?.length > 0 ? "published" : "draft"}`}>
                        {form.fields?.length > 0 ? "Active" : "Draft"}
                      </span></td>
                      <td style={{textAlign: "right"}}>
                        <button className="btn-primary" onClick={() => navigate(`/builder/${form.id}`)}>Open Canvas</button>
                        <button className="btn-danger" onClick={() => deleteForm(form)} style={{marginLeft: "10px"}}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Create New Form Section - Styled as a Card */}
          <div className="main-content-card create-form-section">
            <div className="card-header">
              <h2>Create New Form</h2>
            </div>
            <form onSubmit={createForm} className="create-form-body">
              <div className="form-group">
                <label>Form Title</label>
                <input className="form-input" type="text" placeholder="e.g., Client Onboarding Form" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-textarea" placeholder="Describe the target audience..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              {error && <p className="error-text">⚠️ {error}</p>}
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={creating}>
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