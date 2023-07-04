<template>
  <notifications />
  <transition name="toggle-popup" mode="out-in">
    <AppPopup v-if="showPopup" />
  </transition>
  <ModalContent
    v-if="commonStore.modalContentType"
    :content-type="commonStore.modalContentType"
  />
  <transition name="toggle-popup" mode="out-in">
    <ConfirmationPopup v-if="commonStore.openConfirmPopup" />
  </transition>
  <AppLoader v-show="commonStore.loadingStatus" />
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
    AppPopup: defineAsyncComponent(() => import("@/components/UI/AppPopup.vue")),
    ConfirmationPopup: defineAsyncComponent(
      () => import("@/components/UI/ConfirmationPopup.vue")
    ),
    ModalContent: defineAsyncComponent(
      () => import("@/components/modals/ModalContent.vue")
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
@import "@/assets/scss/theme.scss";

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
  scrollbar-width: thin;
  scrollbar-color: $color-dark-grey3 $color-grey;

  &::-webkit-scrollbar {
    width: 3px;
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
  .vue-notification-template {
    margin-top: 10px;
    cursor: pointer;
    border-radius: 4px;
  }
}
</style>
