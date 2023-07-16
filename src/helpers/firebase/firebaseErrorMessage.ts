import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";

import type { ErrorCode } from "@/types";

export default function ShowErrorMessage(errorCode: ErrorCode): void {
  const { t } = i18n.global;

  let errorText = "";
  if (typeof errorCode === "object") {
    switch (errorCode.code) {
      case "auth/internal-error":
        errorText = t("notify.errors.internal");
        break;
      case "auth/too-many-requests":
        errorText = t("notify.errors.tooManyRequests");
        break;
      case "auth/wrong-password":
        errorText = t("notify.errors.wrongPassword");
        break;
      case "auth/invalid-email":
        errorText = t("notify.errors.invalidEmail");
        break;
      case "auth/email-already-in-use":
        errorText = t("notify.errors.emailAlreadyUse");
        break;
      case "auth/user-not-found":
        errorText = t("notify.errors.userDoesNotExist");
        break;
      default:
        errorText = errorCode.code;
        break;
    }
  } else {
    errorText = errorCode;
  }

  notify({
    title: t("notify.errors.title"),
    text: errorText,
    type: "error",
  });
}
