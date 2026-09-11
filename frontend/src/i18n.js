import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enLanding from "./locales/en/landing.json";

import hiCommon from "./locales/hi/common.json";
import hiLanding from "./locales/hi/landing.json";
import enAuth from "./locales/en/auth.json";
import hiAuth from "./locales/hi/auth.json";

import enDashboard from "./locales/en/dashboard.json";
import hiDashboard from "./locales/hi/dashboard.json";
console.log("Landing object:", enLanding);
console.log("Landing CTA:", enLanding.landing?.cta);
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          ...enCommon,
          ...enLanding,
          ...enAuth,
          ...enDashboard,
      },
    },
      hi: {
        translation: {
          ...hiCommon,
          ...hiLanding,
          ...hiAuth,
          ...hiDashboard

      },
    },
  },

    
    fallbackLng: "en",

    supportedLngs: ["en", "hi"],
    nonExplicitSupportedLngs: true,

    defaultNS: "translation",
    ns: ["translation"],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    debug: true,
  });

export default i18n;