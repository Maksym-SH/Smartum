<template>
  <div class="input-wrapper">
    <input
      class="c-input"
      :class="{
        'c-input--error': errorText,
        'c-input--required': required,
        'c-input--transparent': transparent,
        'c-input--search': type === 'search',
      }"
      ref="input"
      :autocomplete="isAutoComplete"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      v-model="model"
      v-bind="$attrs"
      @blur="validator()"
      :required="required"
      :min="min"
    />
    <span v-if="required" class="c-input__required"></span>
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
          key="open"
          v-if="!showPassword"
          src="@/assets/img/icons/eye.svg"
          alt="Eye"
        />
        <img
          v-else
          key="close"
          src="@/assets/img/icons/eye-slash.svg"
          alt=""
        />
      </transition>
    </span>
    <Button
      class="c-input__search-btn"
      v-if="type === 'search'"
      @click="$emit('click')"
      transparent
      round
    >
      <img src="@/assets/img/icons/search.svg" alt="" />
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from "vue";
import { emailValidator } from "@/main";
import { useInputProps } from "./use/props";
import { RefElement } from "@/types";

export default defineComponent({
  inheritAttrs: false,

  props: useInputProps,
  emits: ["invalid", "update:modelValue", "click"],

  setup(props, { emit }) {
    const errorText = ref("");

    const isRequired = ref(false);

    const model = computed({
      get: () => props.modelValue,
      set: (newValue) => emit("update:modelValue", newValue),
    });

    const input = ref<RefElement>(null);

    const showPassword = ref(false);

    const validator = () => {
      if (props.isEmail && !emailValidator.validate(model)) {
        errorText.value = "Введите корректную почту.";
      } 
      else if (props.min && String(model.value).length < props.min) {
        errorText.value = `Введите не менее ${props.min} символов.`;
      } 
      else if (props.type === "password" && String(model.value).match(" ")) {
        errorText.value = "Пробелы не допускаются.";
      }
    };

    const togglePasswordType = () => {
      if (input.value?.type == "password") {
        input.value!.type = "text";
        showPassword.value = true;
      } else {
        input.value!.type = "password";
        showPassword.value = false;
      }
    };

    watch(() => props.modelValue, () => errorText.value = "");

    watch(() => errorText.value, (value) => {
        if (value) emit("invalid");
      }
    );

    const isAutoComplete = computed(() => (props.autoComplete ? "on" : "off"));

    return {
      errorText,
      isRequired,
      isAutoComplete,
      input,
      model,
      showPassword,
      validator,
      togglePasswordType,
    };
  },
});
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 15px;

  .c-input {
    padding: 10px;
    border: 1px solid transparent;
    outline: none;
    width: 100%;
    background-color: $color-white5;
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
      border-radius: 0;
  
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
        color: rgba($color-grey, 0.7);
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
      cursor: pointer;
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
