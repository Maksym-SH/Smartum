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
          Участников: {{ membersCount }}
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
import { computed, PropType } from "vue";
import { defineComponent } from "vue";
import type { IWorkingBoardItem } from "@/types/interfaces";

import InlineSvg from "vue-inline-svg";
import useDateParseToString from "@/composables/useDateParse";
import BoardImageResult from "@/components/board/BoardImageResult.vue";

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
    const dateOfCreate: string = useDateParseToString(props.element.dateOfCreation);

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
    background-color: var(--color-dasboard-card);
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
    background-color: var(--color-dasboard-card);

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