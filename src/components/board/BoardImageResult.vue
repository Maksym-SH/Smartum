<template>
  <div class="background-result">
    <div class="background-result__wrapper" :style="{ background }">
      <img v-if="imageDecor" :src="imageDecor" class="background-result__decor" alt="" />
      <VSkeletonLoader v-show="isImage && !imageLoaded" color="info" :elevation="24" />
      <img
        v-show="isImage && imageLoaded"
        :src="image"
        class="background-result__image"
        alt=""
        @load="imageLoad"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";

import useImageLoad from "@/composables/useImageLoad";

export default defineComponent({
  components: {
    VSkeletonLoader,
  },
  props: {
    imageDecor: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    background: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { imageLoad, imageLoaded } = useImageLoad();

    const isImage = computed((): boolean => {
      return Boolean(props.image) && props.background.includes("dashboardTemplates");
    });

    return {
      isImage,
      imageLoaded,
      imageLoad,
    };
  },
});
</script>

<style lang="scss" scoped>
.background-result {
  width: 100%;
  display: flex;
  justify-content: center;
  border-radius: 4px;

  &__wrapper {
    width: 200px;
    height: 120px;
    position: relative;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    .v-skeleton-loader {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      box-shadow: none !important;

      :deep(.v-skeleton-loader__bone) {
        height: 100%;
      }
    }
  }

  &__decor {
    position: absolute;
    z-index: 2;
    max-width: 80%;
    max-height: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px 4px 0 0;
  }
}
</style>
