<template>
  <div class="card-element-item">
    <div class="card-element-item__background">
      <BoardImageResult 
        :background="element.background" 
        image-decor="/images/icons/dashboard-template.webp" 
        :image="element.background" 
      />
    </div>
    <div class="card-element-item__content">
      <h4 class="card-element-item__title text-ellipsis">
        {{ element.title }}
      </h4>
      <div class="card-element-item__description">
        <p v-if="element.members" class="members-count"> 
          <span class="mdi mdi-account-multiple icon"></span>
          Участников: {{ element.members }}
        </p>
        <time v-if="element.dateOfCreation" class="date-of-create">
          <span class="mdi mdi-clock-edit icon"></span>
          {{ dateOfCreate }}
        </time>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { IServerDate, IWorkingBoardItem } from '@/interfaces';
import { defineComponent, PropType } from 'vue';

import BoardImageResult from "@/components/dashboard/BoardImageResult.vue";
import useDateParseToString from '@/composables/useDateParse';

export default defineComponent({ 
  components: {
    BoardImageResult
  },
  props: {
    element: {
      type: Object as PropType<IWorkingBoardItem<Date | IServerDate>>,
      required: true,
    }
  },
  setup(props) {
    const dateOfCreate = useDateParseToString(props.element.dateOfCreation);

    return {
      dateOfCreate
    }
  }
})

</script>


<style lang="scss" scoped>
.card-element-item {
  min-width: 240px;
  cursor:  pointer;
  box-shadow: 0 10px 5px rgba($color-black, 0.2);
  &__content {
    border-radius: 0 0 5px 5px;
    padding: 5px 10px;
    background-color:var(--color-dasboard-card);
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
    border: 1px solid var(--color-dasboard-card);
    background-color: var(--color-dasboard-card);
    .members-count, .date-of-create {
      font-size: 11px;
      color: var(--color-text);
      opacity: 0.7;
      display: flex;
      align-items: center;
      gap: 5px;
      .icon {
        font-size: 14px;
      }
    }
  }
}
</style>