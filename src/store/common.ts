import { ref } from "vue";
import { defineStore } from "pinia";

import type { IPopupParams } from "@/types/interfaces/components";
import { ModalContentType } from "@/types/enums";

const useCommonStore = defineStore("common", () => {
  const showTemplateApplication = ref(false);

  const loadingStatus = ref(false);

  const popupParams = ref<IPopupParams | object>({});

  const openConfirmPopup = ref(false);

  const modalContentType = ref(ModalContentType.NONE);

  const setLoadingStatus = (status: boolean): void => {
    loadingStatus.value = status;
  };

  const setPopupParams = (params: IPopupParams | object): void => {
    popupParams.value = params;
  };

  const setConfirmPopupVisibillity = (toggle: boolean): void => {
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
    showTemplateApplication,
    setLoadingStatus,
    setPopupParams,
    setConfirmPopupVisibillity,
    setModalContentType,
  };
});

export default useCommonStore;
