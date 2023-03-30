import store from "@/store";
import { sendEmailVerification, User } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";

const verifyEmail = (userInfo: User): void => {

  store.dispatch("setLoadingStatus", true);
  sendEmailVerification(userInfo).then(() => {
    notify({
      title: "Успешно!",
      text: "Сообщение для подтверждения было отправлено вам на почту!"
    })
  }).catch(() => {
    notify({
      title: "Ошибка",
      text: "Во время выполнения операции что-то пошло не так, повторите попытку позже",
      type: "error"
    })
  }).finally(() => store.dispatch("setLoadingStatus", false));
}

export default verifyEmail;