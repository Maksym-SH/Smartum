import { createStore } from 'vuex'

export default createStore({
  state: {
    loadingStatus: false,
    userToken: ""
  },
  getters: {
    getLoadingStatus(state) {
      return state.loadingStatus
    },
    getUserToken(state) {
      return state.userToken
    }
  },
  mutations: {
    SET_LOADING_STATUS(state, status: boolean) {
      state.loadingStatus = status;
    },
    SET_USER_TOKEN(state, token: string) {
      state.userToken = token;
    }
  },
  actions: {
    setLoadingStatus({ commit }, status: boolean) {
      commit('SET_LOADING_STATUS', status);
    },
    setUserToken({ commit }, token: string) {
      commit('SET_USER_TOKEN', token);
    }
  },
  modules: {
  }
})
