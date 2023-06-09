<template>
  <notifications />
  <transition name="toggle-popup" mode="out-in">
    <Popup v-if="showPopup" />
  </transition>
  <LongContentModal
    v-if="commonStore.modalContentType"
    :content-type="commonStore.modalContentType"
  />
  <transition name="toggle-popup" mode="out-in">
    <ConfirmationPopup v-if="commonStore.openConfirmPopup" />
  </transition>
  <cLoader v-show="commonStore.loadingStatus" />
  <router-view v-slot="{ Component }">
    <transition name="router-nav" mode="out-in">
      <component :is="Component" v-if="commonStore.showTemplateApplication" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from "vue";
import { ObjectNotEmpty } from "./helpers/methods";

import useStores from "./composables/useStores";

export default defineComponent({
  components: {
    Popup: defineAsyncComponent(() => import("@/components/UI/Popup.vue")),
    ConfirmationPopup: defineAsyncComponent(
      () => import("@/components/UI/Confirmation.vue")
    ),
    LongContentModal: defineAsyncComponent(
      () => import("@/components/UI/LongContentModal.vue")
    ),
  },
  setup() {
    const { commonStore } = useStores();

    return {
      commonStore,
      showPopup: computed((): boolean => ObjectNotEmpty(commonStore.popupParams)),
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
  font-family: $RobotoRG;
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

svg {
  outline: none;
}

// Notifications design.
.vue-notification-wrapper {
  margin-top: 8px;
  .vue-notification-template {
    cursor: pointer;
    border-radius: 4px;
  }
}
</style>
