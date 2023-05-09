<template>
  <notifications />
  <transition name="toggle-popup" mode="out-in">
    <Popup v-if="showPopup" />
  </transition>
  <LongContentModal 
    v-if="modalContentType" 
    :content-type="modalContentType"
  />
  <transition name="toggle-popup" mode="out-in">
    <ConfirmationPopup v-if="showConfirmPopup" />
  </transition>

  <Loader v-show="loadingStatus" />
  <router-view v-slot="{ Component }">
    <transition name="router-nav" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, computed, defineAsyncComponent } from "vue";
import { ObjectNotEmpty } from "./helpers/methods";
import { ModalContentType } from "./types/types";

import useStores from "./composables/useStores";

export default defineComponent({
  components: {
    Popup: defineAsyncComponent(() => import("@/components/UI/Popup.vue")),
    ConfirmationPopup: defineAsyncComponent(() => import("@/components/UI/Confirmation.vue")),
    LongContentModal: defineAsyncComponent(() =>import("@/components/UI/LongContentModal.vue")),
  },
  setup() {
    const { commonStore } = useStores();

    return {
      loadingStatus: computed((): boolean => commonStore.loadingStatus),
      showPopup: computed((): boolean  => ObjectNotEmpty(commonStore.popupParams)),
      showConfirmPopup: computed((): boolean => commonStore.openConfirmPopup),
      modalContentType: computed((): ModalContentType => commonStore.modalContentType)
    };
  },
});
</script>

<style lang="scss">
@import "./assets/scss/global.scss";
html {
  overflow-y: auto !important;
}
body {
  min-width: 320px;
  position: fixed;
  min-height: 100%;
  width: 100%;
  height: 100%;
  overflow: hidden auto;
  background-color: $color-grey;
  font-family: $PoppinsRG;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: $color-grey;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $color-light-grey;
  }
}
#app {
  height: 100%;
}

.router-nav-enter-active,
.router-nav-leave-active {
  overflow: hidden;
  transition: all 0.3s ease;
}

.router-nav-enter-from,
.router-nav-leave-to {
  opacity: 0;
}

.toggle-popup-enter-active,
.toggle-popup-leave-active {
  overflow: hidden;
  transition: all 0.2s ease;
}

.toggle-popup-enter-from,
.toggle-popup-leave-to {
  @include mobile(min) {
    transform: scale(1.1);
  }

  @include mobile(max) {
    opacity: 0;
  }
}
.toggle-popup-leave-to {
  opacity: 0;
}

.single-content-enter-active,
.single-content-leave-active {
  overflow: hidden;
  transition: all 0.2s ease;
}

.single-content-enter-from,
.single-content-leave-to {
  opacity: 0;
}

// Notifications design.
.vue-notification-wrapper {
  margin-top: 8px;
  .vue-notification-template {
    border-radius: 4px;
  }
}

</style>
