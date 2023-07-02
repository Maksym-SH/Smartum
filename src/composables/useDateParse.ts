import { computed } from "vue";
import type { IServerDate } from "@/types/interfaces";
import { GetBetweenDateString } from "@/helpers/dateTime/getDate";
import { Numbers } from "@/types/enums";
import type { I18nLanguage } from "@/types/types";

import i18n from "@/i18n";
import useTimestamp from "@/helpers/dateTime/stamp";

export default function useDateParseToString(
  date: Date | IServerDate | string | null,
  lang: I18nLanguage = "eng"
): string {
  const { t } = i18n.global;

  const dateSent = computed((): string => {
    if (!date) return "";

    const dateParam = (date as IServerDate).seconds;

    let recievedDate = dateParam ? new Date(Number(dateParam) * Numbers.Second) : date;

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
