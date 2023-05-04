<template>
  <div class="c-select" :class="{ active: selectActive }">
    <Button 
      transparent 
      round 
      @click="togglePicker" 
      @blur="selectActive = false"
    >
      <slot>
        <img 
          class="c-select__icon"
          src="/images/icons/dots-vertical.svg" 
          alt="" 
        />
      </slot>
    </Button>
    <transition name="toggle-selectActive" mode="in-out">
      <div class="c-select__picker" v-if="selectActive">
        <span class="c-select__picker--caret"></span>
        <template v-for="item in items" :key="item.title">
          <Button
            v-if="item.displaying"
            transparent
            :class="{ 'no-icon': !item.icon }"
            :variant="item.variant"
            :icon="item.icon"
            :title="item.title"
            @click="$emit('selected', item.callback)"
          />
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { SelectElements, Position } from "@/types";

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<SelectElements>,
      default: () => [],
    },
    location: { //ToDo
      type: String as PropType<Position>,
      default: "end",
    },
  },
  setup() {
    const selectActive = ref(false);

    const togglePicker = (): void => {
      selectActive.value = !selectActive.value;
    };

    return {
      selectActive,
      togglePicker,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-select {
  position: relative;
  &.active {
    > .c-button {
      background-color: $color-black;
    }
  }
  &__icon {
    width: 25px;
    height: 25px;
  }
  &__picker {
    position: absolute;
    right: 5px;
    top: 50px;
    z-index: 3;
    background-color: $color-white2;
    border-radius: 4px;
    border: 1px solid $color-black;
    .c-button {
      padding: 15px 16px;
      margin: 0;
      width: 100%;
      text-align: start;
      border-bottom: 1px solid $color-black;
      white-space: nowrap;
      &.no-icon {
        padding-left: 44px !important;
      }
      &:last-child {
        border-bottom-color: transparent;
      }
      &:hover {
        background-color: $color-white3;
        border-radius: 4px;
      }
    }
    .btn-icon {
      margin-right: 10px;
      width: 12px;
      height: 12px;
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
