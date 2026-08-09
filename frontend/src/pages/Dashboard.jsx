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
import { useTranslation } from "react-i18next";



function Dashboard() {
  const { t: lt } = useTranslation();
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
        if (!cancelled) setError(lt("errors.loadForms"));
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
      setError(lt("errors.enterTitle"));
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
      setError(lt("errors.createForm"));
    } finally {
      setCreating(false);
    }
  };

  const deleteForm = async (form, e) => {
    e.stopPropagation();

    if (!window.confirmlt(lt("errors.deleteConfirm", { title: form.title }) 
    )
    )
  
      return;

    try {
      await api.delete(`/forms/${form.id}`);

      setForms((prev) => prev.filter((item) => item.id !== form.id));
    } catch (err) {
      alert(lt("errors.deleteFailed"));
    }
  };

  const duplicateForm = async (form, e) => {
    e.stopPropagation();

    try {
      const res = await api.post(`/forms/${form.id}/duplicate`);

      alert("Form duplicated successfully!");

      const formsRes = await api.get("/forms/");
      setForms(formsRes.data);

    } catch (err) {
      console.error(err);
      alert("Failed to duplicate form.");
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

            <h1>{lt("title")}</h1>

            <p>
                {lt("subtitle")}
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
            {lt("createForm")}
        </button>

    </section>

    {/* ================= SEARCH ================= */}

    <section className="dashboard-search">

        <div className="search-box">

            <Search size={18} />

            <input
                type="text"
                placeholder={lt("search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

        </div>

    </section>

    {/* ================= STATS ================= */}

    <section className="metrics-grid">

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon orange">
                <FileText size={18} />
            </div>

            <div>

                <span>{lt("stats.totalForms")}</span>

                <h2>{stats.total_forms}</h2>

            </div>
           </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">

            <div className="metric-icon green">
                <CheckCircle size={22} />
            </div>

            <div>

                <span>{lt("stats.publishedForms")}</span>

                <h2>{stats.published_forms}</h2>

            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
             <div className="metric-icon blue">
                <ClipboardList size={22} />
            </div>

            <div>

                <span>{lt("stats.responses")}</span>

                <h2>{stats.total_responses}</h2>

            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon purple">
                <BarChart3 size={22} />
            </div>

            <div>

                <span>{lt("stats.completion")}</span>

                <h2>{stats.completion_rate}%</h2>

            </div>
          </div>
        </div>

    </section>

    {/* ================= CONTENT ================= */}

    <section className="workspace-layout">

  <div className="workspace-main">

    <div className="section-header">
      <div>
        <h2>{lt("yourForms")}</h2>
        <p>{lt("yourFormsSubtitle")}</p>
      </div>
    </div>

    {loading ? (

      <div className="empty-state">
        {lt("message.loading")}
      </div>

    ) : forms.length === 0 ? (

      <div className="empty-state">
        <h3>{lt("messages.empty")}</h3>
        <p>{lt("messages.emptySubtitle")}</p>
      </div>

    ) : filteredForms.length === 0 ? (

      <div className="empty-state">
        <h3>{lt("messages.noMatch")}</h3>
        <p>{lt("messages.noMatchSubtitle")}</p>
      </div>

    ) : (

      <div className="forms-table">

        <div className="forms-table-header">

           <div>{lt("table.form")}</div>

          <div>{lt("table.status")}</div>

          <div>{lt("table.description")}</div>

          <div className="table-actions-header">
          {lt("table.actions")}</div>

        </div>

        {filteredForms.map((form) => (

          <div
             key={form.id}
             className="forms-table-row clickable-row"
             onClick={(e) =>{
              e.stopPropagation();
              navigate(`/forms/${form.id}/overview`);
             }}
          >
            <div className="form-name">
              <div className="form-name-icon">
                <FileText size={17}/>
              </div>

              <div className="form-name-content">
               <h3>{form.title}</h3>

               <span className="form-id">
                  Form #{form.id}
               </span>
            </div>
            </div>

            <div>
              <span className={`status ${form.status}`}>
                {lt(`status.${form.status}`, form.status)}
              </span>
            </div>

            <div className="form-description">
              {form.description || lt("messages.noDescription")}
            </div>

            <div className="table-actions">

              <button
                className="table-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/forms/${form.id}/overview`);
                }}
              >
                {lt("buttons.open")}
              </button>

              <button
                className="table-btn responses"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/responses/${form.id}`);
                }}
              >
                <MessageSquare size={15} />
                {lt("buttons.responses")}
              </button>

  
              <button
                className="table-btn duplicate"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateForm(form, e);
                }}
              >
                {lt("buttons.duplicate")}
              </button>

              <button
                className="table-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteForm(form, e);
                }}
              >
                {lt("buttons.delete")}
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
              <h2>{lt("modal.title")}</h2>

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
                <label>{lt("modal.formTitle")}</label>

                <input
                  type="text"
                  className="form-input"
                  placeholder={lt("modal.formTitlePlaceholder")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>{lt("modal.description")}</label>

                <textarea
                  className="form-textarea"
                  placeholder={lt("modal.descriptionPlaceholder")}
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
                  {lt("buttons.cancel")}
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={creating}
                >
                  {creating ? lt("buttons.creating") : lt("buttons.startBuilding")}
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