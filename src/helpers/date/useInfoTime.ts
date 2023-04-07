import { IDateFormat } from "@/interfaces";
import { Language } from "@/enums";
import useTimestamp from "./timestamp";
import RegExp from "@/helpers/regExp";

const GetDate = (date: string, lang: Language = Language.Russian, onlyDate = false): IDateFormat => {
    const dateFormat = Number(date);
    const timestamp = useTimestamp(null, lang, dateFormat);

    if(onlyDate) {
        const regExp = lang === Language.English ? RegExp.TimeRegisteredEng : RegExp.TimeRegisteredRu;
        timestamp.date = timestamp.date.match(regExp)![0];
    }

    return timestamp;
};

export default GetDate;
