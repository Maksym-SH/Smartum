import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  reauthenticateWithCredential, 
  EmailAuthCredential, 
  User, 
  UserCredential
} from "firebase/auth";

import { 
  INotificationItem,
  IUserAuth, 
  IUserLogin, 
  IUserReg, 
  IUserResponse 
} from "@/interfaces";

import { ErrorCode } from "@/types";
import { GenerateLightColorHexFormat } from "@/helpers/methods";
import { NotificationType } from "@/enums";
import { notify } from "@kyvg/vue3-notification";

import store from "@/store";
import router from "@/router";
import ShowErrorMessage from "./firebaseErrorMessage";
import notificationContent from "@/composables/useNotificationContent";

const firebaseAuth = (): IUserAuth => {
  const useAuth = {
    signUp: (userData: IUserReg, validate: boolean): void => {
      if (!validate) return;

      store.commit("setLoadingStatus", true);

      createUserWithEmailAndPassword(getAuth(), userData.email, userData.password)
        .then(async (response) => {
          const responseUser: IUserResponse = response.user;
          const currentUser = getAuth().currentUser;
         
          if (responseUser.accessToken) {
            localStorage.setItem("smartumToken", responseUser.accessToken);
          }

          if (currentUser) {
            store.dispatch("createUserProfile", {
              uid: currentUser.uid,
              firstName: userData.firstName,
              lastName: userData.lastName,
              avatarParams: {
                url: "",
                bgAvatar: GenerateLightColorHexFormat()
              }
            })

            const confirmEmailNotify: INotificationItem<Date> = notificationContent(NotificationType.WelcomeText);
            // Create user notifications field in database.
            store.dispatch("createNotificationList", {
              unicID: currentUser.uid,
              item: confirmEmailNotify
            });
            // Create user configuration field in database.
            store.dispatch("createUserConfiguration", currentUser.uid);
          }

          notify({
            title: "Вы успешно вошли в аккаунт.",
            type: "success",
          });

          store.commit("setCurrentUser", getAuth().currentUser);
          router.push({ name: "Notifications" });
        })
        .catch((error: ErrorCode): void => ShowErrorMessage(error))
        .finally((): void => store.commit("setLoadingStatus", false));
    },

    signIn: (userData: IUserLogin, validate: boolean): void => {
      if (!validate) return;

      store.commit("setLoadingStatus", true);
      signInWithEmailAndPassword(getAuth(), userData.email, userData.password)
        .then((response) => {
          const user: IUserResponse = response.user;

          if(user.accessToken) {
            localStorage.setItem("smartumToken", user.accessToken);
          }

          store.commit("setCurrentUser", getAuth().currentUser);
          notify({
            title: "Вы успешно вошли в аккаунт.",
            type: "success",
          });
          router.push({ name: "Home" });
        })
        .catch((error): void => ShowErrorMessage(error))
        .finally((): void => store.commit("setLoadingStatus", false));
    },
    reauthorization:(userInfo: User, credential: EmailAuthCredential): Promise<UserCredential> =>  {
      store.commit("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        reauthenticateWithCredential(userInfo, credential)
        .then((response: UserCredential) => resolve(response))
        .catch((error: ErrorCode): void => {
          ShowErrorMessage(error);
          reject(error);
        })  
        .finally(() => store.commit("setLoadingStatus", false));
      })
    }
  };

  return useAuth;
};

export default firebaseAuth;
