import { createStore, ActionContext } from 'vuex'
import axiosInstance from "@/helpers/axios/instance";
import { IAxiosData, ICommonStore, IError } from "@/interfaces/index";
import { notify } from '@kyvg/vue3-notification';
// Stores
import User from "./user";

export default createStore({
  state: {
    loadingStatus: false,
  },
  getters: {
    getLoadingStatus(state: ICommonStore): boolean {
      return state.loadingStatus
    },
  },
  mutations: {
    SET_LOADING_STATUS(state: ICommonStore, status: boolean): void {
      state.loadingStatus = status;
    },
  },
  actions: {
    setLoadingStatus({ commit }: ActionContext<ICommonStore, any>, status: boolean): void {
      commit('SET_LOADING_STATUS', status);
    },
    $http({ commit, getters }: ActionContext<ICommonStore, any>, params: IAxiosData): Promise<any> {
      return new Promise((resolve, reject) => {
        const axios: any = axiosInstance();
        const { url, data, method, auth } = params;
        console.log(getters.getUserToken);
        axios({
          url: process.env.VUE_APP_API_URL + url, 
          data,
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getters.getUserToken
          },
        })
        .then((response: any) => resolve(response))
        .catch((error: IError) => {
          notify({
            title: "Внимание",
            type: "error",
            text:  `${ error.code }`
          })
          reject(error);
        }) 
        .finally(commit("SET_LOADING_STATUS", false))
      })
    }
  },
  modules: {
    User
  }
})
