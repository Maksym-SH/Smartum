import User from "./user";
import Notifications from "./notifications";
import Configuration from "./configuration";
import Dashboard from "./dashboard";
import { createStore } from "vuex";
import { IRootState, IPopupParams } from "@/interfaces";
import { ModalContentType } from "@/types";

export default createStore<IRootState>({
  state: {
    loadingStatus: false,
    popupParams: {},
    openConfirmPopup: false,
    modalContentType: "",
  },
  mutations: {
    setLoadingStatus(state, status: boolean): void {
      state.loadingStatus = status;
    },
    setPopupParams(state, value: IPopupParams): void {
      state.popupParams = value;
    },
    setConfirmPopup(state, show: boolean): void {
      state.openConfirmPopup = show;
    },
    setModalContentType(state, type: ModalContentType | ""): void {
      state.modalContentType = type;
    },
  },
  modules: {
    Notifications,
    Configuration,
    Dashboard,
    User
  },
});
