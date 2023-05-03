import { sendEmailVerification, User, getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { ErrorCode } from "@/types";
import useNewNotificationContent from "@/composables/useNotificationContent";
import ShowErrorMessage from "./firebaseErrorMessage";
import { NotificationType, Numbers } from "@/enums";
import store from "@/store";

const VerifyEmail = (userInfo: User): void => {
  sendEmailVerification(userInfo)
  .then(() => {
    notify({
      title: "Успешно!",
      text: "Сообщение для подтверждения было отправлено вам на электронный адрес!"
    })
    store.commit("setNewNotification", useNewNotificationContent(NotificationType.EmailConfirm));

    // Check email verify real time.
    const checkForVerifiedInterval: ReturnType<typeof setInterval> = setInterval(() => {
      getAuth().currentUser?.reload()
        .then(() => {
          if (getAuth().currentUser && getAuth().currentUser?.emailVerified) {
            const emailVerified = getAuth().currentUser?.emailVerified;

            store.commit("setCurrentUser", {
              ...getAuth().currentUser,
              emailVerified 
            })
            clearInterval(checkForVerifiedInterval)
          }
        })
    }, Numbers.Second)
  })
  .catch((error: ErrorCode) => ShowErrorMessage(error))
}

export default VerifyEmail;