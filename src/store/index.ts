import User from "./user";
import { createStore } from "vuex";
import { IRootState, IPopupParams } from "@/interfaces";
import { ModalContentType, RootContext } from "@/types";

export default createStore<IRootState>({
  state: {
    loadingStatus: false,
    popupParams: {},
    openConfirmPopup: false,
    modalContentType: "",
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
    getModalContentType(state: IRootState): ModalContentType | "" {
      return state.modalContentType;
    }
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
    SET_MODAL_CONTENT_TYPE(state: IRootState, type: ModalContentType | ""): void {
      state.modalContentType = type;
    }
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
    setModalContentType({ commit }: RootContext, type: ModalContentType | ""): void {
      commit("SET_MODAL_CONTENT_TYPE", type);
    }
  },
  modules: {
    User,
  },
});
