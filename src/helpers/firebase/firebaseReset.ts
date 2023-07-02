import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import type { ErrorCode } from "@/types/types";

import i18n from "@/i18n";
import ShowErrorMessage from "./firebaseErrorMessage";
import useStores from "@/composables/useStores";
import router from "@/router";

export default function firebaseReset(email: string): void {
  const { t } = i18n.global;

  const { commonStore } = useStores();

  if (!email) return;

  commonStore.setLoadingStatus(true);

  sendPasswordResetEmail(getAuth(), email)
    .then(() => {
      notify({
        title: t("common.success"),
        text: t("notify.messageSent.text"),
        type: "success",
      });
      if (window.history.length >= 2) {
        router.go(-1); // Navigate to previous page.
      } else {
        getAuth().currentUser
          ? router.push({ name: "Profile" })
          : router.push({ name: "SignIn" });
      }
    })
    .catch((error: ErrorCode) => ShowErrorMessage(error))
    .finally(() => commonStore.setLoadingStatus(false));
}
