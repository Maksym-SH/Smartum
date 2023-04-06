import useTimeStamp from "./timeStamp";

import { IFormatDate } from "@/interfaces";
import { Language } from "@/enums";

import RegExp from "@/helpers/regExp";

const GetDate = (date: string, lang = Language.Russian, onlyDate = false): IFormatDate => {
    const dateFormat = Number(date);
    const timeStamp = useTimeStamp(null, lang, dateFormat);

    if(onlyDate) {
        const regExp = lang === Language.English ? RegExp.TimeRegisteredEng : RegExp.TimeRegisteredRu;
        timeStamp.date = timeStamp.date.match(regExp)![0];
    }

    return timeStamp;
};

export default GetDate;
