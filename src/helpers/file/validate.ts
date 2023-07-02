import { notify } from "@kyvg/vue3-notification";
import { /* FileFormat, */ Numbers } from "@/types/enums";
import type { FileType } from "@/types/types";
import i18n from "@/i18n";

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

export default function fileValidate(file: File, needType: FileType): boolean {
  const { t } = i18n.global;

  const currentType: string = file.type.toLowerCase();

  if (needType === "image") {
    if (file.size < Numbers.ImageSize && currentType.startsWith("image")) return true;
  }

  notify({
    title: t("notify.errors.invalidFile"),
    type: "error",
  });
  return false;
}
