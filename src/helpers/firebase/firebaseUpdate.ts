import { User, updatePassword } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";

import useStores from "@/composables/useStores";
import ShowErrorMessage from "./firebaseErrorMessage";

export const PasswordUpdate = (user: User, password: string): Promise<void> => {
  const { commonStore } = useStores();

  commonStore.setLoadingStatus(true);
  return new Promise((resolve, reject) => {
    updatePassword(user, password)
    .then(() => {
      notify({
        title:"Ваш пароль был изменен!"
      })
      resolve();
    })
    .catch((error) => {
      ShowErrorMessage(error);
      reject();
    })
    .finally(() => commonStore.setLoadingStatus(false))
  })
}

/* export const EmailUpdate = (user: User, email: string): Promise<any> => {
  store.commit("setLoadingStatus", true);

  return new Promise((resolve, reject) => {
    updateEmail(user, email).then(() => {
      notify({
        title: "Ваш электронный адрес был изменен!"
      })
      resolve("resolve");
    }).catch((error) => { 
      ShowErrorMessage(error);
      reject(error)
    })
    .finally(() => store.dispatch('setLoadingStatus', false))
  })
} */
