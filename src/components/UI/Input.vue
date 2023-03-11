<template>
  <div class="input-wrapper">
    <input
      class="c-input"
      :class="{
        'c-input--error': errorText,
        'c-input--required': required,
        'c-input--transparent': transparent,
        'c-input--search': type === 'search'
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
    <Button
      class="c-input__search-btn"
      v-if="type === 'search'"
      @click="$emit('click')"
      transparent
      round
    >
      <img src="@/assets/img/icons/search.svg" alt="">
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from "vue";
import { emailValidator } from "@/main";
import { useInputProps } from "./use/props";
import { RefInput } from "@/types";

export default defineComponent({
  props: useInputProps,
  emits: ["invalid", "update:modelValue", 'click'],

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

<style lang="scss">
.input-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 15px;
  .c-input {
    padding: 10px;
    border: 1px solid transparent;
    outline: none;
    width: 100%;
    background-color: $color-white4;
    border-radius: 4px;
    transition: all 0.3s ease;
    &::placeholder {
      color: $color-brown;
      &::first-letter {
        text-transform: uppercase;
      }
    }
    &--error {
      border-color: $color-danger; 
      background-color: $color-error;
      &::placeholder {
        color: $color-grey;
      }
    }
    &--search {
      padding-right: 45px;
    }
    &--transparent {
      background-color: transparent;
      color: $color-white4;
      border: none;
      border-bottom: 2px solid $color-white4;
      border-radius:  0;
      &.c-input--error {
        border-color: $color-danger;
      }
      + .c-input__required {
        width: 5px;
        height: 5px;
        right: 5px;
        top: 5px;
        border-radius: 50%;
      }
      &::placeholder {
        color: $color-text;
      }
    }
    &__required {
      display: inline-block;
      width: 3px;
      height: calc(100% - 15px);
      border-radius: 0 4px 4px 0;
      position: absolute;
      right: 0;
      background-color: red;
    }
    &__error-text {
      color: $color-danger;
      position: absolute;
      bottom: -2px;
      font-size: 12px;
      left: 0;
    }
    &__toggle-password {
      position: absolute;
      top: 40%;
      right: 10px;
      transform: translate(0, -45%);
    }
    + &__search-btn {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      right: 10px;
    }
  }
} 

.error-message-enter-active,
.error-message-leave-active {
  transition: opacity 0.2s ease;
}
.error-message-enter-from,
.error-message-leave-to {
  opacity: 0;
}
</style>