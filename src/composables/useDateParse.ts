import { IServerDate } from "@/interfaces";
import { computed } from "vue";
import { GetBetweenDateString } from '@/helpers/dateTime/getDate';
import { Numbers, Language } from "@/enums";

import useTimestamp from '@/helpers/dateTime/stamp';

const useDateParseToString = (date: Date | IServerDate): string => {
  const dateSent = computed((): string => {
    const dateParam = (date as IServerDate).seconds;
  
    const recievedDate = dateParam ? new Date(Number(dateParam) * Numbers.Second) : date;
  
    const dateBetween: string = GetBetweenDateString(recievedDate as Date);
    const time: string = useTimestamp(recievedDate as Date, Language.Russian, (date as IServerDate).seconds).time;

    return `${ dateBetween } в ${ time }` // 'Сегодня в 22:00:00' as an example.
  })

  return dateSent.value;
}

export default useDateParseToString;