import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

import { notify } from "@kyvg/vue3-notification";
import { ErrorCode, User } from "@/interfaces/common";
import store from "@/store";

const firebaseAuth = () => {
  const useAuth = {
    signUp: (userData: User) => {
      if(userData.password.length < 8) return;
        if(userData.password !== userData.repeatPassword) {

          showErrorMessage("Ваши пароли отличаются, повторите попытку.")
          userData.password = userData.repeatPassword = "";
          return;
        }

        store.dispatch('setLoadingStatus', true)

        createUserWithEmailAndPassword(getAuth(), userData.email, userData.password)
          .then((response) => {
            const user: any = response.user;
            store.dispatch('setUserToken', user.accessToken);

            notify({
              title: "Вы успешно вошли в аккаунт.",
              type:"success"
            })
          })
          .catch((error) => showErrorMessage(error))
          .finally(() => store.dispatch('setLoadingStatus', false))
      }, 

    signIn: (userData: User) => {
      if(userData.password.length < 8) return;
      
      store.dispatch("setLoadingStatus", true);
      signInWithEmailAndPassword(getAuth(), userData.email, userData.password)
        .then((response) => {
          const user: any = response.user;
          store.dispatch("setUserToken", user.accessToken);
          console.log(user)
          notify({
            title: "Вы успешно вошли в аккаунт.",
            type:"success"
          })
        })
        .catch((error) => showErrorMessage(error))
        .finally(() => store.dispatch('setLoadingStatus', false));
    },
  }

  // Show notification
  const showErrorMessage = (errorCode: ErrorCode) => {
    let errorText = "";
    if (typeof errorCode === 'object') {
      switch(errorCode.code) {
        case "auth/invalid-email": 
          errorText = "Введённая почта невалидна!";
          break;
        case "auth/email-already-in-use":
          errorText = "Введённая почта уже используется!";
          break;
        case "auth/wrong-password": 
          errorText = "Введённый пароль неправильный, повторите попытку!";
          break
        case "auth/user-not-found": 
          errorText = "Такого пользователя не существует!";
          break;
        case "auth/wrong-password": 
          errorText = "Неправильный логин или пароль!"
        default: errorText = errorCode.code;
          break;
      }
    }
    else errorText = errorCode;
    notify({
      title: errorText,
      type:"error"
    })
  };

  return useAuth
}

export default firebaseAuth;