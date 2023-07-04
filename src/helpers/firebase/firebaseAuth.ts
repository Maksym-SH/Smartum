import type { EmailAuthCredential, User, UserCredential } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { GenerateColorHexFormat } from "@/helpers/methods";

import * as auth from "firebase/auth";
import i18n from "@/i18n";
import ShowErrorMessage from "./firebaseErrorMessage";
import router from "@/router";
import notificationContent from "@/composables/useNotificationContent";
import useStores from "@/composables/useStores";

import { NotificationType, Route } from "@/types/enums";
import type { ErrorCode } from "@/types/types";
import type { INotification } from "@/types/interfaces/components";
import type * as authType from "@/types/interfaces/user";

export default function firebaseAuth(): authType.IUserAuth {
  const { t } = i18n.global;

  const { commonStore, userStore, notificationStore, configurationStore } = useStores();

  const useAuth = {
    signUp: (userData: authType.IUserReg, validate: boolean): void => {
      if (!validate) return;

      commonStore.setLoadingStatus(true);

      auth
        .createUserWithEmailAndPassword(auth.getAuth(), userData.email, userData.password)
        .then(async (response) => {
          const responseUser: authType.IUserResponse = response.user;
          const currentUser = auth.getAuth().currentUser;

          if (responseUser.accessToken)
            localStorage.setItem("smartumToken", responseUser.accessToken);

          if (currentUser) {
            userStore.createUserProfile({
              uid: currentUser.uid,
              firstName: userData.firstName,
              lastName: userData.lastName,
              avatarParams: {
                url: "",
                bgAvatar: GenerateColorHexFormat("light"),
              },
            });

            const notification: INotification<Date> = notificationContent(
              NotificationType.WELCOME_TEXT
            );
            await notificationStore
              .createNotificationList(notification, currentUser.uid)
              .then((notification) => {
                notificationStore.setAllNotification([notification]);
              });

            // Create user configuration field in database.
            configurationStore
              .createUserConfiguration(currentUser.uid)
              .then(() => configurationStore.getUserConfiguration(currentUser.uid));

            notify({
              title: t("notify.authSuccess.title"),
              type: "success",
            });

            userStore.setCurrentUser(currentUser);
            router.push({ name: Route.NOTIFICATIONS });
          }
        })
        .catch((error: ErrorCode): void => ShowErrorMessage(error))
        .finally((): void => commonStore.setLoadingStatus(false));
    },

    signIn: (userData: authType.IUserLogin, validate: boolean): void => {
      if (!validate) return;

      commonStore.setLoadingStatus(true);
      auth
        .signInWithEmailAndPassword(auth.getAuth(), userData.email, userData.password)
        .then((response) => {
          const user: authType.IUserResponse = response.user;

          if (user.accessToken) localStorage.setItem("smartumToken", user.accessToken);

          userStore.setCurrentUser(auth.getAuth().currentUser ?? {});
          notify({
            title: t("notify.authSuccess.title"),
            type: "success",
          });
          router.push({ name: Route.HOME });
        })
        .catch((error): void => ShowErrorMessage(error))
        .finally((): void => commonStore.setLoadingStatus(false));
    },
    reauthorization: (
      userInfo: User,
      credential: EmailAuthCredential
    ): Promise<UserCredential> => {
      commonStore.setLoadingStatus(true);

      return new Promise((resolve, reject) => {
        auth
          .reauthenticateWithCredential(userInfo, credential)
          .then((response: UserCredential) => resolve(response))
          .catch((error: ErrorCode): void => {
            ShowErrorMessage(error);
            reject(error);
          })
          .finally(() => commonStore.setLoadingStatus(false));
      });
    },
  };

  return useAuth;
}
