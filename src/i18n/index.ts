import { I18nOptions, createI18n } from "vue-i18n";
import { LocalLanguage } from "@/helpers/methods";

import ru from "./ru.json";
import eng from "./eng.json";

const message = {
  ru,
  eng,
};

const config: I18nOptions = {
  legacy: false,
  locale: LocalLanguage(),
  fallbackLocale: "eng",
  messages: message,
  warnHtmlMessage: false,
};

export default createI18n(config);
