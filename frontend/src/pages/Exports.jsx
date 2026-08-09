import React, { useEffect, useState } from "react";
import { Download, FileText, Search } from "lucide-react";

import Layout from "../components/layout/Layout";
import api, {
  browseAllResponses,
  exportResponsesCSV,
  exportResponsesJSON,
} from "../api/api";

import "./Exports.css";

function Exports() {
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);

      const res = await api.get("/forms/");

      const formsData = res.data || [];

      const formsWithCounts = await Promise.all(
        formsData.map(async (form) => {
          try {
            const responseRes = await api.get(
              `/submissions/form/${form.id}/responses`,
              {
                params: {
                  limit: 1,
                  offset: 0,
                },
              }
            );

            return {
              ...form,
              responseCount: Number(
                responseRes.data?.total || 0
              ),
            };
          } catch (err) {
            console.error(
              `Failed to load responses for form ${form.id}:`,
              err
            );

            return {
              ...form,
              responseCount: 0,
            };
          }
        })
      );

      setForms(formsWithCounts);

    } catch (err) {
      console.error("Failed to load forms:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  const handleExportCSV = async (form) => {
    try {
      setExporting(`${form.id}-csv`);

      const res = await exportResponsesCSV(form.id);

      downloadFile(
        res.data,
        `form_${form.id}_responses.csv`
      );

    } catch (err) {
      console.error("CSV export failed:", err);
      alert("Failed to export CSV.");
    } finally {
      setExporting(null);
    }
  };

  const handleExportJSON = async (form) => {
    try {
      setExporting(`${form.id}-json`);

      const res = await exportResponsesJSON(form.id);

      downloadFile(
        res.data,
        `form_${form.id}_responses.json`
      );

    } catch (err) {
      console.error("JSON export failed:", err);
      alert("Failed to export JSON.");
    } finally {
      setExporting(null);
    }
  };

  const filteredForms = forms.filter((form) =>
    form.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="dashboard-container">

        {/* Header */}

        <section className="exports-page-header">

          <div>
            <h1>Exports</h1>

            <p>
              Export response data from your forms.
            </p>
          </div>

        </section>


        {/* Search */}

        <section className="exports-search-section">

          <div className="exports-search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </section>


        {/* Table */}

        {loading ? (

          <div className="exports-empty-state">

            <h3>Loading forms...</h3>

            <p>
              Please wait while I fetch your forms.
            </p>

          </div>

        ) : filteredForms.length === 0 ? (

          <div className="exports-empty-state">

            <h3>No Forms Found</h3>

            <p>
              No forms match your search.
            </p>

          </div>

        ) : (

          <section className="exports-section">

            <div className="exports-table">

              <div className="exports-table-header">

                <div>Form</div>
                <div>Status</div>
                <div>Responses</div>
                <div>Export</div>

              </div>


              {filteredForms.map((form) => (

                <div
                  className="exports-table-row"
                  key={form.id}
                >

                  {/* Form */}

                  <div className="exports-form-name">

                    <div className="exports-form-icon">
                      <FileText size={17} />
                    </div>

                    <div>

                      <strong>
                        {form.title}
                      </strong>

                      <span>
                        Form #{form.id}
                      </span>

                    </div>

                  </div>


                  {/* Status */}

                  <div>

                    <span
                      className={`exports-status ${form.status}`}
                    >
                      {form.status}
                    </span>

                  </div>


                  {/* Response Count */}

                  <div className="exports-response-count">

                    {form.responseCount}

                  </div>


                  {/* Export Buttons */}

                  <div className="exports-actions">

                    <button
                      className="exports-btn csv"
                      onClick={() =>
                        handleExportCSV(form)
                      }
                      disabled={
                        exporting === `${form.id}-csv`
                      }
                    >

                      <Download size={14} />

                      {exporting === `${form.id}-csv`
                        ? "Exporting..."
                        : "CSV"}

                    </button>


                    <button
                      className="exports-btn json"
                      onClick={() =>
                        handleExportJSON(form)
                      }
                      disabled={
                        exporting === `${form.id}-json`
                      }
                    >

                      <Download size={14} />

                      {exporting === `${form.id}-json`
                        ? "Exporting..."
                        : "JSON"}

                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

      </div>
    </Layout>
  );
}

export default Exports;