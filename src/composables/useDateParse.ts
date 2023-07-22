import { computed } from "vue";
import { GetBetweenDateString } from "@/helpers/dateTime/getDate";

import i18n from "@/i18n";
import useTimestamp from "@/helpers/dateTime/stamp";

import { Language, Numbers } from "@/types/enums";
import type { IServerDate } from "@/types/interfaces";

export default function useDateParseToString(
  date: Date | IServerDate | string | null,
  lang: String = Language.ENG
): string {
  const { t } = i18n.global;

  const dateSent = computed((): string => {
    if (!date) {
      return "";
    }

    const dateParam = (date as IServerDate).seconds;

    let recievedDate = dateParam ? new Date(Number(dateParam) * Numbers.SECOND) : date;

    if (typeof date === "string") {
      recievedDate = new Date(date);
    }

    const dateBetween: string = GetBetweenDateString(recievedDate as Date);
    const time: string = useTimestamp(
      recievedDate as Date,
      lang,
      (date as IServerDate).seconds
    ).time;

    return `${dateBetween} ${t("time.at")} ${time}`; // 'Сегодня в 22:00:00' as an example.
  });

  return dateSent.value;
}
