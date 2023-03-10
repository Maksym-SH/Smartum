<template>
  <button
    class="c-button"
    :class="[
      `c-button--${size} c-button--${variant}`,
      {
        'c-button--disabled': disabled,
        'c-button--transparent': transparent,
        'c-button--round': round,
      },
    ]"
    :disabled="disabled"
  >
    <v-icon v-if="icon" :icon="icon"></v-icon>
    <slot>{{ title }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useButtonProps } from "./use/props";

export default defineComponent({
  props: useButtonProps,
});
</script>

<style lang="scss">
.c-button {
  outline: none;
  border: none;
  border-radius: 4px;
  color: $color-white2;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: $color-white3;
  }
  &:disabled {
    pointer-events: none;
    filter: grayscale(60%);
  }
  // Variant
  &--info {
    background-color: $color-info;
    &:hover {
      background-color: $color-info-hover;
    }
  }
  &--danger {
    background-color: $color-danger;
    &:hover {
      background-color: $color-danger-hover;
    }
  }
  &--warning {
    background-color: $color-yellow;
    &:hover {
      background-color: $color-yellow-hover;
    }
  }
  &--success {
    background-color: $color-green;
    &:hover {
      background-color: $color-green-hover;
    }
  }
  &--transparent {
    border-radius: 0;
    background-color: transparent;
    margin: 0 5px;
    color: $color-text;
    &.active {
      color: $color-white2;
      border-color: $color-yellow;
    }
    &:hover {
      background-color: transparent;
    }
  }
  &--round {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transition: all 0.2s;
    position: relative;
    &:hover {
      background-color: transparent;
    }
    &:active {
      background-color: rgba($color-brown, 0.6);
    }
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  // Size
  &--sm {
    padding: 5px;
    font-size: 12px;
  }
  &--md {
    padding: 10px;
    font-size: 16px;
  }
  &--lg {
    padding: 12px;
    font-size: 18px;
  }
}
</style>
