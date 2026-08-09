import { Link } from "react-router-dom";
import { useLandingTranslation } from "../../hooks/useTranslations";
import {
  FiArrowRight,
  FiPlayCircle,
  FiCheckCircle,
} from "react-icons/fi";


function Hero() {
  const { lt } = useLandingTranslation();
  return (
    <section className="hero">

      <div className="hero-content">

        <span className="hero-badge">
          {lt("hero.badge")}
        </span>

        <h1>
          {lt("hero.title")}
          <br />
          <span>{lt("hero.titleHighlight")}</span>
        </h1>

        <p>
          {lt("hero.description")}
        </p>

        <div className="hero-buttons">

          <Link to="/register" className="primary-btn">
            {lt("hero.getStarted")}
            <FiArrowRight />
          </Link>

          <Link to="/login" className="secondary-btn">
            <FiPlayCircle />
            {lt("hero.liveDemo")}
          </Link>

        </div>

        <div className="hero-features">

          <span>
            <FiCheckCircle />
            {lt("hero.noCoding")}
          </span>

          <span>
            <FiCheckCircle />
            {lt("hero.conditionalLogic")}
          </span>

          <span>
            <FiCheckCircle />
            {lt("hero.enterpriseSecurity")}
          </span>

        </div>

        <div className="hero-stats">

          <div>
            <h3>20+</h3>
            <p>{lt("hero.fieldTypes")}</p>
          </div>

          <div>
            <h3>99.9%</h3>
            <p>{lt("hero.uptime")}</p>
          </div>

          <div>
            <h3>100%</h3>
            <p>{lt("hero.responsive")}</p>
          </div>

        </div>

      </div>

      <div className="hero-preview">

        <div className="preview-card">

          <div className="preview-top">

            <div className="window-buttons">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="preview-title">
              {lt("hero.previewTitle")}
            </div>

          </div>

          <div className="field">
            {lt("hero.fullName")}
          </div>

          <div className="input"></div>

          <div className="field">
            {lt("hero.email")}
          </div>

          <div className="input"></div>

          <div className="field">
            {lt("hero.department")}
          </div>

          <div className="dropdown">
            {lt("hero.sales")} ▼
          </div>

          <div className="field">
            {lt("hero.satisfaction")}
          </div>

          <div className="rating">
            ★★★★★
          </div>

          <button className="submit-btn">
            {lt("hero.submit")}
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;