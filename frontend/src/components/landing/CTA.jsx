import { Link } from "react-router-dom";
import { FiArrowRight, FiPlayCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLandingTranslation } from "../../hooks/useTranslations";

function CTA() {
  const { t } = useTranslation();
  const { lt } = useLandingTranslation();

  return (
    <section className="cta-section">

      <div className="cta-glow cta-glow-1"></div>
      <div className="cta-glow cta-glow-2"></div>

      <div className="cta-content">

        <span className="cta-badge">
          {lt("cta.badge")}
        </span>

        <h2>
          {lt("cta.title")}
          <br />
          {lt("cta.titlePrefix")} <span>{t("appName")}</span>
        </h2>

        <p>
          {lt("cta.description")}
        </p>

        <div className="cta-buttons">

          <Link to="/register" className="cta-primary-btn">
            {lt("cta.getStarted")}
            <FiArrowRight />
          </Link>

          <Link to="/login" className="cta-secondary-btn">
            <FiPlayCircle />
            {lt("cta.login")}
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CTA;