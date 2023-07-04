import type { LangFormatType } from "@/types/types";
import { LangFormat, Language } from "@/types/enums";
import type { IDateFormat } from "@/types/interfaces";

import RegExp from "@/helpers/regExp";

export default function Timestamp(
  date: Date | null,
  lang: Language = Language.ENG,
  exaptDate?: number
): IDateFormat {
  const datestamp = date || new Date(Number(exaptDate));

  const dateLang: LangFormatType = lang === Language.ENG ? LangFormat.ENG : LangFormat.RU;
  const RuFormatTime = datestamp
    .toLocaleString(LangFormat.RU)
    .replace(",", "")
    .match(RegExp.RuFormatDate)![0];

  const EngFormatTime = datestamp
    .toLocaleString(LangFormat.ENG)
    .match(RegExp.EngFormatDate)![0];

  const dateString = new Intl.DateTimeFormat(dateLang, {
    dateStyle: "full",
  }).format(datestamp);

  return {
    time: lang === "eng" ? EngFormatTime : RuFormatTime,
    date: dateString,
  };
}
