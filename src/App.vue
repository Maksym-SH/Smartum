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
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { ObjectNotEmpty } from "./helpers/methods";
import { ModalContentType } from "./types";

import Popup from "@/components/ui/Popup.vue";
import ConfirmationPopup from "@/components/ui/Confirmation.vue";
import LongContentModal from "@/components/ui/LongContentModal.vue";

export default defineComponent({
  components: {
    Popup,
    ConfirmationPopup,
    LongContentModal
  },
  setup() {
    const store = useStore();

    return {
      loadingStatus: computed((): boolean => store.state.loadingStatus),
      showPopup: computed((): boolean  => ObjectNotEmpty(store.state.popupParams)),
      showConfirmPopup: computed((): boolean => store.state.openConfirmPopup),
      modalContentType: computed((): ModalContentType | "" => store.state.modalContentType)
    };
  },
});
</script>

<style lang="scss">
@import "./assets/scss/global.scss";
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
</style>
