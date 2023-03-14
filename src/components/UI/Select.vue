<template>
  <div class="c-select">
    <v-menu :location="location">
      <template v-slot:activator="{ props }">
        <Button transparent round v-bind="props">
          <slot>
            <img src="@/assets/img/icons/dots-vertical.svg" alt="Dots" />
          </slot>
        </Button>
      </template>
      <v-list v-if="items">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="$emit('selected', item.callback)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { SelectElements, MenuLocation } from "@/types/index";

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<SelectElements>,
      default: () => [],
    },
    location: {
      type: String as PropType<MenuLocation>,
      default: "end",
    },
    ellips: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.c-select {
  :deep(.c-button) {
    padding: 12px !important;
    &:focus {
      background-color: $color-black;
    }
  }
}
</style>
