<template>
  <div class="c-select" :class="{ active: selectActive }">
    <AppButton
      :style="selectSize"
      variant="text"
      size="small"
      v-bind="$attrs"
      @click="togglePicker"
      @blur="selectActive = false"
    >
      <slot>
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
              :class="{ 'no-icon': !item.icon }"
              :color="item.color"
              :icon="item.icon"
              variant="text"
              :title="item.title"
              :rounded="false"
              @click="$emit('selected', item.callback)"
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
import { Colors } from "@/types/enums";
import { useSelectProps } from "./use/useProps";

import InlineSvg from "vue-inline-svg";

export default defineComponent({
  inheritAttrs: false,
  props: useSelectProps,
  emits: ["selected"],
  components: {
    InlineSvg,
  },
  setup(props) {
    const selectActive = ref(false);

    const selectSize = computed((): CSSProperties => {
      return {
        width: `${props.size}px`,
        height: `${props.size}px`,
      };
    });

    const togglePicker = (): void => {
      selectActive.value = !selectActive.value;
    };

    return {
      selectActive,
      togglePicker,
      Colors,
      selectSize,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-select {
  position: relative;

  &.active {
    > .c-button {
      background-color: $color-black !important;
    }
  }

  &__icon {
    width: 25px;
    height: 25px;
  }

  &__picker {
    position: absolute;
    right: calc(50% - 15px);
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
      right: 7px;
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
