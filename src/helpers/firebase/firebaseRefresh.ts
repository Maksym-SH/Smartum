import { getAuth, User } from "firebase/auth";

import store from "@/store";
// import router from "@/router";

import { notify } from "@kyvg/vue3-notification";

import ResolveImageURL from "@/helpers/file/photo";

export default async function refreshUserInfo(): Promise<any> {
  store.dispatch("setLoadingStatus", true);

  await getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      const currentUser: User = user;
      user.getIdToken(true).then((newToken) => {
        currentUser.getIdTokenResult().then((result) => {
          const currentTime: number = Math.floor(Date.now() / 1000);
          const expiredTime: number = Number(result.claims.exp);

          if(currentTime > expiredTime) {
            localStorage.setItem('smartumToken', currentUser.refreshToken);
          }
          else {
            store.dispatch('setUserToken', newToken)
            ResolveImageURL(currentUser.photoURL, "setUserPhoto");
            store.dispatch("setCurrentUser", user);
          }
        })
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
