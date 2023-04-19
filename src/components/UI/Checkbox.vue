<template>
  <span class="c-checkbox" :class="{'switch': switchBox }">
    <input class="c-checkbox__input" v-model="checked" type="checkbox" :id="name">
    <label 
      class="label secondary-label" 
      :class="{ 'not-selected': checked }"
      v-if="secondaryLabel && switchBox" 
      @click="checkboxToggle(false)"
    >
      {{ secondaryLabel }}
    </label>
    <label class="checkbox-label" :for="name"></label>
    <label
      class="label main-label"
      v-if="label"
      :class="{ 'not-selected': !checked }"
      @click="checkboxToggle(true)"
    >
      {{ label }}
    </label>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { useCheckboxProps } from  "./use/props";

export default defineComponent({
  props: useCheckboxProps,
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const checked = ref<boolean>(props.modelValue);

    const hasTwoLabel = computed((): string | false => props.switchBox && props.label && props.secondaryLabel);

    const checkboxToggle = (value: boolean): void => {
      if (hasTwoLabel.value) { // Label [checkbox] Label
        checked.value = value;
      }
      else {
        checked.value = !checked.value;
      }
    };

    watch(checked, () => emit('update:modelValue', checked.value));

    return {
      checked, 
      checkboxToggle
    }
  }
})
</script>

<style lang="scss" scoped>
.c-checkbox {
  cursor: pointer;
  &__input {
    display: none;
  }
  .not-selected {
    color: $color-brown !important;
  }
  .label {
    cursor: pointer;
    user-select: none;
  }
  &:not(.switch) {
    .checkbox-label {
      padding-left: 20px;
      color: $color-white1;
      position: relative;
      cursor: pointer;
      font-size: 12px;
      user-select: none;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 3px;
        background-color: $color-white4;
        border: 1px solid $color-dark-grey;
      }
    }
    .c-checkbox__input {
      &:checked {
        & ~ .checkbox-label {
          color: $color-white5;
          &::before {
            background-color: $color-green;
            background-image: url(~@/assets/img/icons/check.svg);
            background-position: center center;
          }
        }
      }
    }
  }
  &.switch {
    display: inline-flex;
    align-items: center;
    height: 30px;
    min-width: 40px;
    .checkbox-label {
      display: inline-block;
      width: 36px;
      height: 13px;
      border-radius: 10px;
      position: relative;
      background-color: $color-dark-grey4;
      &::before {
        content: "";
        display: inline-block;
        transition: all 0.2s ease-in-out;
        position: absolute;
        background-color: $color-dark-grey2;
        width: 20px;
        height: 20px;
        top: -4px;
        border-radius: 50%;
      }
    }
    .secondary-label {
      color: var(--color-text);
      padding-right: 5px;
    }
    .main-label {
      color: var(--color-text);
      padding-left: 5px;
    }
    .c-checkbox__input {
      display: none;
        &:checked {
        ~ .checkbox-label {
          background-color: $color-dark-blue;
          &::before {
            transform: translateX(16px);
            background-color: $color-blue;
          }
        }
      }
    }
  }
}
</style>