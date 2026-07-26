import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/layout/Layout";
import "./Dashboard.css";
import {
  Search,
  FileText,
  CheckCircle,
  ClipboardList,
  BarChart3,
  Plus,
  MessageSquare,
} from "lucide-react";

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [stats, setStats] = useState({
  total_forms: 0,
  published_forms: 0,
  total_responses: 0,
  completion_rate: 0,
});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

    api
  .get("/forms/dashboard/stats")
  .then((res) => {
    if (!cancelled) {
      setStats(res.data);
    }
  })
  .catch((err) => {
    console.error("Failed to load dashboard stats", err);
  });

    return () => {
      cancelled = true;
    };
  }, []);

  const createForm = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Enter a form title.");
      return;
    }

    setCreating(true);

    try {
      const res = await api.post("/forms/", {
        title: cleanTitle,
        description: description.trim(),
      });

      navigate(`/builder/${res.data.id}`);
    } catch (err) {
      setError("Could not create form.");
    } finally {
      setCreating(false);
    }
  };

  const deleteForm = async (form, e) => {
    e.stopPropagation();

    if (!window.confirm(`Delete "${form.title}"?`)) return;

    try {
      await api.delete(`/forms/${form.id}`);

      setForms((prev) => prev.filter((item) => item.id !== form.id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const filteredForms = forms.filter((form) => {
    const query = searchTerm.toLowerCase();

    return (
        form.title.toLowerCase().includes(query) ||
        (form.description || "").toLowerCase().includes(query) ||
        form.status.toLowerCase().includes(query)
    );
});

  
  return(

    <Layout>
      <div className="dashboard-container">

    {/* ================= HEADER ================= */}

    <section className="dashboard-header">

        <div>

            <h1>Forms</h1>

            <p>
                Build, manage and publish all your forms from one workspace.
            </p>

        </div>

        <button
            className="dashboard-create-btn"
            onClick={()=> {
              console.log("button clicked");
              setShowCreateModal(true);
            }}
            >
            <Plus size={18} />
            New Form
        </button>

    </section>

    {/* ================= SEARCH ================= */}

    <section className="dashboard-search">

        <div className="search-box">

            <Search size={18} />

            <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

        </div>

    </section>

    {/* ================= STATS ================= */}

    <section className="metrics-grid">

        <div className="metric-card">

            <div className="metric-icon orange">
                <FileText size={22} />
            </div>

            <div>

                <span>Total Forms</span>

                <h2>{stats.total_forms}</h2>

            </div>

        </div>

        <div className="metric-card">

            <div className="metric-icon green">
                <CheckCircle size={22} />
            </div>

            <div>

                <span>Published</span>

                <h2>{stats.published_forms}</h2>

            </div>

        </div>

        <div className="metric-card">

            <div className="metric-icon blue">
                <ClipboardList size={22} />
            </div>

            <div>

                <span>Responses</span>

                <h2>{stats.total_responses}</h2>

            </div>

        </div>

        <div className="metric-card">

            <div className="metric-icon purple">
                <BarChart3 size={22} />
            </div>

            <div>

                <span>Completion</span>

                <h2>{stats.completion_rate}%</h2>

            </div>

        </div>

    </section>

    {/* ================= CONTENT ================= */}

    <section className="workspace-layout">

  <div className="workspace-main">

    <div className="section-header">
      <div>
        <h2>Your Forms</h2>
        <p>Open, edit or manage your existing forms.</p>
      </div>
    </div>

    {loading ? (

      <div className="empty-state">
        Loading forms...
      </div>

    ) : filteredForms.length === 0 ? (

      <div className="empty-state">
        <h3>No matching forms</h3>
        <p>Try searching with a different keyword.</p>
      </div>

    ) : (

      <div className="forms-table">

        <div className="forms-table-header">

           <div>Form</div>

          <div>Status</div>

          <div>Description</div>

          <div className="actions-column">Actions</div>

        </div>

        {filteredForms.map((form) => (

          <div
             key={form.id}
             className="forms-table-row clickable-row"
             onClick={(e) =>{
              e.stopPropagation();
              navigate(`/builder/${form.id}`);
             }}
          >
            <div className="form-name">
               <h3>{form.title}</h3>
            </div>

            <div>
              <span className={`status ${form.status}`}>
                {form.status}
              </span>
            </div>

            <div className="form-description">
              {form.description || "No description"}
            </div>

            <div className="table-actions">

              <button
                   className="table-btn edit"
                   onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/builder/${form.id}`);
                   }}
              >
                  Open
              </button>

              <button
                    className="table-btn responses"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/responses/${form.id}`);
                   }}
              >
                   <MessageSquare size={15} />
                   Responses
              </button>

              <button
                    className="table-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteForm(form, e);
                   }}
              >
                   Delete
              </button>
 
           </div>
          </div> 
       ))}
</div>

    )}

  </div>

</section>

      </div>

              

      

      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="create-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Create New Form</h2>

              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                createForm(e);
              }}
              className="create-form"
            >
              <div className="form-group">
                <label>Form Title</label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter form title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  className="form-textarea"
                  placeholder="Describe your form..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && (
                <p className="error-text">
                  {error}
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Start Building"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
  
  
}

export default Dashboard;