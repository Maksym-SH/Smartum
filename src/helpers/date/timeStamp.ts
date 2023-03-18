import { LangFormat } from "@/types/index";

const useTimeStamp = (differenceTime: number, lang = "ru", Time:number | null = null) => {
  let date = new Date();
  date.setSeconds(date.getSeconds() + differenceTime);
  if (Time != null) {
    date = new Date(Number(Time));
  }
  const dateLanguage: LangFormat = lang === "ru" ? "ru-Ru" : "en-EN";
  const RuFormatTime = date.toLocaleString("ru-EN").replace(",", "").match(/\d{2}:\d{2}:\d{2}/)![0];
  const EngFormatTime = date.toLocaleString("en-EN").match(/\d{1,}:\d{2}:\d{2}\s[AP]M/)![0];

  const dateString = new Intl.DateTimeFormat(dateLanguage, {
    dateStyle: "full",
  }).format(date);

  return {
    time: lang === "ru" ? RuFormatTime : EngFormatTime,
    date: dateString,
  };
};

export default useTimeStamp;
