import { ActionContext } from "vuex";
import router from "@/router";
import { getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";

import { IUserAdditional, IUserInfo, IUserStore } from "@/interfaces/index";

export default {
  state: {
    userToken: "",
    currentUser: {},
    openConfirmPopup: false,
    additionalParams: {
      about: "",
      phone: "",
      photoURL: ""
    }
  },
  getters: {
    getUserToken(state: IUserStore): string {
      return state.userToken;
    },
    getCurrentUser(state: IUserStore): object {
      return state.currentUser;
    },
    getUserPhoto(state: IUserStore): string {
      if(state.additionalParams.photoURL) {
        return JSON.parse(state.additionalParams.photoURL).result;
      }
      return ""
    },
    getConfirmPopup(state: IUserStore): boolean {
      return state.openConfirmPopup;
    },
    getAdditionalUserInfo(state: IUserStore): IUserAdditional {
      return state.additionalParams;
    }
  },
  mutations: {
    SET_USER_TOKEN(state: IUserStore, token: string): void {
      state.userToken = token;
    },
    SET_CURRENT_USER(state: IUserStore, user: object): void {
      state.currentUser = user;
    },
    SET_CONFIRM_POPUP(state:IUserStore, show: boolean): void {
      state.openConfirmPopup = show;
    },
    SET_ADDITIONAL_USER_PARAMS(state: IUserStore, params: IUserAdditional): void {
      state.additionalParams =  params;
    }
  },
  actions: {
    setUserToken({ commit }: ActionContext<IUserStore, any>, token: string): void {
      commit("SET_USER_TOKEN", token);
    },
    setCurrentUser({ commit }: ActionContext<IUserStore, any>, user: any): void {
      commit("SET_CURRENT_USER", user);
    },
    setConfirmPopup({ commit }: ActionContext<IUserStore, any>, show: boolean): void {
      commit('SET_CONFIRM_POPUP', show);
    },
    setAdditionalParamsUser({ commit }: ActionContext<IUserInfo, any>, params: IUserAdditional): void {
      commit("SET_ADDITIONAL_USER_PARAMS", params);
    },
    userLogout({ commit }: ActionContext<IUserStore, any>): void {
      getAuth()
        .signOut()
        .then(() => {
          commit("SET_USER_TOKEN", "");
          commit("SET_CURRENT_USER", {});
          if (!router.currentRoute.value.meta.notAuthorized) {
            router.push({ name: "SignIn" });
            localStorage.removeItem("smartumToken");
            notify({
              text: "До скорого!",
              type: "success",
              ignoreDuplicates: true
            });
          }
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
