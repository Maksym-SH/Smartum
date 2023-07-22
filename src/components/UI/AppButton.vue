<template>
  <VBtn
    class="c-button"
    :color="color"
    :variant="variant"
    :disabled="disabled"
    :rounded="rounded"
    :size="size"
  >
    <InlineSvg v-if="icon" :src="`/images/icons/${icon}.svg`" class="c-button__icon" />
    <slot>{{ title }}</slot>
  </VBtn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useButtonProps } from "./use/useProps";

import InlineSvg from "vue-inline-svg";
import { VBtn } from "vuetify/components";

import { Colors } from "@/types/enums";

export default defineComponent({
  components: {
    InlineSvg,
    VBtn,
  },
  props: useButtonProps,
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
    transition: all 0.2s ease;
    width: 1.2em;
  }
}
</style>
