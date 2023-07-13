<template>
  <div
    :class="{ circle }"
    class="image-example"
    :style="[size, { background }]"
    @click="selectExample"
  >
    <img
      v-show="image && imageLoaded"
      :src="image"
      class="image-example__picture"
      alt=""
      @load="imageLoad"
    />
    <VSkeletonLoader
      v-if="image && !imageLoaded"
      :height="height"
      :elevation="24"
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import type { CSSProperties } from "vue";
import { useBackgroundItemProps } from "./use/useProps";

import useImageLoad from "@/composables/useImageLoad";

export default defineComponent({
  components: {
    VSkeletonLoader,
  },
  props: useBackgroundItemProps,
  emits: ["select"],
  setup(props, { emit }) {
    const { imageLoaded, imageLoad } = useImageLoad();

    const size = computed((): CSSProperties => {
      return {
        width: `${props.width}px`,
        height: `${props.height}px`,
      };
    });

    const selectExample = (): void => {
      const emitTarget = props.background ? props.background : props.image;
      emit("select", emitTarget);
    };

    return {
      size,
      imageLoaded,
      imageLoad,
      selectExample,
    };
  },
});
</script>

<style lang="scss" scoped>
.image-example {
  max-width: 80px;
  border-radius: 4px;
  cursor: pointer;
  outline: 3px solid transparent;
  transform: all 0.5s;
  height: fit-content;

  .v-skeleton-loader {
    :deep(.v-skeleton-loader__bone) {
      height: 100%;
    }
  }
  &.circle {
    border-radius: 50%;
  }

  &.active {
    outline-color: $color-cyan;
    border-radius: 0px;

    .image-example__picture {
      border-radius: 0;
    }
  }

  &__picture {
    border-radius: 4px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
