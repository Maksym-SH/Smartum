import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  reauthenticateWithCredential, 
  EmailAuthCredential, 
  User, 
  UserCredential
} from "firebase/auth";
import store from "@/store";
import router from "@/router";
import ShowErrorMessage from "./firebaseErrorMessage";
import { notify } from "@kyvg/vue3-notification";
import { INotificationItem, IUserAuth, IUserLogin, IUserReg, IUserResponse } from "@/interfaces";
import { ErrorCode } from "@/types";
import { RandomHSLA } from "@/helpers/methods";
import notificationContent from "@/composables/useNotificationContent";
import { NotifcationType } from "@/enums";

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
            store.dispatch("createUser", {
              uid: currentUser.uid,
              firstName: userData.firstName,
              lastName: userData.lastName,
              avatarParams: {
                url: "",
                bgAvatar: RandomHSLA()
              }
            })

            const confirmEmailNotify: INotificationItem<Date> = notificationContent(NotifcationType.Welcome);
            // Create user notifications field in database.
            store.dispatch("createNotificationList", {
              unicID: currentUser.uid,
              item: confirmEmailNotify
            });
          }

          notify({
            title: "Вы успешно вошли в аккаунт.",
            type: "success",
          });

          store.commit("setCurrentUser", getAuth().currentUser);
          router.push({ name: "Home" });
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
