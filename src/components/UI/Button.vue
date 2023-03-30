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
    color: $color-white3;
  }

  &:disabled {
    pointer-events: none;
    filter: grayscale(60%);
  }

  &--outline {
    background-color: transparent !important;
    border: 1.5px solid transparent;
    &.c-button--info {
      color: $color-blue;
      border-color:$color-blue;
      &:hover {
        border-color: $color-blue-hover;
        background-color: $color-blue-hover !important;
        color: $color-white1;
      }
    }
    &.c-button--danger {
      color: $color-red;
      border-color: $color-red;
      &:hover {
        border-color: $color-red-hover;
        background-color: $color-red-hover !important;
        color: $color-white1;
      }
    }
    &.c-button--warning {
      color: $color-yellow;
      border-color: $color-yellow-hover;
      &:hover {
        border-color: $color-yellow-hover;
        background-color: $color-yellow-hover !important;
        color: $color-white1;
      }
    }
    &.c-button--success {
      color: $color-green;
      border-color: $color-green;
      &:hover {
        border-color: $color-green-hover;
        background-color: $color-green-hover !important;
        color: $color-white1;
      }
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
    background-color: $color-blue;

    &:hover {
      background-color: $color-blue-hover;
    }

    &.c-button--transparent {
      color: $color-blue;

      &:hover {
        color: $color-blue-hover;
      }
    }
  }

  &--danger {
    background-color: $color-red;

    &:hover {
      background-color: $color-red-hover;
    }

    &.c-button--transparent {
      color: $color-red;

      &:hover {
        color: $color-red-hover;
      }
    }
  }

  &--warning {
    background-color: $color-yellow;

    &:hover {
      background-color: $color-yellow-hover;
    }

    &.c-button--transparent {
      color: $color-yellow;

      &:hover {
        color: $color-yellow-hover;
      }
    }
  }

  &--success {
    background-color: $color-green;

    &:hover {
      background-color: $color-green-hover;
    }

    &.c-button--transparent {
      color: $color-green;

      &:hover {
        color: $color-green-hover;
      }
    }
  }

  &--transparent {
    border-radius: 0;
    background-color: transparent;
    margin: 0 5px;
    color: $color-text;

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
