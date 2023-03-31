import { ActionContext } from "vuex";
import router from "@/router";

import { getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";

import { IUserStore } from "@/interfaces/index";

export default {
  state: {
    userToken: "",
    currentUser: {},
    userPhoto: "",
    openConfirmPopup: false
  },
  getters: {
    getUserToken(state: IUserStore): string {
      return state.userToken;
    },
    getCurrentUser(state: IUserStore): object {
      return state.currentUser;
    },
    getUserPhoto(state: IUserStore): string {
      return state.userPhoto;
    },
    getConfirmPopup(state: IUserStore): boolean {
      return state.openConfirmPopup;
    }
  },
  mutations: {
    SET_USER_TOKEN(state: IUserStore, token: string): void {
      state.userToken = token;
    },
    SET_CURRENT_USER(state: IUserStore, user: object): void {
      state.currentUser = user;
    },
    SET_USER_PHOTO(state: IUserStore, photo: string): void {
      state.userPhoto = photo;
    },
    SET_CONFIRM_POPUP(state:IUserStore, show: boolean): void {
      state.openConfirmPopup = show;
    }
  },
  actions: {
    setUserToken({ commit }: ActionContext<IUserStore, any>, token: string): void {
      commit("SET_USER_TOKEN", token);
    },
    setCurrentUser({ commit }: ActionContext<IUserStore, any>, user: any): void {
      commit("SET_CURRENT_USER", user);
    },
    setUserPhoto({commit}: ActionContext<IUserStore, any>, image: string): void {
      commit("SET_USER_PHOTO", image);
    },
    setConfirmPopup({ commit }: ActionContext<IUserStore, any>, show: boolean): void {
      commit('SET_CONFIRM_POPUP', show);
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
