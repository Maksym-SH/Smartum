import { getAuth, User } from "firebase/auth";

import store from "@/store";
// import router from "@/router";

import { notify } from "@kyvg/vue3-notification";

import ResolveImageURL from "@/helpers/file/photo";

export default async function refreshUserInfo(): Promise<any> {
  store.dispatch("setLoadingStatus", true);

  await getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      user.getIdToken(true).then((newToken) => {
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
      if (getAuth().currentUser) store.dispatch("userLogout");
    }
    store.dispatch("setLoadingStatus", false);
  });
}
