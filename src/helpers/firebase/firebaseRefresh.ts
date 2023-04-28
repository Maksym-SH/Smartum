import { getAuth } from "firebase/auth";
import { ErrorCode } from "@/types";

import store from "@/store";
import ShowErrorMessage from "./firebaseErrorMessage";

export default async function refreshUserInfo(): Promise<void> {
  store.commit("setLoadingStatus", true);

  await getAuth().onAuthStateChanged((user) => {
    if (user) {
      getAuth().currentUser?.getIdToken(true).then(() => {
        store.commit("setCurrentUser", user);
        store.dispatch("getUserProfile").then(() => {
          store.dispatch("getUserConfiguration", user.uid);
        })
      })
      .catch((error: ErrorCode): void => ShowErrorMessage(error));
    } else {
      store.dispatch("userLogout");
    }
  });
}