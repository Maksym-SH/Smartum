import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { notify } from "@kyvg/vue3-notification";
import { IUserLogin, IUserReg } from "@/interfaces/index";
import { ErrorCode } from "@/types/index";
import store from "@/store";
import router from "@/router";

const firebaseAuth = () => {
  const useAuth = {
    signUp: (userData: IUserReg, validate: boolean) => {
      if (!validate) return;
      console.log(validate);
      store.dispatch("setLoadingStatus", true);

      createUserWithEmailAndPassword(
        getAuth(),
        userData.email,
        userData.password
      )
        .then(async (response) => {
          const responseUser: any = response.user;
          const currentUser = getAuth().currentUser;
          localStorage.setItem("smartumToken", responseUser.accessToken);
          store.dispatch("setUserToken", responseUser.accessToken);

          if (currentUser) {
            updateProfile(currentUser, {
              displayName: `${userData.firstName} ${userData.lastName}`,
            });
          }
          notify({
            title: "Вы успешно вошли в аккаунт.",
            type: "success",
          });

          store.dispatch("setCurrentUser", getAuth().currentUser);
          router.push({ name: "Home" });
        })
        .catch((error) => showErrorMessage(error))
        .finally(() => store.dispatch("setLoadingStatus", false));
    },

    signIn: (userData: IUserLogin, validate: boolean) => {
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
        .catch((error) => showErrorMessage(error))
        .finally(() => store.dispatch("setLoadingStatus", false));
    },
  };

  // Show notification
  const showErrorMessage = (errorCode: ErrorCode) => {
    let errorText = "";
    if (typeof errorCode === "object") {
      switch (errorCode.code) {
        case "auth/invalid-email":
          errorText = "Введённая почта невалидна!";
          break;
        case "auth/email-already-in-use":
          errorText = "Введённая почта уже используется!";
          break;
        case "auth/wrong-password":
          errorText =
            "Введён неправильный логин или пароль, повторите попытку!";
          break;
        case "auth/user-not-found":
          errorText = "Такого пользователя не существует!";
          break;
        default:
          errorText = errorCode.code;
          break;
      }
    } else errorText = errorCode;

    notify({
      title: errorText,
      type: "error",
    });
  };

  return useAuth;
};

export default firebaseAuth;
