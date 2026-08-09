import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLandingTranslation } from "../../hooks/useTranslations";

function FAQ() {
  const [open, setOpen] = useState(0);

  const { t } = useTranslation();
  const { lt } = useLandingTranslation();

  const faqs = [
    {
      question: lt("faq.questions.q1.question"),
      answer: lt("faq.questions.q1.answer"),
    },
    {
      question: lt("faq.questions.q2.question"),
      answer: lt("faq.questions.q2.answer"),
    },
    {
      question: lt("faq.questions.q3.question"),
      answer: lt("faq.questions.q3.answer"),
    },
    {
      question: lt("faq.questions.q4.question"),
      answer: lt("faq.questions.q4.answer"),
    },
    {
      question: lt("faq.questions.q5.question"),
      answer: lt("faq.questions.q5.answer"),
    },
  ];

  return (
    <section className="faq-section" id="faq">

      <div className="section-heading">

        <span className="section-badge">
          {lt("faq.badge")}
        </span>

        <h2>
          {lt("faq.title")}
          <span> {lt("faq.titleHighlight")}</span>
        </h2>

        <p>
          {lt("faq.description", { appName: t("appName") })}
        </p>

      </div>

      <div className="faq-container">

        {faqs.map((faq, index) => (

          <div
            className={`faq-item ${open === index ? "active-faq" : ""}`}
            key={index}
          >

            <button
              className="faq-question"
              onClick={() => setOpen(open === index ? -1 : index)}
            >

              <span>{faq.question}</span>

              <FiChevronDown
                className={open === index ? "rotate-icon" : ""}
              />

            </button>

            {open === index && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}

          </div>

        ))}

      </div>

    </section>
  );
}

export default FAQ;