<template>
  <div class="c-input">
    <div class="c-input--relative">
      <input
        class="c-input__field"
        :class="{
          'c-input__field--error': errorText,
          'c-input__field--transparent': transparent,
          'c-input__field--search': type === 'search',
          'c-input__field--phone': isPhone,
          'c-input__field--password': type === 'password',
          'c-input__field--light-theme': lightTheme
        }"
        ref="input"
        :name="inputName"
        :autocomplete="isAutoComplete"
        :placeholder=placeholder
        :type="type"
        :disabled="disabled"
        :value="modelValue"
        v-model="model"
        v-bind="$attrs"
        @blur="validator()"
        :required="required"
        :min="min"
      />
      <label 
        v-if="label && !placeholder" 
        :for="inputName"
        class="label"
        :class="{
          'label-disable': disabled,
          'top-fixed': labelFixed
        }"
      >
        {{ label }}
      </label>
      <span v-if="required" class="c-input--required"></span>
      <span v-if="isPhone" class="phone mdi mdi-phone"></span>
      <Transition name="error-message">
        <span v-if="errorText" class="c-input--error-text">{{ errorText }}</span>
      </Transition>
      <span
        v-if="type == 'password'"
        class="c-input--toggle-password"
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
        class="c-input--search-btn"
        v-if="type === 'search'"
        @click="$emit('click')"
        transparent
        round
      >
        <img
          svg-inline
          src="@/assets/img/icons/search.svg" 
          alt="Search" 
        />
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from "vue";
import { emailValidator } from "@/main";
import { useInputProps } from "./use/props";
import { RefElement, ModelValue, AutoComplete } from "@/types";
import RegExp from "@/helpers/regExp";
import { placeholder } from "@babel/types";

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

    const labelFixed = computed(() => props.modelValue || errorText.value && !props.transparent);

    return {
      errorText,
      isAutoComplete,
      input,
      model,
      inputName,
      showPassword,
      labelFixed,
      validator,
      toggleInputType,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-input {
  width: 100%;
  padding-bottom: 15px;
  height: fit-content;
  padding-top: 20px;
  &--relative {
    position: relative;
    color: var(--color-text);
  }
  &__field {
    padding: 10px;
    border: 1px solid var(--color-input);
    outline: none;
    width: 100%;
    background-color: var(--input-bg-color);
    border-radius: 4px;
    transition: all 0.3s ease;
    color: var(--color-text);
    &::placeholder {
      color: $color-brown;
      &::first-letter {
        text-transform: uppercase;
      }
    }
    &:focus {
      & + label {
        top: -8px;
        left: 0 !important;
      }
    }

    &:autofill {
      border: 3px solid $color-blue;
      background-color: $color-light-blue;
    }
    &:-webkit-autofill {
      background-color: $color-light-blue;
      border: 3px solid $color-blue;
    }

    &.c-input--password {
      padding-right: 44px;
    }
    &:disabled {
      border-color: $color-brown;
      color: $color-brown;
      &::placeholder {
        color: $color-brown;
      }
    }

    &.c-input__field--light-theme {
      border-color: $color-white1;
      color: $color-white1;
      & + label {
        color:  $color-white1;
      }
      & ~ .c-input--search-btn {
        color: $color-white1;
      }
    }
    &--phone {
      padding-left: 30px;
      & ~ .phone {
        position: absolute;
        top: 10px;
        left: 10px;
        color: var(--color-text);
      }
      & ~ label {
        left: 30px !important;
      }
    }
    &--error {
      border-color: $color-red !important;
      background-color: $color-pink;
      &:not(.c-input__field--transparent) {
        color: $color-black !important;
      } 
      & + label {
        color: $color-red !important;
      }
      & ~ .phone {
        color: $color-black;
      }
      & ~ .c-input--toggle-password {
        svg {
          fill: $color-black;
        }
      }
    }
    &--search {
      padding-right: 45px;
    }
    &--transparent {
      background-color: transparent;
      color: $color-white3;
      border: none;
      border-bottom: 2px solid $color-white3;
      border-radius: 0;
      & ~ .c-input--required {
        width: 5px;
        height: 5px;
        right: 5px;
        top: 5px;
        border-radius: 50%;
      }
      &.c-input__field--error {
        & ~ .phone {
          color: $color-black;
        }
        & ~ .c-input--toggle-password {
          svg {
            fill: $color-white1;
          }
        }
      }
    }
  }
  &--toggle-password {
    position: absolute;
    top: 25px;
    right: 10px;
    cursor: pointer;
    transform: translate(0, -50%);
    svg {
      fill: var(--color-input);
      outline: none;
    }
  }
  &--search-btn {
    position: absolute;
    top: 22px;
    height: 30px;
    min-width: 22px;
    transform: translate(0, -50%);
    right: 10px;
    color: var(--color-text);
    &:hover {
      color: var(--color-text);
    }
    &:active {
      background-color: rgba($color-brown, 0.3);
    }
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      outline: none;
    }
  }
  &--required {
    display: inline-block;
    width: 3px;
    height: 100%;
    border-radius: 0 4px 4px 0;
    position: absolute;
    right: 0;
    background-color: $color-red;
  }
  &--error-text {
    color: $color-red;
    position: absolute;
    bottom: -17px;
    font-size: 12px;
    left: 0;
  }
  .label {
    transition: all 0.2s;
    color: var(--color-text);
    font-size: 13px;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: 10px;
    &.top-fixed {
      top: -8px;
      left: 0 !important;
    }
    &.label-disable {
      user-select: none;
      color: $color-light-brown;
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
