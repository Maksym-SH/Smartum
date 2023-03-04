<template>
  <span class="c-checkbox">
    <input @change="checkboxToggle" type="checkbox" :id="name">
    <label v-if="label" :for="name">{{ label }}</label>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useCheckboxProps } from  "../use/props";

export default defineComponent({
  props: useCheckboxProps,
  emits: ["update:modelValue"],

  setup(_, { emit }) {
    const check = ref(false)
    const checkboxToggle = () => {
      check.value = !check.value;
      emit('update:modelValue', check.value);
    };
    return {
      check, 
      checkboxToggle
    }
  }
})
</script>

<style lang="scss" src="./index.scss"></style>