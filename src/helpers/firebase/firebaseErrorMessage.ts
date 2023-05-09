import { ErrorCode } from "@/types/types";
import { notify } from "@kyvg/vue3-notification";

const ShowErrorMessage = (errorCode: ErrorCode): void => {
  let errorText = "";
  if (typeof errorCode === "object") {
    switch (errorCode.code) {
      case "auth/internal-error":
        errorText = "Произошла непредвиденная ошибка, повторите попытку позже!"
        break;
      case "auth/too-many-requests":
        errorText = "Слишком много попыток, повторите попытку позже!"
        break;
      case "auth/wrong-password":
        errorText = "Пароль не верный, повторите попытку!"
        break;
      case "auth/invalid-email":
        errorText = "Введённая почта невалидна!";
        break;
      case "auth/email-already-in-use":
        errorText = "Введённая почта уже используется!";
        break;
      case "auth/user-not-found":
        errorText = "Такого пользователя не существует!";
        break;
      default:
        errorText = errorCode.code;
        break;
    }
  } else errorText = errorCode;

  notify({
    title: "Не удалось обработать действие",
    text: errorText,
    type: "error",
  });
};

export default ShowErrorMessage;