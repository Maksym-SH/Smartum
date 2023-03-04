<template>
  <div class="input-wrapper">
    <input
      class="c-input"
      :class="{
        'c-input--error': errorText,
        'c-input--required': required,
        'c-input--transparent': transparent
      }"
      ref="input"
      :autocomplete="isAutoComplete"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="validator($event.target.value)"
      :required="required"
      :min="min"
    />
    <span
      v-if="required" class="c-input__required"></span>
    <Transition name="error-message">
      <span v-if="errorText" class="c-input__error-text">{{ errorText }}</span>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from "vue";
import { emailValidator } from "@/main";
import { useInputProps } from "../use/props";

export default defineComponent({
  props: useInputProps,
  emits: ["invalid", "update:modelValue"],

  setup(props, { emit }) {
    const errorText = ref("");
    const isRequired = ref(false);

    const validator = (value: string) => {
      if (props.isEmail && !emailValidator.validate(value)) {
        errorText.value = "Введите корректную почту.";
      } else if (props.min && value.length < props.min) {
        errorText.value = `Введите не менее ${props.min} символов.`;
      }
    }
    watch(() => props.modelValue, () => errorText.value = "")
    watch(() => errorText, (value) => {
      if(value) emit('invalid');
    })

    const isAutoComplete = computed(() => props.autoComplete ? "on" : "off")

    return {
      errorText,
      isRequired,
      isAutoComplete,
      validator
    }
  }
})
</script>

<style lang="scss" src="./index.scss"></style>