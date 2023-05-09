<template>
  <v-btn
    class="c-button"
    :color="color"
    :variant="variant"
    :disabled="disabled"
    :rounded="rounded"
    :size="size"
  >
    <v-icon v-if="icon" :icon="icon"></v-icon>
    <slot>{{ title }}</slot>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useButtonProps } from "./use/useProps";
import { Colors } from "@/types/enums";

export default defineComponent({
  props: useButtonProps,
  setup() {
    return {
      Colors
    }
  }
});
</script>

<style lang="scss" scoped>
.c-button {
  min-width: auto !important;

  &:disabled {
    :deep(.v-btn__content) {
      color: $color-white1;
    }
  }
}
</style>