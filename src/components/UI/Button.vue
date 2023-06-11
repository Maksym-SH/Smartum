<template>
  <v-btn
    class="c-button"
    :color="color"
    :variant="variant"
    :disabled="disabled"
    :rounded="rounded"
    :size="size"
  >
    <InlineSvg v-if="icon" :src="`/images/icons/${icon}.svg`" class="c-button__icon" />
    <slot>{{ title }}</slot>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useButtonProps } from "./use/useProps";
import { Colors } from "@/types/enums";

import InlineSvg from "vue-inline-svg";

export default defineComponent({
  props: useButtonProps,
  components: {
    InlineSvg,
  },
  setup() {
    return {
      Colors,
    };
  },
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

  &__icon {
    width: 1.2em;
  }
}
</style>
