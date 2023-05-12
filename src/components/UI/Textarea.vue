<template>
  <div class="c-textarea">
    <div class="c-textarea--relative">
      <textarea
        :id="name"
        ref="textareaRef"
        v-model="model"
        class="c-textarea__field"
        :class="{
          'c-textarea__field--error': errorText,
          'c-textarea__field--required': required,
          'c-textarea__field--resize': resize,
        }"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        v-bind="$attrs"
        :required="required"
        :min="min"
        :maxlength="max"
        @blur="validator()"
      ></textarea>
      <label
        v-if="label"
        :for="name"
        :class="{
          'label-disable': disabled,
          'top-fixed': modelValue,
        }"
      >
        {{ label }}
      </label>
      <span v-if="required" class="c-textarea--required"></span>
      <Transition name="error-message">
        <span v-if="errorText" class="c-textarea--error-text">{{
          errorText
        }}</span>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useTextareaProps } from './use/useProps'
import type { ModelValue, RefElement } from '@/types/types'

export default defineComponent({
  inheritAttrs: false,

  props: useTextareaProps,
  emits: ['invalid', 'update:modelValue', 'click'],

  setup(props, { emit }) {
    const errorText = ref('')

    const isRequired = ref(false)

    const textareaRef = ref<RefElement>(null)

    const model = computed({
      get: () => props.modelValue,
      set: newValue => emit('update:modelValue', newValue),
    })

    const validator = (): void => {
      if (props.min && String(model.value).length < props.min)
        errorText.value = `Введите не менее ${props.min} символов.`
      else if (String(model.value).startsWith(' '))
        errorText.value = 'Начальное пустое значение недопустимо.'
    }

    watch(
      (): ModelValue => props.modelValue,
      (): string => (errorText.value = ''),
    )

    watch(
      (): string => errorText.value,
      (message): void => {
        if (message)
          emit('invalid')
      },
    )

    return {
      errorText,
      isRequired,
      textareaRef,
      model,
      validator,
    }
  },
})
</script>

<style lang="scss" scoped>
.c-textarea {
  width: 100%;
  padding-top: 20px;
  &--relative {
    position: relative;
    height: 100%;
  }
  &__field {
    padding: 10px;
    border: 1px solid var(--color-input);
    outline: none;
    width: 100%;
    height: 100%;
    background-color: var(--input-bg-color);
    border-radius: 4px;
    transition: all 0.3s ease;
    resize: none;
    color: var(--color-text);
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: var(--color-scroll-track);
    }
    &--error {
      border-color: $color-red;
      background-color: $color-pink;

      &::placeholder {
        color: $color-grey;
      }
    }
    &:focus {
      & + label {
        top: -18px;
        left: 0 !important;
      }
    }
    &:disabled {
      border-color: $color-brown;
      color: $color-brown;
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
  label {
    transition: all 0.2s;
    color: var(--color-text);
    pointer-events: none;
    position: absolute;
    font-size: 13px;
    top: 10px;
    left: 10px;
    &.top-fixed {
      top: -18px;
      left: 0;
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
