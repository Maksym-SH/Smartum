import type { User } from "firebase/auth";
import { updatePassword /* , updateEmail */ } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";

import ShowErrorMessage from "./firebaseErrorMessage";
import useStores from "@/composables/useStores";

export function PasswordUpdate(user: User, password: string): Promise<void> {
  const { commonStore } = useStores();

  commonStore.setLoadingStatus(true);
  return new Promise((resolve, reject) => {
    updatePassword(user, password)
      .then(() => {
        notify({
          title: "Ваш пароль был изменен!",
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

/* export function EmailUpdate(user: User, email: string): Promise<void> {
  const { commonStore } = useStores()

  commonStore.setLoadingStatus(true)
  return new Promise((resolve, reject) => {
    updateEmail(user, email).then(() => {
      notify({
        title: 'Ваш электронный адрес был изменен!',
      })
      resolve()
    }).catch((error) => {
      ShowErrorMessage(error)
      reject(error)
    }).finally(() => commonStore.setLoadingStatus(false))
  })
} */
