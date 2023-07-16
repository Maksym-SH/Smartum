import { updatePassword } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";
import ShowErrorMessage from "./firebaseErrorMessage";
import useStores from "@/composables/useStores";

import type { User } from "firebase/auth";

export function PasswordUpdate(user: User, password: string): Promise<void> {
  const { t } = i18n.global;

  const { commonStore } = useStores();

  commonStore.setLoadingStatus(true);
  return new Promise((resolve, reject) => {
    updatePassword(user, password)
      .then(() => {
        notify({
          title: t("notify.passwordChanged.title"),
        });
        resolve();
      })
      .catch((error) => {
        ShowErrorMessage(error);
        reject(error);
      })
      .finally(() => commonStore.setLoadingStatus(false));
  });
}
