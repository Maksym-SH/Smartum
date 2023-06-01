<template>
  <div class="add-new-column" :class="{ 'task-column': columnStyleType }">
    <AddNew
      input-placeholder="Ввести заголовок списка"
      button-title="Добавить колонку"
      :new-id="columnLength"
      @create="createColumn"
      @click="columnStyleType = true"
      @close="columnStyleType = false"
    />
  </div>
</template>

<script lang="ts">
import { Length } from "@/types/enums";
import { IWorkingBoardTaskColumn } from "@/types/interfaces";
import { defineComponent, ref } from "vue";

import AddNew from "./AddNew.vue";

export default defineComponent({
  components: {
    AddNew,
  },
  emits: ["createColumn"],
  props: {
    columnLength: {
      type: Number,
      required: true,
    },
  },
  setup(_, { emit }) {
    const columnTitle = ref("");

    const columnStyleType = ref(false);

    const createColumn = (newColumn: IWorkingBoardTaskColumn) => {
      newColumn.tasks = [];

      emit("createColumn", newColumn);
    };

    return {
      columnTitle,
      columnStyleType,
      Length,
      createColumn,
    };
  },
});
</script>

<style lang="scss" scoped>
.add-new-column {
  min-width: 250px;
  &.task-column {
    border-radius: 4px;
    height: fit-content;
    background-color: var(--color-background);
  }
}
</style>
