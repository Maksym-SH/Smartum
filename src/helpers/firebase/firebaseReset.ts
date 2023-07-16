import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";

import ShowErrorMessage from "./firebaseErrorMessage";
import i18n from "@/i18n";
import router from "@/router";
import useStores from "@/composables/useStores";

import { Route } from "@/types/enums";
import type { ErrorCode } from "@/types";

export default function firebaseReset(email: string): void {
  const { t } = i18n.global;

  const { commonStore } = useStores();

  if (!email) {
    return;
  }

  commonStore.setLoadingStatus(true);

  sendPasswordResetEmail(getAuth(), email)
    .then(() => {
      notify({
        title: t("common.success"),
        text: t("notify.messageSent.text"),
        type: "success",
      });
      if (window.history.length > 1) {
        router.go(-1); // Navigate to previous page.
      } else {
        getAuth().currentUser
          ? router.push({ name: Route.PROFILE })
          : router.push({ name: Route.SIGN_IN });
      }
    })
    .catch((error: ErrorCode) => ShowErrorMessage(error))
    .finally(() => commonStore.setLoadingStatus(false));
}
