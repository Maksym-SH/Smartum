import i18n from "@/i18n";
import useTimestamp from "./stamp";
import useCurrentLanguage from "@/composables/useCurrentLanguage";
import RegExp from "@/helpers/regExp";

import type { IDateFormat } from "@/types/interfaces";
import { Language, Numbers } from "@/types/enums";

export function GetDate(date: string, onlyDate = false): IDateFormat {
  const { i18nLocale } = useCurrentLanguage();

  const dateFormat = Number(date);
  const timestamp = useTimestamp(null, i18nLocale.value as Language, dateFormat);

  if (onlyDate) {
    const regExp =
      i18nLocale.value === Language.ENG
        ? RegExp.TimeRegisteredEng
        : RegExp.TimeRegisteredRu;

    timestamp.date = timestamp.date.match(regExp)![0];
  }

  return timestamp;
}

export function GetBetweenDateString(date: Date): string {
  const { t } = i18n.global;

  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  if (date) {
    switch (true) {
      case date >= today:
        return t("time.today");
      case date >= yesterday:
        return t("time.yesterday");
      case date >= weekAgo: {
        const dayAgo = Math.floor(
          (Number(today) - Number(date)) / Numbers.DAY_MILLISECONDS + 1
        );
        return `${dayAgo} ${GetDayStringFormat(dayAgo)} ${t("time.ago")}`;
      }
      default:
        return date.toLocaleDateString();
    }
  }

  return "";
}

// Get the word "день | day", "дня | days" or "дней | days" depending on the number.
export function GetDayStringFormat(num: number): string {
  const { t } = i18n.global;

  if (num === 1) {
    return t("time.day");
  } else if (num >= 2 && num <= 4) {
    return t("time.evenDay");
  }

  return t("time.days");
}
