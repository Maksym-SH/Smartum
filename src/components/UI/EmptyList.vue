<template>
  <div class="empty-list">
    <img class="empty-list__icon" src="/images/icons/sad-smile.svg" alt="" />
    <h2 class="empty-list__title">
      {{ descriptionContent }}
    </h2>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";
import type { EmptyListType } from "@/types/types";

export default defineComponent({
  props: {
    type: {
      type: String as PropType<EmptyListType>,
      required: true,
    },
  },
  setup(props) {
    const descriptionContent = computed((): string => {
      if (props.type === "dashboard") return "Список рабочих досок пуст.";
      else if (props.type === "notification") return "Список уведомлений пуст.";

      // ToDo: smt else
      return "";
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
