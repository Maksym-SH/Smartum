import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import store from "@/store";
import router from "@/router";
import { notify } from "@kyvg/vue3-notification";

const firebaseReset = (email: string) => {
  if (!email) return;

  store.dispatch("setLoadingStatus", true);

  sendPasswordResetEmail(getAuth(), email)
    .then(() => {
      notify({
        title: "Успешно!",
        text: "Сообщение восстановления пароля отправлено вам на почту!",
        type: "success",
      });
      router.push({ name: "SignIn" });
    })
    .catch((error) => {
      let errorTextNotify = "";
      switch (error.code) {
        case "auth/invalid-email":
          errorTextNotify = "Введенная почта невалидна!";
          break;
        case "auth/user-not-found":
          errorTextNotify = "Пользователь не найден!";
          break;
        case "auth/too-many-requests":
          errorTextNotify = "Слишком много запросов, повторите попытку позже!";
          break;
      }
      if (error && errorTextNotify)
        notify({
          title: "Внимание!",
          text: errorTextNotify,
          type: "error",
          ignoreDuplicates: true,
        });
    })
    .finally(() => store.dispatch("setLoadingStatus", false));
};

export default firebaseReset;
