<template>
  <v-expansion-panels :variant="variant">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <InlineSvg v-if="icon" :src="`/images/icons/${icon}.svg`" class="icon" />
        <span class="text" :class="{ 'no-icon': !icon }">{{ name }}</span>
      </v-expansion-panel-title>
      <template v-if="showExpansionPanelContent">
        <v-expansion-panel-text
          v-for="(item, index) in content"
          :key="index"
          @click="item.callback()"
        >
          {{ item.title }}
        </v-expansion-panel-text>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useExpansionPanelProps } from "./use/useProps";

import InlineSvg from "vue-inline-svg";

export default defineComponent({
  props: useExpansionPanelProps,
  components: {
    InlineSvg,
  },
  setup(props) {
    const showExpansionPanelContent = computed((): number => props.content.length);

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
      max-width: 17px;
      max-height: 17px;
    }

    .no-icon {
      padding-left: 26px;
    }
  }
}
</style>
