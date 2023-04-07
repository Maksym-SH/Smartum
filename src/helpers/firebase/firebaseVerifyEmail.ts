import store from "@/store";
import { sendEmailVerification, User } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { ErrorCode } from "@/types";
import ShowErrorMessage from "./firebaseErrorMessage";

const verifyEmail = (userInfo: User): void => {
  store.dispatch("setLoadingStatus", true);

  sendEmailVerification(userInfo)
  .then(() => {
    notify({
      title: "Успешно!",
      text: "Сообщение для подтверждения было отправлено вам на почту!"
    })
  })
  .catch((error: ErrorCode) => ShowErrorMessage(error))
  .finally(() => store.dispatch("setLoadingStatus", false));
}

export default verifyEmail;