import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import store from "@/store";
import router from "@/router";
import { notify } from "@kyvg/vue3-notification";
import { ErrorCode } from "@/types";
import ShowErrorMessage from "./firebaseErrorMessage";

const firebaseReset = (email: string): void => {
  if (!email) return;

  store.commit("setLoadingStatus", true);

  sendPasswordResetEmail(getAuth(), email)
    .then(() => {
      notify({
        title: "Успешно!",
        text: "Сообщение восстановления пароля отправлено вам на почту!",
        type: "success",
      });
      router.push({ name: "SignIn" });
    })
    .catch((error: ErrorCode) => ShowErrorMessage(error))
    .finally(() => store.commit("setLoadingStatus", false));
};

export default firebaseReset;
