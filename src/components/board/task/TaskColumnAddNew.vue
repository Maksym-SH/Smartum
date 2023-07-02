<template>
  <div class="add-new-column" :class="{ 'task-column': columnStyle }">
    <AddNew
      :input-placeholder="$t('labels.newColumn')"
      :button-title="$t('buttons.addColumn')"
      :new-id="columnLength"
      @create="createColumn"
      @click="columnStyle = true"
      @close="columnStyle = false"
    />
  </div>
</template>

<script lang="ts">
import { Length } from "@/types/enums";
import type { IWorkingBoardTaskColumn } from "@/types/interfaces";
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

    const columnStyle = ref(false);

    const createColumn = (newColumn: IWorkingBoardTaskColumn) => {
      newColumn.tasks = [];

      emit("createColumn", newColumn);
    };

    return {
      columnTitle,
      columnStyle,
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
    transition: background-color 0.3s;
    background-color: var(--color-background);
  }

  .creation-mode {
    min-height: 100px;
  }
}
</style>
