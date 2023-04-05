import { getAuth, User } from "firebase/auth";

import store from "@/store";
// import router from "@/router";

import { notify } from "@kyvg/vue3-notification";

import { GetUserInfo } from "@/database";

export default async function refreshUserInfo(): Promise<any> {
  store.dispatch("setLoadingStatus", true);

  await getAuth().onAuthStateChanged((user) => {
    if (user) {
      getAuth().currentUser?.getIdToken(true).then(async(newToken) => {
        store.dispatch('setUserToken', newToken)
        store.dispatch("setCurrentUser", user);
        await GetUserInfo();
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