import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wand2,
  MessageSquare,
  BarChart3,
  GitBranch,
  Settings,
} from "lucide-react";

function FormNavigation({ formId, onRulesClick }) {
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
        <span>Overview</span>
      </button>

      <button
        type="button"
        className={`form-navigation-item ${
          isBuilderActive ? "active" : ""
        }`}
        onClick={handleBuilder}
      >
        <Wand2 size={16} />
        <span>Builder</span>
      </button>

      <button
        type="button"
        className={`form-navigation-item ${
          isResponsesActive ? "active" : ""
        }`}
        onClick={handleResponses}
      >
        <MessageSquare size={16} />
        <span>Responses</span>
      </button>

      <button
        type="button"
        className={`form-navigation-item ${
          isAnalyticsActive ? "active" : ""
        }`}
        onClick={handleAnalytics}
      >
        <BarChart3 size={16} />
        <span>Analytics</span>
      </button>

      <button
        type="button"
        className="form-navigation-item"
        onClick={onRulesClick}
      >
        <GitBranch size={16} />
        <span>Rules</span>
      </button>

      <button
        type="button"
        className={`form-navigation-item ${
          location.pathname === `/forms/${formId}/settings`
            ? "active"
            : ""
        }`}
        onClick={() =>
          navigate(`/forms/${formId}/settings`)
        }
      >
        <Settings size={16} />
        <span>Settings</span>
      </button>

    </div>
  );
}

export default FormNavigation;