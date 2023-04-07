import User from "./user";
import { createStore } from "vuex";
import { IRootState, IPopupParams } from "@/interfaces";
import { RootContext } from "@/types";

export default createStore({
  state: {
    loadingStatus: false,
    popupParams: {}
  },
  getters: {
    getLoadingStatus(state: IRootState): boolean {
      return state.loadingStatus;
    },
    getPopupParams(state: IRootState): Partial<IPopupParams> {
      return state.popupParams;
    }
  },
  mutations: {
    SET_LOADING_STATUS(state: IRootState, status: boolean): void {
      state.loadingStatus = status;
    },
    SET_POPUP_PARAMS(state: IRootState, value: boolean): void {
      state.popupParams = value;
    }
  },
  actions: {
    setLoadingStatus({ commit }: RootContext, status: boolean): void {
      commit("SET_LOADING_STATUS", status);
    },
    setPopupParams({ commit }: RootContext, value: IPopupParams) : void {
      commit('SET_POPUP_PARAMS', value);
    },
  },
  modules: {
    User,
  },
});
