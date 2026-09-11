import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  LayoutDashboard,
  Wand2,
  MessageSquare,
  BarChart3,
  GitBranch,
  Settings,
} from "lucide-react";

function FormNavigation({ formId, onRulesClick }) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const isBuilderActive =
    location.pathname === `/builder/${formId}`;

  const isResponsesActive =
    location.pathname === `/responses/${formId}`;

  const isAnalyticsActive =
    location.pathname === `/analytics/${formId}`;

  const isOverviewActive =
    location.pathname === `/forms/${formId}/overview`;

  const handleBuilder = () => {
    navigate(`/builder/${formId}`);
  };

  const handleResponses = () => {
    navigate(`/responses/${formId}`);
  };

  const handleAnalytics = () => {
    navigate(`/analytics/${formId}`);
  };

  const handleOverview = () => {
    navigate(`/forms/${formId}/overview`);
  };

  return (
    <div className="form-navigation">

      <button
        type="button"
        className={`form-navigation-item ${
          isOverviewActive ? "active" : ""
        }`}
        onClick={handleOverview}
      >
        <LayoutDashboard size={16} />
        <span>
          {t("formNavigation.overview")}
        </span>
      </button>


      <button
        type="button"
        className={`form-navigation-item ${
          isBuilderActive ? "active" : ""
        }`}
        onClick={handleBuilder}
      >
        <Wand2 size={16} />
        <span>
          {t("formNavigation.builder")}
        </span>
      </button>


      <button
        type="button"
        className={`form-navigation-item ${
          isResponsesActive ? "active" : ""
        }`}
        onClick={handleResponses}
      >
        <MessageSquare size={16} />
        <span>
          {t("formNavigation.responses")}
        </span>
      </button>


      <button
        type="button"
        className={`form-navigation-item ${
          isAnalyticsActive ? "active" : ""
        }`}
        onClick={handleAnalytics}
      >
        <BarChart3 size={16} />
        <span>
          {t("formNavigation.analytics")}
        </span>
      </button>


      <button
        type="button"
        className="form-navigation-item"
        onClick={onRulesClick}
      >
        <GitBranch size={16} />
        <span>
          {t("formNavigation.rules")}
        </span>
      </button>


      <button
        type="button"
        className={`form-navigation-item ${
          location.pathname ===
          `/forms/${formId}/settings`
            ? "active"
            : ""
        }`}
        onClick={() =>
          navigate(
            `/forms/${formId}/settings`
          )
        }
      >
        <Settings size={16} />
        <span>
          {t("formNavigation.settings")}
        </span>
      </button>

    </div>
  );
}

export default FormNavigation;