import { LangFormat } from "@/types/index";
import { ELanguage, ELangFormat } from "@/enums/index";
import RegExp from "@/helpers/regExp/regExp";

const useTimeStamp = (differenceTime: number, lang = ELanguage.Russian, Time:number | null = null) => {
  let date = new Date();
  date.setSeconds(date.getSeconds() + differenceTime);

  if (Time != null) {
    date = new Date(Number(Time));
  }

  const datELang: LangFormat = lang === ELanguage.Russian ? ELangFormat.Ru : ELangFormat.Eng;

  const RuFormatTime = date.toLocaleString(ELangFormat.Ru).replace(",", "").match(RegExp.RuFormatDate)![0];

  const EngFormatTime = date.toLocaleString(ELangFormat.Eng).match(RegExp.RuFormatDate)![0];

  const dateString = new Intl.DateTimeFormat(datELang, {
    dateStyle: "full",
  }).format(date);

  return {
    time: lang === ELanguage.Russian ? RuFormatTime : EngFormatTime,
    date: dateString,
  };
};

export default useTimeStamp;
