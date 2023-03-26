import RegExp from "@/helpers/regExp";

import { LangFormat } from "@/types";
import { ELanguage, ELangFormat } from "@/enums";

const useTimeStamp = (differenceTime: number, lang = ELanguage.Russian, Time?:number) => {
  let date = new Date();
  date.setSeconds(date.getSeconds() + differenceTime);

  if (Time) {
    date = new Date(Number(Time));
  }
  const dateLang: LangFormat = lang === ELanguage.Russian ? ELangFormat.Ru : ELangFormat.Eng;

  const RuFormatTime = date.toLocaleString(ELangFormat.Ru).replace(",", "")
                                                            .match(RegExp.RuFormatDate)![0];

  const EngFormatTime = date.toLocaleString(ELangFormat.Eng)
                                .match(RegExp.EngFormatDate)![0];

  const dateString = new Intl.DateTimeFormat(dateLang, {
    dateStyle: "full",
  }).format(date);

  return {
    time: lang === ELanguage.Russian ? RuFormatTime : EngFormatTime,
    date: dateString,
  };
};

export default useTimeStamp;
