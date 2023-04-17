import { LangFormatType } from "@/types";
import { Language, LangFormat } from "@/enums";
import { IDateFormat } from "@/interfaces";
import RegExp from "@/helpers/regExp";

const useTimestamp = (date: Date | null, lang = Language.Russian, exaptDate?:number): IDateFormat => {

  const datestamp = date || new Date(Number(exaptDate)); 

  const dateLang: LangFormatType = lang === Language.Russian ? LangFormat.Ru : LangFormat.Eng;

  const RuFormatTime = datestamp.toLocaleString(LangFormat.Ru).replace(",", "")
                                                            .match(RegExp.RuFormatDate)![0];

  const EngFormatTime = datestamp.toLocaleString(LangFormat.Eng).match(RegExp.EngFormatDate)![0];

  const dateString = new Intl.DateTimeFormat(dateLang, {
    dateStyle: "full",
  }).format(datestamp);

  return {
    time: lang === Language.Russian ? RuFormatTime : EngFormatTime,
    date: dateString,
  };
};

export default useTimestamp;
