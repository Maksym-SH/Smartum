<template>
  <button
    class="c-button"
    :class="[
      `c-button--${size} c-button--${ variant }`,
      {
        'c-button--disabled': disabled,
        'c-button--transparent': transparent
      }
    ]"
    :disabled="disabled"
  > 
    <v-icon v-if="icon" :icon="icon"></v-icon>
    <slot>{{ title }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useButtonProps } from "../use/props";

export default defineComponent({
  props: useButtonProps,
})
</script>

<style lang="scss" src="./index.scss"></style>