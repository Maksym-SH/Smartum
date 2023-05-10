import { sendEmailVerification, User, getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { ErrorCode } from "@/types/types";
import useNewNotificationContent from "@/composables/useNotificationContent";
import ShowErrorMessage from "./firebaseErrorMessage";
import { NotificationType, Numbers } from "@/types/enums";

import useStores from "@/composables/useStores";

const VerifyEmail = (userInfo: User): void => {
  const { notificationStore, userStore } = useStores();

  sendEmailVerification(userInfo)
    .then(() => {
      notify({
        title: "Успешно!",
        text: "Сообщение для подтверждения было отправлено вам на электронный адрес!",
      });
      const notification = useNewNotificationContent(
        NotificationType.EmailConfirm,
        userInfo.email as string
      );

      notificationStore.setNewNotification(notification);

      // Check email verify real time.
      const checkForVerifiedInterval: ReturnType<typeof setInterval> =
        setInterval(() => {
          getAuth()
            .currentUser?.reload()
            .then(() => {
              if (
                getAuth().currentUser &&
                getAuth().currentUser?.emailVerified
              ) {
                const emailVerified = getAuth().currentUser?.emailVerified;

                userStore.setCurrentUser({
                  ...getAuth().currentUser,
                  emailVerified,
                });

                clearInterval(checkForVerifiedInterval);
              }
            });
        }, Numbers.Second);
    })
    .catch((error: ErrorCode) => ShowErrorMessage(error));
};

export default VerifyEmail;
