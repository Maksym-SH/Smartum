<template>
  <v-expansion-panels :variant="variant">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <span v-if="icon" class="icon" :class="['mdi', `mdi-${icon}`]"></span>
        <span class="text" :class="{ 'no-icon': !icon }">{{ name }}</span>
      </v-expansion-panel-title>
      <template v-if="showExpansionPanelContent">
        <v-expansion-panel-text
          v-for="(item, index) in content"
          :key="index"
          @click="item.callback()"
        >
          <span>
            {{ item.title }}
          </span>
        </v-expansion-panel-text>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useExpansionPanelProps } from "./use/useProps";

export default defineComponent({
  props: useExpansionPanelProps,
  setup(props) {
    const showExpansionPanelContent = computed(
      (): number => props.content.length
    );

    return {
      showExpansionPanelContent,
    };
  },
});
</script>

<style lang="scss" scoped>
.v-expansion-panel {
  background-color: transparent;
  color: $color-white1;
  border-radius: 0;
  &:hover {
    background-color: $color-dark-grey3;
  }
  &-text {
    background-color: $color-dark-grey;
    cursor: pointer;
    font-size: 13px;
    &:active {
      background-color: $color-dark-grey3;
    }
    &:hover {
      background-color: $color-dark-grey2;
    }
    :deep(.v-expansion-panel-text__wrapper) {
      padding: 16px 24px;
    }
  }
  &-title {
    .icon {
      margin-right: 12px;
      max-width: 14px;
      max-height: 14px;
    }
    .no-icon {
      padding-left: 26px;
    }
  }
}
</style>
