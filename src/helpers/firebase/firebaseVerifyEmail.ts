import type { User } from "firebase/auth";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import type { ErrorCode } from "@/types/types";
import { NotificationType, Numbers } from "@/types/enums";

import i18n from "@/i18n";
import useNewNotificationContent from "@/composables/useNotificationContent";
import ShowErrorMessage from "./firebaseErrorMessage";
import useStores from "@/composables/useStores";

export default function VerifyEmail(userInfo: User): void {
  const { t } = i18n.global;

  const { notificationStore, userStore } = useStores();

  if (!(userStore.currentUser as User).emailVerified) {
    // Email not verified.
    sendEmailVerification(userInfo)
      .then(() => {
        notify({
          title: t("common.success"),
          text: t("notify.confirmEmail.text"),
        });
        const notification = useNewNotificationContent(
          NotificationType.EmailConfirm,
          userInfo.email as string
        );

        notificationStore.setNewNotification(notification);

        // Check email verify real time.
        const checkForVerifiedInterval: ReturnType<typeof setInterval> = setInterval(
          () => {
            getAuth()
              .currentUser?.reload()
              .then(() => {
                if (getAuth().currentUser && getAuth().currentUser?.emailVerified) {
                  const emailVerified = getAuth().currentUser?.emailVerified;

                  userStore.setCurrentUser({
                    ...getAuth().currentUser,
                    emailVerified,
                  });
                  // Add to search users list new user after verify email.
                  const userInfo = {
                    ...userStore.userInfo,
                    uid: getAuth().currentUser?.uid,
                  };
                  userStore.updateUsersList(userInfo);

                  clearInterval(checkForVerifiedInterval);
                }
              });
          },
          Numbers.Second
        );
      })
      .catch((error: ErrorCode) => ShowErrorMessage(error));
  } else {
    notify({
      text: t("notify.emailConfirmed.title"),
      type: "success",
    });
  }
}
