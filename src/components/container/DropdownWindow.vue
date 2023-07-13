<template>
  <transition name="fade">
    <div v-if="visible" v-bind="$attrs" class="dropdown-window">
      <header v-if="$slots.header" class="dropdown-window__header">
        <slot name="header" />
      </header>
      <div
        v-if="$slots.content"
        class="dropdown-window__content"
        :style="windowSize"
        :class="{
          'no-header': !$slots.header,
          'save-fix-height': saveFixHeight,
          centering,
        }"
      >
        <slot name="content" />
      </div>
    </div>
  </transition>
  <Teleport to="body">
    <div v-if="visible" class="full-page-lock" @click.self="$emit('hideDropdown')" />
  </Teleport>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import type { CSSProperties } from "vue";

export default defineComponent({
  inheritAttrs: false,
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    centering: {
      type: Boolean,
      default: false,
    },
    saveFixHeight: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["hideDropdown"],
  setup(props) {
    const windowSize = computed((): CSSProperties => {
      return {
        width: `${props.width}px`,
        height: `${props.height}px`,
      };
    });

    return {
      windowSize,
    };
  },
});
</script>

<style lang="scss" scoped>
.dropdown-window {
  position: absolute;
  z-index: 3;
  top: calc(100% + 15px);
  right: 0;
  background-color: var(--color-background);
  box-shadow: 0 10px 10px rgba($color-transp-black, 0.3);

  &__header {
    padding: 5px;
    border-bottom: 1px solid var(--color-border-card);
  }

  &__content {
    overflow: hidden scroll;
    padding: 5px 5px 5px 10px;
    max-height: 65vh;

    &.save-fix-height {
      max-height: none;
    }

    &.centering {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-scroll-track-invert);
    }

    &::-webkit-scrollbar-thumb {
      background-color: $color-dark-grey2;
    }
  }
}

@include mobile(max) {
  .dropdown-window {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0 !important;
    left: 0;
    z-index: 3;
    border-radius: 0;
    box-shadow: none;

    &__header {
      height: 76px;
    }

    &__content {
      width: 100% !important;
      height: calc(100% - 76px) !important;
      padding: 7px;
      max-height: none;

      &.no-header {
        height: 100% !important;
      }

      &::-webkit-scrollbar {
        width: 2px;
      }

      &::-webkit-scrollbar-track {
        background: var(--color-scroll-track-invert);
      }

      &::-webkit-scrollbar-thumb {
        background-color: $color-dark-grey2;
      }
    }
  }
}
</style>
