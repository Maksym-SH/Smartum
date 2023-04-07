import User from "./user";
import { createStore } from "vuex";
import { IRootState, IPopupParams } from "@/interfaces";
import { RootContext } from "@/types";

export default createStore<IRootState>({
  state: {
    loadingStatus: false,
    popupParams: {},
    openConfirmPopup: false,
  },
  getters: {
    getLoadingStatus(state: IRootState): boolean {
      return state.loadingStatus;
    },
    getPopupParams(state: IRootState): Partial<IPopupParams> {
      return state.popupParams;
    },
    getConfirmPopup(state: IRootState): boolean {
      return state.openConfirmPopup;
    },
  },
  mutations: {
    SET_LOADING_STATUS(state: IRootState, status: boolean): void {
      state.loadingStatus = status;
    },
    SET_POPUP_PARAMS(state: IRootState, value: boolean): void {
      state.popupParams = value;
    },
    SET_CONFIRM_POPUP(state: IRootState, show: boolean): void {
      state.openConfirmPopup = show;
    },
  },
  actions: {
    setLoadingStatus({ commit }: RootContext, status: boolean): void {
      commit("SET_LOADING_STATUS", status);
    },
    setPopupParams({ commit }: RootContext, value: IPopupParams) : void {
      commit('SET_POPUP_PARAMS', value);
    },
    setConfirmPopup({ commit }: RootContext, show: boolean): void {
      commit('SET_CONFIRM_POPUP', show);
    },
  },
  modules: {
    User,
  },
});
