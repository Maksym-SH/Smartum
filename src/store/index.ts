import { createStore } from 'vuex'
import axiosInstance from "@/helpers/axios/instance";
import { IAxiosData, IError } from "@/interfaces/interfaces";
import { notify } from '@kyvg/vue3-notification';

export default createStore({
  state: {
    loadingStatus: false,
    userToken: "",
    currentUser: {},
  },
  getters: {
    getLoadingStatus(state) {
      return state.loadingStatus
    },
    getUserToken(state) {
      return state.userToken
    },
    getCurrentUser(state) {
      return state.currentUser;
    }
  },
  mutations: {
    SET_LOADING_STATUS(state, status: boolean) {
      state.loadingStatus = status;
    },
    SET_USER_TOKEN(state, token: string) {
      state.userToken = token;
    },
    SET_CURRENT_USER(state, user: object) {
      state.currentUser = user;
    }
  },
  actions: {
    setLoadingStatus({ commit }, status: boolean) {
      commit('SET_LOADING_STATUS', status);
    },
    setUserToken({ commit }, token: string) {
      commit('SET_USER_TOKEN', token);
    },
    setCurrentUser({ commit }, user: object) {
      commit('SET_CURRENT_USER', user);
    },
    $http({ commit, getters }, params: IAxiosData) {
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
  }
})
