import { getAuth } from "firebase/auth";
import store from "@/store";
// import router from "@/router";
import ShowErrorMessage from "./firebaseErrorMessage";
import { ErrorCode } from "@/types";

export default async function refreshUserInfo(): Promise<void> {
  store.dispatch("setLoadingStatus", true);

  await getAuth().onAuthStateChanged((user) => {
    if (user) {
      getAuth().currentUser?.getIdToken(true).then((newToken) => {
        store.dispatch('setUserToken', newToken);
        store.dispatch("setCurrentUser", user);
        store.dispatch("getUserInfo");
      })
      .catch((error: ErrorCode): void => ShowErrorMessage(error));
    } else {
      store.dispatch("userLogout");
    }
    store.dispatch("setLoadingStatus", false);
  });
}