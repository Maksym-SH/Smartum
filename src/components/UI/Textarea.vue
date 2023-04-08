<template>
  <div class="c-textarea">
    <label v-if="label" :for="textareaName">{{ label }}</label>
    <textarea
      class="c-textarea__field"
      :class="{
        'c-textarea__field--error': errorText,
        'c-textarea__field--required': required,
        'c-textarea__field--resize': resize
      }"
      ref="textarea"
      :name="textareaName"
      :placeholder="placeholder"
      v-model="model"
      v-bind="$attrs"
      @blur="validator()"
      :required="required"
      :min="min"
      :maxlength="max"
    />
    <span v-if="required" class="c-textarea--required"></span>
    <Transition name="error-message">
      <span v-if="errorText" class="c-textarea--error-text">{{ errorText }}</span>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from "vue";
import { useTextareaProps } from "./use/props";
import { RefElement, ModelValue } from "@/types";

export default defineComponent({
  inheritAttrs: false,

  props: useTextareaProps,
  emits: ["invalid", "update:modelValue", "click"],

  setup(props, { emit }) {
    const errorText = ref("");

    const isRequired = ref(false);

    const textareaName: string = String(Date.now());

    const model = computed({
      get: () => props.modelValue,
      set: (newValue) => emit("update:modelValue", newValue),
    });

    const textarea = ref<RefElement>(null);

    const validator = (): void => {
      if (props.min && String(model.value).length < props.min) {
        errorText.value = `Введите не менее ${props.min} символов.`;
      } 
      else if (String(model.value).startsWith(" ")) {
        errorText.value = "Пустое значение недопустимо.";
      }
    };

    watch((): ModelValue => props.modelValue, (): string => errorText.value = "");

    watch((): string => errorText.value, (value): void => {
        if (value) emit("invalid");
      }
    );

    return {
      errorText,
      isRequired,
      textarea,
      model,
      textareaName,
      validator,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-textarea {
  position: relative;
  width: 100%;
  height: fit-content;
  &__field {
    padding: 10px;
    border: 1px solid $color-dark-grey;
    outline: none;
    width: 100%;
    height: calc(100% - 23px);
    background-color: $color-white1;
    border-radius: 4px;
    transition: all 0.3s ease;
    resize: none;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: $color-dark-grey;
    }
    &--error {
      border-color: $color-red;
      background-color: $color-pink;
 
      &::placeholder {
        color: $color-grey;
      }
    }
    &--resize {
      resize: vertical;
    }
  }
  &--error-text {
      color: $color-red;
      position: absolute;
      bottom: -11px;
      font-size: 12px;
      left: 0;
    }
  &--required {
    display: inline-block;
    width: 3px;
    height: calc(100% - 23px);
    border-radius: 0 4px 4px 0;
    position: absolute;
    right: 0;
    background-color: red;
  }
  label + .c-textarea {
    height: calc(100% - 23px);
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
