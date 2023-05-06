<template>
  <div class="c-select" :class="{ active: selectActive }">
    <Button 
      rounded
      variant="text"
      size="small"
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
            :class="{ 'no-icon': !item.icon }"
            :color="item.color"
            :icon="item.icon"
            variant="text"
            :title="item.title"
            :rounded="4"
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
import { Colors } from "@/enums";

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
      Colors,
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
  > .c-button {
    width: 30px;
    height: 30px;
  }
  &__icon {
    width: 25px;
    height: 25px;
  }
  &__picker {
    position: absolute;
    right: 0;
    top: 50px;
    z-index: 3;
    background-color: $color-white2;
    border-radius: 4px;
    border: 1px solid $color-black;
    .c-button {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      width: 100%;
      white-space: nowrap;
      padding-left: 30px;
      padding: 15px 16px !important;
      height: auto !important;
      text-transform:none;
      border-bottom: 1px solid $color-black;
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
      :deep() {
        .v-icon {
          margin-right: 10px;
        }
      }
      
    }
    .btn-icon {
      margin-right: 110px;
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
