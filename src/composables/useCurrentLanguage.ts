import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { I18nLanguage } from "@/types/types";
import { ILanguageTextInfo } from "@/types/interfaces";

export default function useCurrentLanguage() {
  const i18nLocale = ref(useI18n().locale);

  const languageTextInfo = reactive<ILanguageTextInfo>({
    title: "English",
    icon: "english",
  });

  const changeLanguage = (language?: I18nLanguage): void => {
    const currentLanguage = language;

    if (currentLanguage) {
      i18nLocale.value = currentLanguage;
    } else {
      i18nLocale.value = i18nLocale.value === "ru" ? "eng" : "ru";
    }

    if (i18nLocale.value == "ru") {
      languageTextInfo.icon = "russian";
      languageTextInfo.title = "Русский";
    } else {
      // English
      languageTextInfo.icon = "english";
      languageTextInfo.title = "English";
    }

    localStorage.setItem("smartumLanguage", i18nLocale.value);
  };

  return {
    languageTextInfo,
    i18nLocale,
    changeLanguage,
  };
}
