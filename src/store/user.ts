import { ActionContext } from "vuex";
import router from "@/router";
import { getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { IUserCreated, IUserInfo, IUserStore } from "@/interfaces/index";

export default {
  state: {
    userToken: "",
    currentUser: {},
    openConfirmPopup: false,
    userInfo: {
      firstName: "",
      lastName: "",
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
    getConfirmPopup(state: IUserStore): boolean {
      return state.openConfirmPopup;
    },
    getUserInfo(state: IUserStore): IUserCreated {
      return state.userInfo;
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
    SET_USER_INFO(state: IUserStore, params: IUserCreated): void {
      state.userInfo = params;
    },
    SET_USER_PHOTO(state: IUserStore, photo: string) : void {
      state.userInfo.photoURL = photo;
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
    setUserInfo({ commit }: ActionContext<IUserInfo, any>, params: IUserCreated): void {
      commit("SET_USER_INFO", params);
    },
    userLogout({ commit }: ActionContext<IUserStore, any>): void {
      getAuth()
        .signOut()
        .then(() => {
          commit("SET_USER_TOKEN", "");
          commit("SET_CURRENT_USER", {});
          commit("SET_CONFIRM_POPUP", false);
          commit("SET_USER_INFO", {
            firstName: "",
            lastName: "",
            about: "",
            phone: "",
            photoURL: ""
          });

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
