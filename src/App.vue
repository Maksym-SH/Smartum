<template>
  <notifications />
  <transition name="toggle-popup" mode="out-in">
    <Popup v-if="showPopup" />
  </transition>
  <transition name="toggle-popup" mode="out-in">
    <ConfirmationPopup v-if="showConfirmPopup" />
  </transition>

  <Loader v-if="loadingStatus" />
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
import Popup from "@/components/ui/Popup.vue";
import ConfirmationPopup from "@/components/ui/Confirmation.vue";

export default defineComponent({
  components: {
    Popup,
    ConfirmationPopup
},
  setup() {
    const store = useStore();

    return {
      loadingStatus: computed((): boolean => store.getters.getLoadingStatus),
      showPopup: computed((): boolean  => ObjectNotEmpty(store.getters.getPopupParams)),
      showConfirmPopup: computed((): boolean => store.getters.getConfirmPopup)
    };
  },
});
</script>

<style lang="scss">
@import "./assets/scss/global.scss";
body {
  min-width: 320px;
  background-color: $color-grey;
  font-family: $PoppinsRG;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: $color-grey;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $color-brown;
  }
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
