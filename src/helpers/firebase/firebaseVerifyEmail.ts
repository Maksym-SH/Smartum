import type { User } from "firebase/auth";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";

import ShowErrorMessage from "./firebaseErrorMessage";
import i18n from "@/i18n";
import useNewNotificationContent from "@/composables/useNotificationContent";
import useStores from "@/composables/useStores";

import type { ErrorCode } from "@/types/types";
import { NotificationType, Numbers } from "@/types/enums";

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
          NotificationType.EMAIL_CONFIRM,
          userInfo.email as string
        );

        notificationStore.setNewNotification(notification);

        // Check email verify real time.
        const checkForVerifiedInterval: ReturnType<typeof setInterval> = setInterval(() => {
          getAuth()
            .currentUser?.reload()
            .then(() => {
              const emailVerified = getAuth().currentUser?.emailVerified;

              if (getAuth().currentUser && emailVerified) {
                const unicID = getAuth().currentUser?.uid;

                userStore.setCurrentUser({
                  ...getAuth().currentUser,
                  emailVerified,
                });

                if (unicID) {
                  // Add to search users list new user after verify email.
                  const userInfo = {
                    ...userStore.userInfo,
                    uid: unicID,
                  };
                  userStore.updateUsersList(userInfo);

                  // Get notifications for real-time updates.
                  notificationStore.getAllNotifications(unicID, true);
                }

                clearInterval(checkForVerifiedInterval);
              }
            });
        }, Numbers.SECOND);
      })
      .catch((error: ErrorCode) => ShowErrorMessage(error));
  } else {
    notify({
      text: t("notify.emailConfirmed.title"),
      type: "success",
    });
  }
}
