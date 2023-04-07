<template>
  <div class="input-wrapper">
    <label 
      v-if="label" 
      :for="inputName" 
      :class="{'label-disable': disabled }"
    >
      {{ label }}
    </label>
    <input
      class="c-input"
      :class="{
        'c-input--error': errorText,
        'c-input--transparent': transparent,
        'c-input--search': type === 'search',
        'c-input--phone': isPhone,
        'c-input--password': type === 'password'
      }"
      ref="input"
      :name="inputName"
      :autocomplete="isAutoComplete"
      :type="type"
      :disabled="disabled"
      :value="modelValue"
      :placeholder="placeholder"
      v-model="model"
      v-bind="$attrs"
      @blur="validator()"
      :required="required"
      :min="min"
    />
    <span v-if="required" class="c-input__required"></span>
    <span v-if="isPhone" class="phone mdi mdi-phone"></span>
    <Transition name="error-message">
      <span v-if="errorText" class="c-input__error-text">{{ errorText }}</span>
    </Transition>
    <span
      v-if="type == 'password'"
      class="c-input__toggle-password"
      @click="toggleInputType"
    >
      <transition mode="out-in" name="toggle-content">
        <img
          key="open"
          svg-inline
          v-if="!showPassword"
          src="@/assets/img/icons/eye.svg"
          alt="Eye"
        />
        <img
          v-else
          key="close"
          svg-inline
          src="@/assets/img/icons/eye-slash.svg"
          alt="Eye slash"
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
      <img src="@/assets/img/icons/search.svg" alt="Search" />
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from "vue";
import { emailValidator } from "@/main";
import { useInputProps } from "./use/props";
import { RefElement, ModelValue, AutoComplete } from "@/types";
import RegExp from "@/helpers/regExp";

export default defineComponent({
  inheritAttrs: false,

  props: useInputProps,
  emits: ["invalid", "update:modelValue", "click"],

  setup(props, { emit }) {
    const errorText = ref("");

    const inputName: string = String(Date.now());

    const model = computed({
      get: () => props.modelValue,
      set: (newValue) => emit("update:modelValue", newValue),
    });

    const input = ref<RefElement>(null);

    const showPassword = ref(false);

    const validator = (): void => {
      if (props.isEmail && !emailValidator.validate(model.value)) {
        errorText.value = "Введите корректный адрес.";
      }
      else if (props.isPhone && !String(model.value).match(RegExp.Phone) && model.value) {
        errorText.value = "Введите корректный формат."
      } 
      else if (props.min && String(model.value).length < props.min) {
        errorText.value = `Введите не менее ${props.min} символов.`;
      } 
      else if (props.type === "password" && String(model.value).match(" ")) {
        errorText.value = "Пробелы не допускаются.";
      }
    };

    const toggleInputType = (): void => {
      if (input.value?.type == "password") {
        input.value!.type = "text";
        showPassword.value = true;
      } else {
        input.value!.type = "password";
        showPassword.value = false;
      }
    };

    watch((): ModelValue => props.modelValue, (): string => errorText.value = "");

    watch((): string => errorText.value, (value): void => {
        if (value) emit("invalid");
      }
    );

    const isAutoComplete = computed((): AutoComplete => props.autoComplete ? "on" : "off");

    return {
      errorText,
      isAutoComplete,
      input,
      model,
      inputName,
      showPassword,
      validator,
      toggleInputType,
    };
  },
});
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 15px;
  height: fit-content;
  .c-input {
    padding: 10px;
    border: 1px solid $color-dark-grey;
    outline: none;
    width: 100%;
    background-color: $color-white1;
    border-radius: 4px;
    transition: all 0.3s ease;
    &::placeholder {
      color: $color-brown;
      &::first-letter {
        text-transform: uppercase;
      }
    }
    &.c-input--password {
      padding-right: 44px;
    }
    &[type="password"] {
      letter-spacing: 1px;
    }
    &:disabled {
      border-color: $color-brown;
      color: $color-brown;
      ::placeholder {
        color: $color-brown;
      }
    }
    &--phone {
      padding-left: 30px;
      & + .phone {
        position: absolute;
        top: 12px;
        left: 10px;
        + .c-input__error-text {
          font-size: 11px;
        }
      }
    }
    &--error {
      border-color: $color-red;
      background-color: $color-pink;
      &::placeholder {
        color: $color-grey;
      }
    }
    &--search {
      border-color:  transparent;
      padding-right: 45px;
    }
    &--transparent {
      background-color: transparent;
      color: $color-white4;
      border: none;
      border-bottom: 2px solid $color-white4;
      border-radius: 0;
      &.c-input--error {
        border-color: $color-red;
      }
      + .c-input__required {
        width: 5px;
        height: 5px;
        right: 5px;
        top: 5px;
        border-radius: 50%;
      }
 
      &::placeholder {
        color: $color-white4;
      }
    }
    &__required {
      display: inline-block;
      width: 3px;
      height: calc(100% - 15px);
      border-radius: 0 4px 4px 0;
      position: absolute;
      right: 0;
      background-color: $color-red;
    }
    &__error-text {
      color: $color-red;
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
      top: 23px;
      height: 30px;
      min-width: 20px;
      transform: translate(0, -50%);
      right: 10px;
      &:active {
        background-color: rgba($color-black, 0.3);
      }
    }
  }
  label {
    &.label-disable {
      user-select: none;
      color: $color-light-brown;
    }
    & ~ .phone {
      top: 35px !important;
    }
    & ~ .c-input__required {
      height: calc(100% - 36px) !important;
    }
    & ~ .c-input__toggle-password {
      top: 43px;
      right: 15px;
      svg {
        outline: none;
        fill: $color-black;
      }
    }
    & ~ .c-input__error-text {
      bottom: -18px;
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
