<template>
  <span class="c-checkbox" :class="{ switch: switchBox }">
    <input
      :id="name"
      v-model="checked"
      class="c-checkbox__input"
      type="checkbox"
      :disabled="disabled"
    />
    <!-- Text -->
    <span
      v-if="secondaryLabel && switchBox"
      :for="name"
      class="label secondary-label"
      :class="{
        'not-selected': checked,
        disabled: disabled,
      }"
      @click="checkboxToggle(false)"
    >
      {{ secondaryLabel }}
    </span>

    <!-- Switch -->
    <label class="checkbox-label" :for="name" :class="{ disabled }"></label>

    <!-- Text -->
    <span
      v-if="label"
      class="label main-label"
      :class="{
        'not-selected': !checked,
        disabled: disabled,
      }"
      @click="checkboxToggle(true)"
    >
      {{ label }}
    </span>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import { useCheckboxProps } from "./use/useProps";

export default defineComponent({
  props: useCheckboxProps,
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const checked = computed({
      get: () => props.modelValue,
      set: (newValue) => emit("update:modelValue", newValue),
    });

    const hasTwoLabel = computed((): boolean =>
      Boolean(props.switchBox && props.label && props.secondaryLabel)
    );

    const checkboxToggle = (value: boolean): void => {
      if (hasTwoLabel.value) {
        // Label [checkbox] Label
        checked.value = value;
      } else {
        checked.value = !checked.value;
      }
    };

    watch(checked, (): void => emit("update:modelValue", checked.value));

    return {
      checked,
      checkboxToggle,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-checkbox {
  position: relative;

  &__input {
    display: none;
  }

  .label {
    cursor: pointer;
    user-select: none;

    &.not-selected {
      color: $color-brown !important;
    }

    &.disabled {
      pointer-events: none;
      cursor: default;
      color: var(--color-disable) !important;
    }
  }

  &:not(.switch) {
    .checkbox-label {
      position: relative;
      padding-left: 20px;
      cursor: pointer;
      font-size: 12px;
      user-select: none;
      color: $color-white1;

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
        background-color: $color-white4;
        border: 1px solid $color-dark-grey;
      }
    }

    .c-checkbox__input {
      &:checked {
        & ~ .checkbox-label {
          color: $color-white5;

          &::before {
            background-color: $color-green;
            background-image: url(/images/icons/check.svg);
            background-position: center center;
          }
        }
      }
    }
  }

  &.switch {
    display: inline-flex;
    align-items: center;
    height: 30px;
    min-width: 40px;

    .checkbox-label {
      display: inline-block;
      width: 36px;
      height: 13px;
      border-radius: 10px;
      position: relative;
      background-color: $color-dark-grey4;
      text-align: start !important;

      &::before {
        content: "";
        display: inline-block;
        transition: all 0.2s ease-in-out;
        position: absolute;
        background-color: $color-dark-grey2;
        width: 20px;
        height: 20px;
        top: -4px;
        border-radius: 50%;
      }

      &.disabled {
        background-color: var(--color-disable);

        &::after {
          background-color: var(--color-disable);
        }
      }
    }

    .secondary-label {
      color: var(--color-text);
      padding-right: 5px;
    }

    .main-label {
      color: var(--color-text);
      padding-left: 5px;
    }

    .c-checkbox__input {
      display: none;

      &:checked {
        ~ .checkbox-label {
          background-color: $color-dark-blue;

          &::before {
            transform: translateX(16px);
            background-color: $color-blue;
          }
        }
      }

      &:disabled {
        & ~ .checkbox-label {
          background-color: var(--color-disable);

          &::before {
            background-color: var(--color-disable);
          }
        }
      }
    }
  }
}
</style>
