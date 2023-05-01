<template>
  <div class="color-picker">
  <input
    type="color" 
    @input="changeColor" 
    :value="modelValue" 
    class="color-picker__control"
  >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits:["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  setup(_, { emit }) {
    const changeColor = (event: Event) => {
      const selectedColor = (event.target as HTMLInputElement).value;
      emit('update:modelValue', selectedColor);
    }

    return { 
      changeColor
    }
  }
})

</script>

<style lang="scss" scoped>

.color-picker {
  &__control { 
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 30px;
    &::after {
      content: "";
      position: absolute;
      top: 60%;
      left: 7px;
      transform: translateY(-60%);
      width: 20px;
      height: 20px;
      background-image: url("@/assets/img/icons/brush.svg");
    }
  }
}
</style>