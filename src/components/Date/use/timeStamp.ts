import { LangFormat } from "@/types/index";

const useTimeStamp = (lang = "ru") => {
  const date = new Date();
  const dateLanguage: LangFormat = lang === "ru" ? "ru-Ru" : "en-EN" 
  const RuFormatTime = date.toLocaleString("ru-EN").replace(",", "").match(/\d{2}:\d{2}:\d{2}/)![0];
  const EngFormatTime = date.toLocaleString("en-EN").match(/\d{1,}:\d{2}:\d{2}\s[AP]M/)![0];

  const dateString =  new Intl.DateTimeFormat(dateLanguage, { dateStyle: "full" }).format(date);

  return {
    time: lang === 'ru' ?  RuFormatTime : EngFormatTime,
    date: dateString
  }
}

export default useTimeStamp;