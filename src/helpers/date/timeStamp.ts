import RegExp from "@/helpers/regExp";

import { LangFormat } from "@/types";
import { ELanguage, ELangFormat } from "@/enums";
import { IFormatDate } from "@/interfaces";

const useTimeStamp = (date: Date | null, lang = ELanguage.Russian, fixedTime?:number): IFormatDate => {

  const dateStamp = date || new Date(Number(fixedTime)); 

  const dateLang: LangFormat = lang === ELanguage.Russian ? ELangFormat.Ru : ELangFormat.Eng;

  const RuFormatTime = dateStamp.toLocaleString(ELangFormat.Ru).replace(",", "")
                                                            .match(RegExp.RuFormatDate)![0];

  const EngFormatTime = dateStamp.toLocaleString(ELangFormat.Eng)
                                .match(RegExp.EngFormatDate)![0];

  const dateString = new Intl.DateTimeFormat(dateLang, {
    dateStyle: "full",
  }).format(dateStamp);

  return {
    time: lang === ELanguage.Russian ? RuFormatTime : EngFormatTime,
    date: dateString,
  };
};

export default useTimeStamp;
