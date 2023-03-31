import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import store from "@/store";
import router from "@/router";

import { notify } from "@kyvg/vue3-notification";

import { IUserAuth, IUserLogin, IUserReg } from "@/interfaces";

import ShowErrorMessage from "./firebaseErrorMessage";


const firebaseAuth = (): IUserAuth => {
  const useAuth = {
    signUp: (userData: IUserReg, validate: boolean): void => {
      if (!validate) return;

      store.dispatch("setLoadingStatus", true);

      createUserWithEmailAndPassword(getAuth(), userData.email, userData.password)
        .then(async (response) => {
          const responseUser: any = response.user;
          const currentUser = getAuth().currentUser;

          localStorage.setItem("smartumToken", responseUser.accessToken);
          store.dispatch("setUserToken", responseUser.accessToken);

          if (currentUser) {
            updateProfile(currentUser, {
              displayName: `${ userData.firstName } ${ userData.lastName }`,
            });
          }
          notify({
            title: "Вы успешно вошли в аккаунт.",
            type: "success",
          });

          store.dispatch("setCurrentUser", getAuth().currentUser);
          router.push({ name: "Home" });
        })
        .catch((error): void => ShowErrorMessage(error))
        .finally((): Promise<any> => store.dispatch("setLoadingStatus", false));
    },

    signIn: (userData: IUserLogin, validate: boolean): void => {
      if (!validate) return;

      store.dispatch("setLoadingStatus", true);
      signInWithEmailAndPassword(getAuth(), userData.email, userData.password)
        .then((response) => {
          const user: any = response.user;
          localStorage.setItem("smartumToken", user.accessToken);

          store.dispatch("setUserToken", user.accessToken);
          store.dispatch("setCurrentUser", getAuth().currentUser);
          notify({
            title: "Вы успешно вошли в аккаунт.",
            type: "success",
          });
          router.push({ name: "Home" });
        })
        .catch((error): void => ShowErrorMessage(error))
        .finally((): Promise<any> => store.dispatch("setLoadingStatus", false));
    },
  };

  return useAuth;
};

export default firebaseAuth;
