import { createStore } from 'vuex'

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
    }
  },
  modules: {
  }
})
