<template>
  <div class="card-element-item">
    <div class="card-element-item__background">
      <BoardImageResult
        :background="element.background"
        :image="element.background"
        image-decor="/images/dashboard-template.webp"
      />
    </div>
    <div class="card-element-item__content">
      <h4 class="card-element-item__title text-ellipsis">
        {{ element.title }}
      </h4>
      <div class="card-element-item__description">
        <p v-if="element.members" class="members-count">
          <InlineSvg src="/images/icons/account-multiple.svg" class="icon" />
          {{ $t("common.members") }} {{ membersCount }}
        </p>
        <time v-if="element.dateOfCreation" class="date-of-create">
          <InlineSvg src="/images/icons/clock-edit.svg" class="icon" />
          {{ dateOfCreate }}
        </time>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import InlineSvg from "vue-inline-svg";
import type { PropType } from "vue";
import useCurrentLanguage from "@/composables/useCurrentLanguage";
import useDateParseToString from "@/composables/useDateParse";
import BoardImageResult from "@/components/board/BoardImageResult.vue";

import type { Language } from "@/types/enums";
import type { IWorkingBoardItem } from "@/types/interfaces/board";

export default defineComponent({
  components: {
    BoardImageResult,
    InlineSvg,
  },
  props: {
    element: {
      type: Object as PropType<IWorkingBoardItem>,
      required: true,
    },
  },
  setup(props) {
    const { i18nLocale } = useCurrentLanguage();

    const dateOfCreate = computed(() =>
      useDateParseToString(props.element.dateOfCreation, i18nLocale.value as Language)
    );

    const membersCount = computed((): number => {
      // Filter by only members.
      return props.element.members.filter((item) => !item.invited).length;
    });

    return {
      dateOfCreate,
      membersCount,
    };
  },
});
</script>

<style lang="scss" scoped>
.card-element-item {
  min-width: 240px;
  cursor: pointer;
  box-shadow: 0 10px 5px rgba($color-black, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  &__content {
    padding: 5px 10px;
    transition: background-color 0.3s;
    background-color: var(--color-dashboard-card);
  }

  &__title {
    font-weight: 500;
    padding-left: 6px;
    color: var(--color-text);
  }

  &__background {
    :deep(.background-result__wrapper) {
      width: 100%;
      border-radius: 4px 4px 0 0;

      .background-result__image {
        width: 100%;
      }
    }
  }

  &__description {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    transition: background-color 0.3s;
    background-color: var(--color-dashboard-card);

    .members-count,
    .date-of-create {
      font-size: 11px;
      line-height: 13px;
      color: var(--color-text);
      opacity: 0.7;
      display: flex;
      align-items: flex-end;
      gap: 5px;

      .icon {
        width: 16px;
      }
    }
  }
}
</style>
