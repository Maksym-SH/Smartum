import { getAuth, User } from "firebase/auth";

import store from "@/store";
// import router from "@/router";

// import { notify } from "@kyvg/vue3-notification";

import ResolveImageURL from "@/helpers/file/photo";

export default async function refreshUserInfo(): Promise<any> {
  store.dispatch("setLoadingStatus", true);

  await getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      const currentUser: User = user;
      // user.getIdToken(true)
      //.then((token) => {
      // localStorage.setItem('smartumToken', token);

      //  store.dispatch('setUserToken', token)
      ResolveImageURL(currentUser.photoURL, "setUserPhoto");
      store.dispatch("setCurrentUser", user);

      // })
      // .catch((error) => {
      //   notify({
      //   title: error
      //   })
      // });
    } else {
      if (getAuth().currentUser) store.dispatch("userLogout");
    }
    store.dispatch("setLoadingStatus", false);
  });
}
