<template>
  <div class="c-loader" :class="{ 'inline-transparent': inline }">
    <span :style="loaderSize" class="c-loader__spinner" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import type { CSSProperties } from "vue";
import { useLoaderProps } from "./use/useProps";

export default defineComponent({
  props: useLoaderProps,
  setup(props) {
    const loaderSize: CSSProperties = reactive({
      width: `${props.size}px`,
      height: `${props.size}px`,
    });

    return {
      loaderSize,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-loader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba($color-black, 0.5);

  &:not(.inline-transparent) {
    width: 100%;
    height: 100%;
  }

  &__spinner {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    border: 3px solid;
    border-color: $color-blue $color-blue transparent transparent;
    box-sizing: border-box;
    animation: rotation 2s linear infinite;

    &::after,
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      margin: auto;
      border: 3px solid;
      border-color: transparent transparent $color-light-blue $color-light-blue;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      border-radius: 50%;
      animation: rotationBack 1s linear infinite;
    }
  }

  &.inline-transparent {
    position: static;
    background-color: transparent;
    display: inline-flex;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes rotationBack {
  0% {
    transform: rotate(-360deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>
