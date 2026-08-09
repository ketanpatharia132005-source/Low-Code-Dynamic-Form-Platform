import {
  FiBookOpen,
  FiUsers,
  FiBriefcase,
  FiCode,
  FiHeart,
  FiCalendar,
} from "react-icons/fi";
import { useLandingTranslation } from "../../hooks/useTranslations";


function UseCases() {

  const { lt } = useLandingTranslation();

  const useCases = [
    {
      icon: <FiBookOpen />,
      title: lt("useCases.categories.education.title"),
      items: [
        lt("useCases.categories.education.items.0"),
        lt("useCases.categories.education.items.1"),
        lt("useCases.categories.education.items.2"),
        lt("useCases.categories.education.items.3"),
      ],
    },
    {
      icon: <FiUsers />,
      title: lt("useCases.categories.hr.title"),
      items: [
        lt("useCases.categories.hr.items.0"),
        lt("useCases.categories.hr.items.1"),
        lt("useCases.categories.hr.items.2"),
        lt("useCases.categories.hr.items.3"),
      ],
    },
    {
      icon: <FiBriefcase />,
      title: lt("useCases.categories.business.title"),
      items: [
        lt("useCases.categories.business.items.0"),
        lt("useCases.categories.business.items.1"),
        lt("useCases.categories.business.items.2"),
        lt("useCases.categories.business.items.3"),
      ],
    },
    {
      icon: <FiCode />,
      title: lt("useCases.categories.it.title"),
      items: [
        lt("useCases.categories.it.items.0"),
        lt("useCases.categories.it.items.1"),
        lt("useCases.categories.it.items.2"),
        lt("useCases.categories.it.items.3"),
      ],
    },
    {
      icon: <FiHeart />,
      title: lt("useCases.categories.healthcare.title"),
      items: [
        lt("useCases.categories.healthcare.items.0"),
        lt("useCases.categories.healthcare.items.1"),
        lt("useCases.categories.healthcare.items.2"),
        lt("useCases.categories.healthcare.items.3"),
      ],
    },
    {
      icon: <FiCalendar />,
      title: lt("useCases.categories.events.title"),
      items: [
        lt("useCases.categories.events.items.0"),
        lt("useCases.categories.events.items.1"),
        lt("useCases.categories.events.items.2"),
        lt("useCases.categories.events.items.3"),
      ],
    },
  ];
  return (
    <section className="usecases-section">

      <div className="section-heading">

        <span className="section-badge">
          {lt("useCases.badge")}
        </span>

        <h2>
          {lt("useCases.title")}
          <span> {lt("useCases.titleHighlight")}</span>
        </h2>

        <p>
          {lt("useCases.description")}
        </p>

      </div>

      <div className="usecases-grid">

        {useCases.map((item, index) => (

          <div className="usecase-card" key={index}>

            <div className="usecase-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <ul>

              {item.items.map((feature, i) => (

                <li key={i}>
                  ✓ {feature}
                </li>

              ))}

            </ul>

          </div>

        ))}

      </div>

    </section>
  );
}

export default UseCases;