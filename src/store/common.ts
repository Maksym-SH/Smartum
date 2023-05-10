import { ref } from "vue";
import { defineStore } from "pinia";
import { IPopupParams } from "@/types/interfaces";
import { ModalContentType } from "@/types/types";

const useCommonStore = defineStore("common", () => {
  const loadingStatus = ref(false);
  const popupParams = ref<IPopupParams | {}>({});
  const openConfirmPopup = ref(false);
  const modalContentType = ref<ModalContentType>("");

  const setLoadingStatus = (status: boolean): void => {
    loadingStatus.value = status;
  };

  const setPopupParams = (params: IPopupParams | {}): void => {
    popupParams.value = params;
  };

  const setConfirmPopupVisibillity = (toggle: boolean) => {
    openConfirmPopup.value = toggle;
  };

  const setModalContentType = (type: ModalContentType): void => {
    modalContentType.value = type;
  };

  return {
    loadingStatus,
    popupParams,
    openConfirmPopup,
    modalContentType,
    setLoadingStatus,
    setPopupParams,
    setConfirmPopupVisibillity,
    setModalContentType,
  };
});

export default useCommonStore;
