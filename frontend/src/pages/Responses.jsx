import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Search, Eye } from "lucide-react";

import Layout from "../components/layout/Layout";
import api, {
    browseAllResponses, 
    browseResponses,} from "../api/api";
import "./Responses.css";

function Responses() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForms = async () => {
  try {
    setLoading(true);

    const res = await api.get("/forms/");

    const formsData = res.data || [];

    const formsWithCounts = await Promise.all(
      formsData.map(async (form) => {
        try {
          const responseRes = await browseResponses(form.id, {
            limit: 1,
            offset: 0,
          });

          console.log(
            `Form ${form.id} response data:`,
            responseRes.data
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

    const responsesRes = await browseAllResponses({
      limit: 1,
      offset: 0,
    });

    setTotalResponses(
      Number(responsesRes.data?.total || 0)
    );

  } catch (err) {
    console.error(
      "Failed to load forms:",
      err
    );
  } finally {
    setLoading(false);
  }
};

    loadForms();
  }, []);

  const filteredForms = forms.filter((form) =>
    form.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="dashboard-container">

        {/* Header */}

        <section className="responses-page-header">

          <div>
            <h1>{t("submissions.formResponses")}</h1>

            <p>
              {t("submissions.formResponsesSubtitle")}
            </p>
          </div>

            <div className="responses-page-count">
                <span>{t("submissions.totalSubmissions")}</span>

                <strong>
                  {totalResponses}
                </strong>
            </div>

        </section>


        {/* Search */}

        <section className="responses-page-search">

          <div className="responses-search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder={t("submissions.searchForms")}
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </section>


        {/* Content */}

        {loading ? (

          <div className="responses-page-empty">
            <h3>{t("submissions.loadingForms")}</h3>
            <p>{t("submissions.loadingFormsDescription")}</p>
          </div>

        ) : filteredForms.length === 0 ? (

          <div className="responses-page-empty">
            <h3>{t("submissions.noFormsFound")}</h3>
            <p>{t("submissions.noFormsFoundDescription")}</p>
          </div>

        ) : (

          <section className="responses-page-section">

            <div className="responses-page-table">

              <div className="responses-page-table-header">

                <div>{t("submissions.form")}</div>
                <div>{t("analytics.status")}</div>
                <div>{t("submissions.responses")}</div>
                <div>{t("submissions.action")}</div>

              </div>


              {filteredForms.map((form) => (

                <div
                  className="responses-page-table-row"
                  key={form.id}
                >

                  {/* Form */}

                  <div className="responses-form-name">

                    <div className="responses-form-icon">
                      <MessageSquare size={17} />
                    </div>

                    <div>

                      <strong>
                        {form.title}
                      </strong>

                      <span>
                        {t("submissions.formNumber", { id: form.id })}
                      </span>

                    </div>

                  </div>


                  {/* Status */}

                  <div>

                    <span
                      className={`responses-status ${form.status}`}
                    >
                      {form.status === "draft"
                        ? t("formOverview.statusValues.draft")
                        : form.status === "published"
                        ? t("formOverview.statusValues.published")
                        : form.status === "archived"
                        ? t("formOverview.statusValues.archived")
                        : form.status}
                    </span>

                  </div>


                  {/* Response Count */}

                  <div className="responses-count-value">

                    {form.responseCount}

                  </div>


                  {/* Action */}

                  <div>

                    <button
                      className="responses-view-btn"
                      onClick={() =>
                        navigate(
                          `/responses/${form.id}`
                        )
                      }
                    >
                      <Eye size={15} />

                      {t("submissions.viewResponses")}
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

export default Responses;