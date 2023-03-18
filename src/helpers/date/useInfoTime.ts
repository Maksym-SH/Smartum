import useTimeStamp from "./timeStamp";
import { IFormatDate } from "@/interfaces/index";

const GetDate = (date: string, lang = "ru", onlyDate = false): IFormatDate => {
    const dateFormat = Number(date);
    const timeStamp = useTimeStamp(0, lang, dateFormat);

    if(onlyDate) {
        const regexp = lang === "eng" ? /\w+\s\w+,\s\d+/gm : /\d+\w+.+/gm;
        timeStamp.date = timeStamp.date.match(regexp)![0];
    }
        
    return timeStamp;
};

export default GetDate;
