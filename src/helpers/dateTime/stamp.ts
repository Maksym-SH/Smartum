import type { I18nLanguage, LangFormatType } from "@/types/types";
import { LangFormat } from "@/types/enums";
import type { IDateFormat } from "@/types/interfaces";

import RegExp from "@/helpers/regExp";

export default function Timestamp(
  date: Date | null,
  lang: I18nLanguage = "eng",
  exaptDate?: number
): IDateFormat {
  const datestamp = date || new Date(Number(exaptDate));

  const dateLang: LangFormatType = lang === "eng" ? LangFormat.Eng : LangFormat.Ru;
  const RuFormatTime = datestamp
    .toLocaleString(LangFormat.Ru)
    .replace(",", "")
    .match(RegExp.RuFormatDate)![0];

  const EngFormatTime = datestamp
    .toLocaleString(LangFormat.Eng)
    .match(RegExp.EngFormatDate)![0];

  const dateString = new Intl.DateTimeFormat(dateLang, {
    dateStyle: "full",
  }).format(datestamp);

  return {
    time: lang === "eng" ? EngFormatTime : RuFormatTime,
    date: dateString,
  };
}
