<template>
  <div class="c-select" :class="{ active: picker }">
    <Button transparent round @click="togglePicker" @blur="picker = false">
      <img src="@/assets/img/icons/dots-vertical.svg" alt="" />
    </Button>
    <transition name="toggle-picker" mode="in-out">
      <div class="c-select__picker" v-if="picker">
        <span class="c-select__picker--caret"></span>
        <Button
          v-for="(item, index) in items"
          :key="index"
          transparent
          :class="{ 'no-icon': !item.icon }"
          :variant="item.variant"
          @click="$emit('selected', item.callback)"
        >
          <img v-if="item.icon" class="btn-icon" :src="item.icon" alt="" />
          {{ item.title }}
        </Button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { SelectElements, MenuLocation } from "@/types/index";

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<SelectElements>,
      default: () => [],
    },
    location: { //ToDo
      type: String as PropType<MenuLocation>,
      default: "end",
    },
    ellips: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const picker = ref(false);

    const togglePicker = () => {
      picker.value = !picker.value;
    };

    return {
      picker,
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

  &__picker {
    position: absolute;
    background-color: $color-white2;
    border-radius: 4px;
    border: 1px solid $color-black;
    z-index: 3;
    right: 0;
    top: 50px;
  
    .c-button {
      padding: 15px 17px;
      margin: 0;
  
      &.no-icon {
        padding-left: 44px !important;
      }
      width: 100%;
      text-align: start;
      border-bottom: 1px solid $color-black;
      white-space: nowrap;
  
      &:last-child {
        border-bottom-color: transparent;
      }
   
      &:hover {
        background-color: $color-white4;
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
      right: 12px;
      display: inline-block;
      width: 15px;
      height: 10px;
      border-radius: 40px 40px 0 0;
      position: absolute;
      background-color: $color-white2;
      border: 1px solid black;
      border-bottom-color: transparent;
    }
  }
}

.toggle-picker-enter-active,
.toggle-picker-leave-active {
  transition: all 0.2s ease;
}

.toggle-picker-enter-from,
.toggle-picker-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
