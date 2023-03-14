import { getAuth } from "firebase/auth";
// import { notify } from "@kyvg/vue3-notification";
import store from "@/store";
import router from "@/router";

export default async function refreshToken(): Promise<any> {
  store.dispatch("setLoadingStatus", true);

  await getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      // user.getIdToken(true)
      //.then((token) => {
      // localStorage.setItem('smartumToken', token);

      //  store.dispatch('setUserToken', token)
      store.dispatch("setCurrentUser", user);

      router.push({ name: "Home" });
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
