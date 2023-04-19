<template>
  <div class="toggle-theme-switch" :class="{ 'small': small }">
    <label>
      <input type="checkbox" v-model="switchModel">
      <span class="toggle-theme-switch__icon"></span>
    </label>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Theme } from '@/types';

export default defineComponent({
  props: {
    small: {
      type: Boolean,
      default: false,
    }
  },
  setup() {
    const switchModel = ref<boolean>(true);

    const setTheme = (theme: Theme): void => {
      document.body.setAttribute("data-theme", theme);
    }

    watch(switchModel, (value: boolean):void => {
      const currentTheme: Theme = value ? "light" : "dark";
      setTheme(currentTheme);
      localStorage.setItem("smartumTheme", currentTheme);
    })

    onMounted(() => {
      const savedTheme = localStorage.getItem("smartumTheme") as Theme || "light";
      switchModel.value = savedTheme === 'light' ? true : false;

      setTheme(savedTheme);
    })

    return {
      switchModel
    }
  }
})
</script>
<style lang="scss" scoped>
.toggle-theme-switch {
  position: relative;
  width: 70px;
  label {
    position: absolute;
    width: 100%;
    height: 30px;
    background-color: $color-dark-grey4;
    border-radius: 50px;
    cursor: pointer;
  }
  input {
    position: absolute;
    display: none;
    &:checked {
      ~ .toggle-theme-switch__icon {
        background-color: $color-dark-grey4;
        &::before {
          transform: translateX(40px);
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
    top: 2px;
    left: 2px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    box-shadow: inset 7px -4px 0px 0px $color-white1;
    background-color: $color-dark-grey4;
    transition: 0.3s;
  }
  
  &.small {
    width: 50px;
    label {
      height: 25px;
    }
    input {
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