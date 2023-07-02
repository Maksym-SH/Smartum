<template>
  <div class="task-column">
    <div class="task-column__header">
      <h3
        @input="changeColumnName"
        @blur="saveColumnName"
        class="task-column__header-title"
        contenteditable
        @keydown.enter.prevent
      >
        {{ columnTitle }}
      </h3>
      <AppButton
        @click="columnSettings"
        class="task-column__header-params"
        variant="text"
        icon="dots-horizontal"
      />
    </div>
    <Draggable
      v-model="column.tasks"
      :animation="Numbers.AnimationTaskMove"
      group="tasks"
      class="task-column__tasks"
      item-key="tasks"
      :class="{ 'drop-zone': showDropZone }"
      :style="{ height: showDropZone ? dropZoneHeight + 'px' : 'auto' }"
      @start="dragStart"
      @end="dragEnd"
    >
      <template #item="{ element }">
        <Task :task="element" :column-id="column.id" />
      </template>
    </Draggable>
    <AddNewTask @createTask="createTask" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import type { IWorkingBoardTask, IWorkingBoardTaskColumn } from "@/types/interfaces";
import { Numbers } from "@/types/enums";
import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";
import Task from "./TaskItem.vue";
import AddNewTask from "./TaskAddNew.vue";
import Draggable from "vuedraggable";

export default defineComponent({
  components: {
    Task,
    AddNewTask,
    Draggable,
  },
  emits: [
    "taskCreatedInColumn",
    "update:column-title",
    "update:column-tasks",
    "save-changes",
  ],
  props: {
    column: {
      type: Object as PropType<IWorkingBoardTaskColumn>,
      required: true,
    },
    columnTitle: {
      type: String,
      required: true,
    },
    columnTasks: {
      type: Array as PropType<IWorkingBoardTask[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = i18n.global;

    const categoryTitle = ref("");

    const showDropZone = ref(false);

    const dropZoneHeight = ref(0);

    const changeColumnName = (event: Event) => {
      emit("update:column-title", (event.target as HTMLInputElement).innerText);
    };

    const saveColumnName = () => {
      emit("save-changes");
    };

    // Drag handlers.
    const dragStart = (e: Event): void => {
      dropZoneHeight.value = (e.target as HTMLDivElement).clientHeight;
      showDropZone.value = true;
    };
    const dragEnd = (): void => {
      emit("update:column-tasks", props.columnTasks || []);
      showDropZone.value = false;

      emit("save-changes");
    };

    const createTask = (newTask: IWorkingBoardTask): void => {
      props.columnTasks.push(newTask);
      emit("update:column-tasks", props.columnTasks || []);

      emit("save-changes");
    };

    const columnSettings = () => {
      notify({
        title: t("notify.development.title"),
        type: "success",
      });
    };

    return {
      categoryTitle,
      showDropZone,
      Numbers,
      dropZoneHeight,
      createTask,
      dragEnd,
      dragStart,
      saveColumnName,
      changeColumnName,
      columnSettings,
    };
  },
});
</script>

<style lang="scss" scoped>
.task-column {
  max-width: 250px;
  min-width: 250px;
  padding: 4px;
  border-radius: 4px;
  height: fit-content;
  background-color: var(--color-background);
  transition: all 0.3s;

  &__tasks {
    display: flex;
    flex-direction: column;
    min-height: 25px;
    cursor: default;
    gap: 10px;
    border: 1px dashed transparent;
    padding: 2px;

    &.drop-zone {
      border-color: $color-blue;
      border-radius: 4px;
    }
  }

  &__header {
    max-width: 350px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    &-title {
      font-size: 14px;
      width: 80%;
      font-family: $RobotoRG;
      color: var(--color-text);
      cursor: pointer;

      &:focus {
        border: 0;
        outline: 1px solid var(--color-text);
        cursor: text;
        outline-offset: 1px;
        border-radius: 4px;
      }
    }

    &-params {
      padding: 0 5px;
      height: 25px;
      color: var(--color-text) !important;
    }
  }

  &__list {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .add-new-task {
    margin-top: 10px;
  }
}
</style>
