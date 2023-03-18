import useTimeStamp from "./timeStamp";
import { IFormatDate } from "@/interfaces/index";
import {ELanguage} from "@/enums/index";

const GetDate = (date: string, lang = ELanguage.Russian, onlyDate = false): IFormatDate => {
    const dateFormat = Number(date);
    const timeStamp = useTimeStamp(0, lang, dateFormat);

    if(onlyDate) {
        const regexp = lang === ELanguage.English ? /\w+\s\w+,\s\d+/gm : /\d+\w+.+/gm;
        timeStamp.date = timeStamp.date.match(regexp)![0];
    }

    return timeStamp;
};

export default GetDate;
