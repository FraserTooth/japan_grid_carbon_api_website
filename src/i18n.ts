import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./translations/en.json";
import jp from "./translations/jp.json";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: jp,
  },
};

const options = {
  order: ["navigator"],
  caches: [],

  resources,
  fallbackLng: "ja",
  debug: true,

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(options);

export default i18n;
