import { notify } from "@kyvg/vue3-notification";
import { /* FileFormat, */ Numbers } from "@/enums";
import { FileType } from "@/types";

/* const Format = [ 
  FileFormat.APP_GZIP, 
  FileFormat.APP_XML, 
  FileFormat.APP_XPHP, 
  FileFormat.App_ES, 
  FileFormat.App_JS, 
  FileFormat.App_JSON, 
  FileFormat.App_XJS, 
  FileFormat.App_ZIP, 
  FileFormat.Text_XML, 
  FileFormat.Text_XPython
]; */

const fileValidate = (file: File, needType: FileType): boolean => {
  const currentType: string = file.type.toLowerCase();

  if(needType == "image") {
    if(file.size < Numbers.ImageSize && currentType.startsWith("image")) {
      return true;
    }
  }

  notify({
    title: "Выбранный файл не поддерживается либо имеет слишком большой размер.",
    type: "error"
  })
  return false;
}

export default fileValidate;