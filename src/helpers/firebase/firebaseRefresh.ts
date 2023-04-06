import { getAuth, User } from "firebase/auth";

import store from "@/store";
// import router from "@/router";

import { notify } from "@kyvg/vue3-notification";

export default async function refreshUserInfo(): Promise<any> {
  store.dispatch("setLoadingStatus", true);

  await getAuth().onAuthStateChanged((user) => {
    if (user) {
      getAuth().currentUser?.getIdToken(true).then(async(newToken) => {
        store.dispatch('setUserToken', newToken)
        store.dispatch("setCurrentUser", user);
        store.dispatch("getUserInfo");
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