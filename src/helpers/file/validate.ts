import { notify } from "@kyvg/vue3-notification";

import { /* EFileFormat, */ Numbers } from "@/enums";
import { FileType } from "@/types";


/* const Format = [ 
  EFileFormat.APP_GZIP, 
  EFileFormat.APP_XML, 
  EFileFormat.APP_XPHP, 
  EFileFormat.App_ES, 
  EFileFormat.App_JS, 
  EFileFormat.App_JSON, 
  EFileFormat.App_XJS, 
  EFileFormat.App_ZIP, 
  EFileFormat.Text_XML, 
  EFileFormat.Text_XPython
]; */



const fileValidate = (file: any, needType: FileType): boolean => {
  
  const currentType: string = file.type.toLowerCase();

  if(needType == "image") {
    if(file.size < Numbers.ImageSize && currentType.startsWith("image")) {
      return true;
    }
  }

  notify({
    title: "Выбранный файл не поддерживается.",
    type: "warn"
  })
  return false;
}

export default fileValidate;