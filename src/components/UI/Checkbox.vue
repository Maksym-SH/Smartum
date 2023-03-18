<template>
  <span class="c-checkbox">
    <input @change="checkboxToggle" type="checkbox" :id="name">
    <label v-if="label" :for="name">{{ label }}</label>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useCheckboxProps } from  "./use/props";

export default defineComponent({
  props: useCheckboxProps,
  emits: ["update:modelValue"],

  setup(_, { emit }) {
    const checked = ref(false)

    const checkboxToggle = () => {
      checked.value = !checked.value;
      emit('update:modelValue', checked.value);
    };

    return {
      checked, 
      checkboxToggle
    }
  }
})
</script>

<style lang="scss" scoped>
.c-checkbox {
  label {
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
      background-color: $color-white5;
      border: 1px solid $color-dark-grey;
    }
  }
  input {
    display: none;

    &:checked {
      + label {
        color: $color-text;
 
        &::before {
          background-color: $color-green;
          background-image: url(~@/assets/img/icons/check.svg);
          background-position: center center;
        }
      }
    }
  }
}
</style>