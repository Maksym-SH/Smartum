import store from "@/store";
import { sendEmailVerification, User } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { ErrorCode } from "@/types";
import ShowErrorMessage from "./firebaseErrorMessage";
import { NotifyType } from "@/enums";

const verifyEmail = (userInfo: User): void => {
  store.dispatch("setLoadingStatus", true);
  sendEmailVerification(userInfo)
  .then(() => {
    notify({
      title: "Успешно!",
      text: "Сообщение для подтверждения было отправлено вам на почту!"
    })
    store.dispatch("setNewNotification", {
      title: "Подтверждение учетной записи",
      description: `Сообщение с инструкциями для подтверждения учётной записи было выслано вам на электронный адресс ${ userInfo.email }`,
      status: "not read",
      image: process.env.BASE_URL + "notifyIcons/mail.svg",
      type: NotifyType.Default
    })
  })
  .catch((error: ErrorCode) => ShowErrorMessage(error))
  .finally(() => store.dispatch("setLoadingStatus", false));
}

export default verifyEmail;