import { createStore, ActionContext } from "vuex";
import User from "./user";

import { notify } from "@kyvg/vue3-notification";

import axiosInstance from "@/helpers/axios/axiosInstance";

import { IAxiosData, ICommonStore, IPopupParams } from "@/interfaces";
import { Error } from "@/types";

export default createStore({
  state: {
    loadingStatus: false,
    popupParams: {}
  },
  getters: {
    getLoadingStatus(state: ICommonStore): boolean {
      return state.loadingStatus;
    },
    getPopupParams(state: ICommonStore) : boolean {
      return state.popupParams;
    }
  },
  mutations: {
    SET_LOADING_STATUS(state: ICommonStore, status: boolean): void {
      state.loadingStatus = status;
    },
    SET_POPUP_PARAMS(state: ICommonStore, value: boolean): void {
      state.popupParams = value;
    }
  },
  actions: {
    setLoadingStatus({ commit }: ActionContext<ICommonStore, any>, status: boolean): void {
      commit("SET_LOADING_STATUS", status);
    },
    setPopupParams({ commit }: ActionContext<ICommonStore, IPopupParams>, value: IPopupParams) : void {
      commit('SET_POPUP_PARAMS', value);
    },
    $http({ commit, getters }: ActionContext<ICommonStore, IAxiosData>, params: IAxiosData): Promise<any> {
      return new Promise((resolve, reject) => {
        const axios: any = axiosInstance();
        const { url, data, method, auth } = params;

        axios({
          url: process.env.VUE_APP_API_URL + url,
          data,
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getters.getUserToken,
          },
        })
          .then((response: any) => resolve(response))
          .catch((error: Error) => {
            notify({
              title: "Внимание",
              type: "error",
              text: `${error.code}`,
            });
            reject(error);
          })
          .finally(commit("SET_LOADING_STATUS", false));
      });
    },
  },
  modules: {
    User,
  },
});
