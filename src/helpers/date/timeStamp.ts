import RegExp from "@/helpers/regExp";
import { LangFormatType } from "@/types";
import { Language, LangFormat } from "@/enums";
import { IFormatDate } from "@/interfaces";

const useTimeStamp = (date: Date | null, lang = Language.Russian, fixedTime?:number): IFormatDate => {

  const dateStamp = date || new Date(Number(fixedTime)); 

  const dateLang: LangFormatType = lang === Language.Russian ? LangFormat.Ru : LangFormat.Eng;

  const RuFormatTime = dateStamp.toLocaleString(LangFormat.Ru).replace(",", "")
                                                            .match(RegExp.RuFormatDate)![0];

  const EngFormatTime = dateStamp.toLocaleString(LangFormat.Eng).match(RegExp.EngFormatDate)![0];

  const dateString = new Intl.DateTimeFormat(dateLang, {
    dateStyle: "full",
  }).format(dateStamp);

  return {
    time: lang === Language.Russian ? RuFormatTime : EngFormatTime,
    date: dateString,
  };
};

export default useTimeStamp;
