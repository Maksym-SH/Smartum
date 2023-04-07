import { User, updatePassword, updateProfile } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import store from "@/store";
import refreshUserInfo from "./firebaseRefresh";
import ShowErrorMessage from "./firebaseErrorMessage";

export const PasswordUpdate = (user: User, password: string): Promise<void> => {
  store.dispatch("setLoadingStatus", true);
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
    .finally(() => store.dispatch('setLoadingStatus', false))
  })
}

/* export const EmailUpdate = (user: User, email: string): Promise<any> => {
  store.dispatch("setLoadingStatus", true);

  return new Promise((resolve, reject) => {
    updateEmail(user, email).then(() => {
      notify({
        title: "Ваш электронный адресс был изменен!"
      })
      resolve("resolve");
    }).catch((error) => { 
      ShowErrorMessage(error);
      reject(error)
    })
    .finally(() => store.dispatch('setLoadingStatus', false))
  })
} */

export const ProfileUpdate = (user: User, displayName: string, photoURL?: string): void => {
  store.dispatch("setLoadingStatus", true);

  updateProfile(user, { displayName, photoURL })
  .then(() => refreshUserInfo())
  .catch((error) => ShowErrorMessage(error))
  .finally(() => store.dispatch("setLoadingStatus", false));
}