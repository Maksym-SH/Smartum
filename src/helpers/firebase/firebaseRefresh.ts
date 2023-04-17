import { getAuth } from "firebase/auth";
import store from "@/store";
// import router from "@/router";
import ShowErrorMessage from "./firebaseErrorMessage";
import { ErrorCode } from "@/types";

export default async function refreshUserInfo(): Promise<void> {
  store.commit("setLoadingStatus", true);

  await getAuth().onAuthStateChanged((user) => {
    if (user) {
      getAuth().currentUser?.getIdToken(true).then(() => {
        store.commit("setCurrentUser", user);
        store.dispatch("getUserInfo");
      })
      .catch((error: ErrorCode): void => ShowErrorMessage(error));
    } else {
      store.dispatch("userLogout");
    }
  });
}