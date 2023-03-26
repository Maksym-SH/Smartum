import useTimeStamp from "./timeStamp";

import { IFormatDate } from "@/interfaces";
import { ELanguage } from "@/enums";

import RegExp from "@/helpers/regExp";

const GetDate = (date: string, lang = ELanguage.Russian, onlyDate = false): IFormatDate => {
    const dateFormat = Number(date);
    const timeStamp = useTimeStamp(0, lang, dateFormat);

    if(onlyDate) {
        const regExp = lang === ELanguage.English ? RegExp.TimeRegisteredEng : RegExp.TimeRegisteredRu;
        timeStamp.date = timeStamp.date.match(regExp)![0];
    }

    return timeStamp;
};

export default GetDate;
