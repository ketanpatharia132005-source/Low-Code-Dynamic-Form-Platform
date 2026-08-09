import { Link } from "react-router-dom";
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiArrowUp,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLandingTranslation } from "../../hooks/useTranslations";

function Footer() {
  const { t } = useTranslation();
  const { lt } = useLandingTranslation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <div className="footer-logo">
            📝 {t("appName")}
          </div>

          <p>
            {lt("footer.description")}
          </p>

          <div className="footer-socials">

            <a href="#" aria-label="GitHub">
              <FiGithub />
            </a>

            <a href="#" aria-label="LinkedIn">
              <FiLinkedin />
            </a>

            <a href="#" aria-label="Twitter">
              <FiTwitter />
            </a>

          </div>

        </div>

        {/* Product */}

        <div>

          <h4>{lt("footer.product")}</h4>

          <a href="#features">
            {lt("navbar.features")}
          </a>

          <a href="#workflow">
            {lt("navbar.workflow")}
          </a>

          <a href="#pricing">
            {lt("navbar.pricing")}
          </a>

        </div>

        {/* Resources */}

        <div>

          <h4>{lt("footer.resources")}</h4>

          <Link to="/login">
            {lt("navbar.login")}
          </Link>

          <Link to="/register">
            {lt("navbar.getStarted")}
          </Link>

          <a href="#faq">
            {lt("navbar.faq")}
          </a>

        </div>

        {/* Platform */}

        <div>

          <h4>{lt("footer.platform")}</h4>

          <span>FastAPI</span>
          <span>React</span>
          <span>PostgreSQL</span>
          <span>JWT Authentication</span>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 {t("appName")}. {lt("footer.copyright")}
        </p>

        <button
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label={lt("footer.scrollTop")}
        >
          <FiArrowUp />
        </button>

      </div>

    </footer>
  );
}

export default Footer;