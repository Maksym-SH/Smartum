import { createI18n } from "vue-i18n";
import { LocalLanguage } from "@/helpers/methods";

import ru from "./ru.json";
import eng from "./eng.json";

import type { I18nOptions } from "vue-i18n";

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
