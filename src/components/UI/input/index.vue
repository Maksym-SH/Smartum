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
    <span 
      v-if="type == 'password'" 
      class="c-input__toggle-password" 
      @click="togglePasswordType"
    >
      <transition mode="out-in" name="toggle-content"> 
        <img 
          :key="showPassword" 
          v-if="!showPassword"
          src="@/assets/img/icons/eye.svg" alt="Eye"
        >
        <img 
          v-else
          :key="showPassword" 
          src="@/assets/img/icons/eye-slash.svg" 
          alt=""
        >
      </transition>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from "vue";
import { emailValidator } from "@/main";
import { useInputProps } from "../use/props";
import { RefInput } from "@/types";

export default defineComponent({
  props: useInputProps,
  emits: ["invalid", "update:modelValue"],

  setup(props, { emit }) {
    const errorText = ref("");
    const isRequired = ref(false);

    const input = ref<RefInput>(null);

    const showPassword = ref(false);

    const validator = (value: string) => {
      if (props.isEmail && !emailValidator.validate(value)) {
        errorText.value = "Введите корректную почту.";
      } else if (props.min && value.length < props.min) {
        errorText.value = `Введите не менее ${props.min} символов.`;
      }
    }
    const togglePasswordType = () => {
      if(input.value?.type == "password") {
        input.value!.type = "text";
        showPassword.value = true;
      } 
      else {
        input.value!.type = "password";
        showPassword.value = false;
      } 
    }
    watch(() => props.modelValue, () => errorText.value = "")
    watch(() => errorText.value, (value) => {
      if(value) emit('invalid'); 
    })

    const isAutoComplete = computed(() => props.autoComplete ? "on" : "off")

    return {
      errorText,
      isRequired,
      isAutoComplete,
      input,
      showPassword,
      validator,
      togglePasswordType
    }
  }
})
</script>

<style lang="scss" src="./index.scss"></style>