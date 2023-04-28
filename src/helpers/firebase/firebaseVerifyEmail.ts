import { sendEmailVerification, User } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { ErrorCode } from "@/types";
import useNewNotificationContent from "@/composables/useNotificationContent";
import ShowErrorMessage from "./firebaseErrorMessage";
import { NotificationType } from "@/enums";
import store from "@/store";

const VerifyEmail = (userInfo: User): void => {
  sendEmailVerification(userInfo)
  .then(() => {
    notify({
      title: "Успешно!",
      text: "Сообщение для подтверждения было отправлено вам на электронный адрес!"
    })
    store.commit("setNewNotification", useNewNotificationContent(NotificationType.EmailConfirm));
  })
  .catch((error: ErrorCode) => ShowErrorMessage(error))
}

export default VerifyEmail;