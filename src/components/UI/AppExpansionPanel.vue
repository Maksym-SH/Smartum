<template>
  <VExpansionPanels :variant="variant">
    <VExpansionPanel>
      <VExpansionPanelTitle>
        <InlineSvg v-if="icon" :src="`/images/icons/${icon}.svg`" class="icon" />
        <span class="text" :class="{ 'no-icon': !icon }">{{ title }}</span>
        <template #actions="{ expanded }">
          <InlineSvg
            class="expansion-icon"
            :class="{ expanded }"
            src="/images/icons/caret.svg"
            v-bind="expanded"
          />
        </template>
      </VExpansionPanelTitle>
      <template v-if="showExpansionPanelContent">
        <VExpansionPanelText
          v-for="(item, index) in content"
          :key="index"
          @click="item.callback()"
        >
          {{ item.title }}
        </VExpansionPanelText>
      </template>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useExpansionPanelProps } from "./use/useProps";

import InlineSvg from "vue-inline-svg";
import {
  VExpansionPanel,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VExpansionPanels,
} from "vuetify/components";

export default defineComponent({
  components: {
    InlineSvg,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelTitle,
    VExpansionPanelText,
  },
  props: useExpansionPanelProps,
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

  .expansion-icon {
    transition: all 0.2s;
    transform: rotate(-90deg) scale(1.2);

    &.expanded {
      transform: rotate(90deg) scale(1.2);
    }
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
