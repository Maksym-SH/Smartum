import { IUserStore } from "@/interfaces/index";
import { ActionContext } from "vuex";
import { getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import router from "@/router";
export default {
  state: {
    userToken: "",
    currentUser: {},
  },
  getters: {
    getUserToken(state: IUserStore): string {
      return state.userToken;
    },
    getCurrentUser(state: IUserStore): object {
      return state.currentUser;
    },
  },
  mutations: {
    SET_USER_TOKEN(state: IUserStore, token: string): void {
      state.userToken = token;
    },
    SET_CURRENT_USER(state: IUserStore, user: object): void {
      console.log(user);
      state.currentUser = user;
    },
  },
  actions: {
    setUserToken(
      { commit }: ActionContext<IUserStore, any>,
      token: string
    ): void {
      commit("SET_USER_TOKEN", token);
    },
    setCurrentUser(
      { commit }: ActionContext<IUserStore, any>,
      user: object
    ): void {
      commit("SET_CURRENT_USER", user);
    },
    userLogout({ commit }: ActionContext<IUserStore, any>): void {
      getAuth()
        .signOut()
        .then(() => {
          commit("SET_USER_TOKEN", "");
          commit("SET_CURRENT_USER", {});
          router.push({ name: "SignIn" });

          localStorage.removeItem("smartumToken");
          notify({
            text: "До скорого!",
            type: "success",
          });
        })
        .catch((error) => {
          notify({
            title: "Произошла ошибка!",
            text: error,
          });
        });
    },
  },
};
