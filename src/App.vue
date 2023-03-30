<template>
  <notifications />
  <transition name="toggle-popup" mode="out-in">
    <Popup v-if="showPopup" />
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

import Popup from "@/container/Popup.vue";
import { ObjectNotEmpty } from "./helpers/methods";

export default defineComponent({
  components: {
    Popup
  },
  setup() {
    const store = useStore();
    return {
      loadingStatus: computed(() => store.getters.getLoadingStatus),
      showPopup: computed(() => ObjectNotEmpty(store.getters.getPopupParams))
    };
  },
});
</script>

<style lang="scss">
@import "./assets/scss/global.scss";
* {
  box-sizing: border-box;
}

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
    background-color: $color-green;
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
  @media (min-width: $sm) {
    transform: scale(1.1);
  }

  @media (max-width: $sm) {
    opacity: 0;
  }
}
.toggle-popup-leave-to {
  opacity: 0;
}
</style>
