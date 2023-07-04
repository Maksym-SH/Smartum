<template>
  <div
    class="c-select"
    :class="[
      { active: selectActive, 'show-active-style': activeStyle },
      `position-${location}`,
    ]"
  >
    <AppButton
      :style="selectSize"
      :variant="variant"
      size="small"
      :icon="selectIcon"
      v-bind="$attrs"
      :title="buttonTitle"
      @click="togglePicker"
    >
      <slot v-if="!buttonTitle">
        <img class="c-select__icon" src="/images/icons/dots-vertical.svg" alt="" />
      </slot>
    </AppButton>
    <transition name="toggle-selectActive" mode="in-out">
      <div v-show="selectActive" class="c-select__picker">
        <span class="c-select__picker--caret"></span>
        <div class="c-select__picker-actions-wrapper">
          <template v-for="item in items" :key="item.title">
            <AppButton
              v-if="item.displaying"
              :class="{ 'no-icon': !item.icon, active: item.active }"
              :color="item.color"
              :icon="item.icon"
              variant="text"
              :title="item.title"
              :rounded="false"
              @click="selected(item.callback)"
            />
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import type { CSSProperties } from "vue";
import { computed, defineComponent, ref } from "vue";
import { useSelectProps } from "./use/useProps";

import InlineSvg from "vue-inline-svg";

import { Colors } from "@/types/enums";

export default defineComponent({
  inheritAttrs: false,
  props: useSelectProps,
  emits: ["selected"],
  components: {
    InlineSvg,
  },
  setup(props, { emit }) {
    const selectActive = ref(false);

    const selectSize = computed((): CSSProperties => {
      return {
        width: `${props.width || props.size}px`,
        height: `${props.height || props.size}px`,
      };
    });

    const selected = (callback: Function): void => {
      emit("selected", callback);
      selectActive.value = false;
    };

    const togglePicker = (): void => {
      selectActive.value = !selectActive.value;
    };

    return {
      selectActive,
      Colors,
      selectSize,
      togglePicker,
      selected,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-select {
  position: relative;

  &.active.show-active-style {
    > .c-button {
      background-color: $color-black !important;
    }
  }

  > .c-button {
    text-transform: none;
    color: $color-white1;
  }

  &__icon {
    width: 25px;
    height: 25px;
  }

  &.position-start {
    .c-select__picker {
      left: 0;

      .c-select__picker--caret {
        left: 7px;
      }
    }
  }
  &.position-end {
    .c-select__picker {
      right: calc(50% - 15px);

      .c-select__picker--caret {
        right: 7px;
      }
    }
  }

  &__picker {
    position: absolute;
    top: calc(100% + 15px);
    z-index: 3;
    border: 1px solid $color-black;
    border-radius: 4px;

    &-actions-wrapper {
      background-color: $color-white2;
      overflow: hidden;
      border-radius: 4px;
    }

    .c-button {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      width: 100%;
      white-space: nowrap;
      padding-left: 30px;
      padding: 15px 16px !important;
      height: auto !important;
      text-transform: none;
      border-radius: 0 !important;
      border-bottom: 1px solid $color-black;

      &.active {
        position: relative;
        color: $color-dark-green !important;
        &::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: $color-dark-green;
          opacity: 1;
          position: absolute;
          left: 90%;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      &.no-icon {
        padding-left: 44px !important;
      }

      &:last-child {
        border-bottom-color: transparent;
      }

      &:hover {
        background-color: $color-white3;
        border-radius: 3px 3px 0 0 !important;
      }

      :deep() {
        svg {
          margin-right: 10px;
        }
      }
    }

    &--caret {
      top: -10px;
      display: inline-block;
      width: 15px;
      height: 10px;
      border-radius: 40px 40px 0 0;
      position: absolute;
      background-color: $color-white2;
      border: 1px solid $color-black;
      border-bottom-color: transparent;
    }
  }
}

.toggle-selectActive-enter-active,
.toggle-selectActive-leave-active {
  transition: all 0.2s ease;
}
.toggle-selectActive-enter-from,
.toggle-selectActive-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
