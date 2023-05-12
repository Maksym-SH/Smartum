<template>
  <div class="toggle-theme-switch" :class="{ small }">
    <label class="toggle-theme-switch__label" :for="name">
      <input
        :id="name"
        :name="name"
        v-model="switchModel"
        class="toggle-theme-switch__input"
        type="checkbox"
      />
      <span class="toggle-theme-switch__icon"></span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { SetTheme } from '@/helpers/methods'
import type { Theme } from '@/types/types'

export default defineComponent({
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup() {
    const switchModel = ref<boolean>(true)

    watch(switchModel, (value: boolean): void => {
      const currentTheme: Theme = value ? 'light' : 'dark'
      SetTheme(currentTheme)
      localStorage.setItem('smartumTheme', currentTheme)
    })

    onMounted(() => {
      const savedTheme
        = (localStorage.getItem('smartumTheme') as Theme) ?? 'dark'
      switchModel.value = savedTheme !== 'dark'

      SetTheme(savedTheme)
    })

    return {
      switchModel,
    }
  },
})
</script>

<style lang="scss" scoped>
.toggle-theme-switch {
  position: relative;
  width: 50px;
  &__label {
    position: absolute;
    width: 100%;
    height: 25px;
    background-color: $color-dark-grey4;
    border-radius: 50px;
    cursor: pointer;
  }
  &__input {
    position: absolute;
    display: none;
    &:checked {
      ~ .toggle-theme-switch__icon {
        background-color: $color-dark-grey4;
        &::before {
          transform: translateX(26.5px);
          background-color: $color-yellow;
          box-shadow: none;
        }
      }
    }
  }
  &__icon {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: 0.3s;
  }
  &__icon::before {
    content: "";
    position: absolute;
    top: 0;
    left: -1px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    box-shadow: inset 7px -4px 0px 0px $color-white1;
    background-color: $color-dark-grey4;
    transition: 0.3s;
  }

  &.small {
    width: 50px;
    .toggle-theme-switch__label {
      height: 25px;
    }
    .toggle-theme-switch__input {
      &:checked {
        ~ .toggle-theme-switch__icon {
          &::before {
            transform: translateX(25px);
          }
        }
      }
    }
    .toggle-theme-switch__icon {
      &::before {
        top: 0;
        left: 0;
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>
