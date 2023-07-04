import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

import { ILanguageTextInfo } from "@/types/interfaces";
import { Language } from "@/types/enums";

export default function useCurrentLanguage() {
  const i18nLocale = ref(useI18n().locale);

  const languageTextInfo = reactive<ILanguageTextInfo>({
    title: "English",
    icon: "english",
  });

  const changeLanguage = (language?: Language): void => {
    const currentLanguage = language;

    if (currentLanguage) {
      i18nLocale.value = currentLanguage;
    } else {
      i18nLocale.value = i18nLocale.value === Language.RU ? Language.ENG : Language.RU;
    }

    if (i18nLocale.value == Language.RU) {
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
