import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
  };

  return (
    <select
      className="language-switcher"
      value={i18n.resolvedLanguage || i18n.language}
      onChange={handleLanguageChange}
    >
      <option value="en">🇬🇧 English</option>
      <option value="hi">🇮🇳 हिन्दी</option>
    </select>
  );
}

export default LanguageSwitcher;