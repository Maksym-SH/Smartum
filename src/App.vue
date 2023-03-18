<template>
  <notifications />
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

export default defineComponent({
  setup() {
    const store = useStore();
    return {
      loadingStatus: computed(() => store.getters.getLoadingStatus),
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
</style>
