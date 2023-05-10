<template>
  <div class="background-result">
    <div class="background-result__wrapper" :style="{ background: background }">
      <img
        v-if="imageDecor"
        :src="imageDecor"
        class="background-result__decor"
        alt=""
      />
      <img
        v-if="showSelectedImage"
        :src="image"
        class="background-result__image"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    imageDecor: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: false,
    },
    background: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const showSelectedImage = computed((): boolean => {
      return (
        Boolean(props.image) && props.background.includes("dashboardTemplates")
      );
    });

    return {
      showSelectedImage,
    };
  },
});
</script>

<style lang="scss" scoped>
.background-result {
  width: 100%;
  display: flex;
  justify-content: center;
  &__wrapper {
    width: 200px;
    height: 120px;
    position: relative;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    border-radius: 4px;
  }
}
</style>
