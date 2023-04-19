<template>
  <button
    class="c-button"
    :class="[
      `c-button--${size} c-button--${variant}`,
      {
        'c-button--disabled': disabled,
        'c-button--transparent': transparent,
        'c-button--round': round,
        'c-button--outline': outline
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
    color: $color-white1;
  }
  &:disabled {
    pointer-events: none;
    user-select: none;
    filter: grayscale(70%);
  }
  &--outline {
    background-color: transparent !important;
    border: 1.5px solid transparent;
    &.c-button--info {
      @include button-outline-color($color-blue, $color-blue, $color-blue-hover,
                                      $color-blue-hover, $color-white1);
    }
    &.c-button--danger {
      @include button-outline-color($color-red, $color-red, $color-red-hover,
                                      $color-red-hover, $color-white1);
    }
    &.c-button--warning {
      @include button-outline-color($color-yellow, $color-yellow, $color-yellow-hover,
                                      $color-yellow-hover, $color-white1);
    }
    &.c-button--success {
      @include button-outline-color($color-green, $color-green, $color-green-hover,
                                      $color-green-hover, $color-white1);
    }
  }
  // Variant
  &--default {
    &.c-button--transparent {
      color: $color-dark-grey;

      &:hover {
        color: $color-grey;
      }
    }
  }
  &--info {
    @include button-color($color-blue, $color-blue-hover);
  }
  &--danger {
    @include button-color($color-red, $color-red-hover);
  }
  &--warning {
    @include button-color($color-yellow, $color-yellow-hover);
  }
  &--success {
    @include button-color($color-green, $color-green-hover);
  }
  &--transparent {
    border-radius: 0;
    background-color: transparent;
    margin: 0 5px;
    color: $color-white5;
    &.active {
      color: $color-white2;
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
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  // Size
  &--sm {
    padding: 5px 7px;
    font-size: 14px;
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
