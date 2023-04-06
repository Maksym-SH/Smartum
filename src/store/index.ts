import { createStore, ActionContext } from "vuex";
import User from "./user";
import { ICommonStore, IPopupParams } from "@/interfaces";

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
  },
  modules: {
    User,
  },
});
