<template>
  <notifications />
  <transition name="toggle-popup" mode="out-in">
    <Popup v-if="showPopup" />
  </transition>
  <LongContentModal v-if="commonStore.modalContentType" :content-type="commonStore.modalContentType" />
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
import { computed, defineAsyncComponent, defineComponent, onBeforeUnmount } from 'vue'
import { ObjectNotEmpty } from './helpers/methods'

import useStores from './composables/useStores'

export default defineComponent({
  components: {
    Popup: defineAsyncComponent(() => import('@/components/UI/Popup.vue')),
    ConfirmationPopup: defineAsyncComponent(
      () => import('@/components/UI/Confirmation.vue'),
    ),
    LongContentModal: defineAsyncComponent(
      () => import('@/components/UI/LongContentModal.vue'),
    ),
  },
  setup() {
    const { commonStore, userStore } = useStores()

    onBeforeUnmount(() => {
      userStore.updateUsersList({ ...userStore.userInfo })
    })

    return {
      commonStore,
      showPopup: computed((): boolean =>
        ObjectNotEmpty(commonStore.popupParams),
      ),
    }
  },
})
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
    cursor: pointer;
    border-radius: 4px;
  }
}
</style>
