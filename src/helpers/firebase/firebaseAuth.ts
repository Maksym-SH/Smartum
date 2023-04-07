import store from "@/store";
import router from "@/router";
import ShowErrorMessage from "./firebaseErrorMessage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { IUserAuth, IUserLogin, IUserReg, IUserResponse } from "@/interfaces";
import { ErrorCode } from "@/types";

const firebaseAuth = (): IUserAuth => {
  const useAuth = {
    signUp: (userData: IUserReg, validate: boolean): void => {
      if (!validate) return;

      store.dispatch("setLoadingStatus", true);

      createUserWithEmailAndPassword(getAuth(), userData.email, userData.password)
        .then(async (response) => {
          const responseUser: IUserResponse = response.user;
          const currentUser = getAuth().currentUser;
         
          if (responseUser.accessToken) {
            localStorage.setItem("smartumToken", responseUser.accessToken);
            store.dispatch("setUserToken", responseUser.accessToken);
          }

          if (currentUser) {
            store.dispatch("createUser", {
              uid: currentUser.uid,
              firstName: userData.firstName,
              lastName: userData.lastName
            })
          }

          notify({
            title: "Вы успешно вошли в аккаунт.",
            type: "success",
          });

          store.dispatch("setCurrentUser", getAuth().currentUser);
          router.push({ name: "Home" });
        })
        .catch((error: ErrorCode): void => ShowErrorMessage(error))
        .finally((): Promise<any> => store.dispatch("setLoadingStatus", false));
    },

    signIn: (userData: IUserLogin, validate: boolean): void => {
      if (!validate) return;

      store.dispatch("setLoadingStatus", true);
      signInWithEmailAndPassword(getAuth(), userData.email, userData.password)
        .then((response) => {
          const user: IUserResponse = response.user;

          if(user.accessToken) {
            localStorage.setItem("smartumToken", user.accessToken);
            store.dispatch("setUserToken", user.accessToken);
          }

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
