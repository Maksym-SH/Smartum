<template>
  <div class="empty-list">
    <img class="empty-list__icon" src="/images/icons/sad-smile.svg" alt="" />
    <h2 class="empty-list__title">
      {{ descriptionContent }}
    </h2>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useEmptyListProps } from "./use/useProps";

import i18n from "@/i18n";

import { EmptyListType } from "@/types/enums";

export default defineComponent({
  props: useEmptyListProps,
  setup(props) {
    const { t } = i18n.global;

    const descriptionContent = computed((): string => {
      switch (props.type) {
        case EmptyListType.DASHBOARD:
          return t("emptyList.boards");
        case EmptyListType.NOTIFICATIONS:
          return t("emptyList.notifications");
        // ToDo: smt else
        default:
          return "";
      }
    });

    return {
      descriptionContent,
    };
  },
});
</script>

<style lang="scss" scoped>
.empty-list {
  display: flex;
  align-items: center;
  flex-direction: column;

  &__icon {
    width: 70px;
    height: 70px;
  }

  &__title {
    color: var(--color-text);
    margin-top: 10px;
    font-size: 22px;
    font-weight: 400;
    font-family: $RobotoRG;
  }

  @include mobile(max) {
    &__icon {
      width: 60px;
      height: 60px;
    }

    &__title {
      font-size: 18px;
    }
  }
}
</style>
