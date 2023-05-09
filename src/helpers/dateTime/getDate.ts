import { IDateFormat } from "@/types/interfaces";
import { Language, Numbers } from "@/types/enums";

import useTimestamp from "./stamp";
import RegExp from "@/helpers/regExp";

export const GetDate = (date: string, lang: Language = Language.Russian, onlyDate = false): IDateFormat => {
    const dateFormat = Number(date);
    const timestamp = useTimestamp(null, lang, dateFormat);

    if(onlyDate) {
        const regExp = lang === Language.English ? RegExp.TimeRegisteredEng : RegExp.TimeRegisteredRu;
        timestamp.date = timestamp.date.match(regExp)![0];
    }

    return timestamp;
};

export const  GetBetweenDateString = (date: Date): string => {
   const today: Date = new Date();
   today.setHours(0, 0, 0, 0);

   const yesterday = new Date(today);
   yesterday.setDate(yesterday.getDate() - 1);

   const weekAgo =  new Date(today);
   weekAgo.setDate(today.getDate() - 7);
  if (date) {
    switch(true) {
      case date >= today:
        return "Сегодня";
      case date >= yesterday:
        return "Вчера";
      case date >= weekAgo:
        const dayAgo = Math.floor((Number(today) - Number(date)) / Numbers.MillisecondsInDay + 1);
        return `${dayAgo} ${GetDayStringFormat(dayAgo)} назад`;
      default:
        return date.toLocaleDateString();
    }
  }
  return ""
}

// Get the word "день", "дня" or "дней" depending on the number.
export const GetDayStringFormat = (num: number): string => {
  if (num === 1) return "день";
  else if (num >= 2 && num <= 4) return "дня";

  return "дней";
}