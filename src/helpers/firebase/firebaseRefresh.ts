import { getAuth, User } from "firebase/auth";

import store from "@/store";
// import router from "@/router";

import { notify } from "@kyvg/vue3-notification";

import ResolveImageURL from "@/helpers/file/photo";

export default async function refreshUserInfo(): Promise<any> {
  store.dispatch("setLoadingStatus", true);

  await getAuth().onAuthStateChanged((user) => {
    if (user) {
      getAuth().currentUser?.getIdToken(true).then((newToken) => {
        store.dispatch('setUserToken', newToken)
        const currentUser: User = user;
        store.dispatch("setCurrentUser", user);
        ResolveImageURL(currentUser.photoURL, "setUserPhoto");
      })
      .catch((error) => {
        notify({
          title: error
       })
      });
    } else {
      store.dispatch("userLogout");
    }
    store.dispatch("setLoadingStatus", false);
  });
}