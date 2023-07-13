import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";

import { Numbers } from "@/types/enums";
import type { FileType } from "@/types/types";

export default function fileValidate(file: File, needType: FileType): boolean {
  const { t } = i18n.global;

  const currentType: string = file.type.toLowerCase();

  if (needType === "image") {
    if (file.size < Numbers.IMAGE_SIZE && currentType.startsWith("image")) {
      return true;
    }
  }

  notify({
    title: t("notify.errors.invalidFile"),
    type: "error",
  });
  return false;
}
