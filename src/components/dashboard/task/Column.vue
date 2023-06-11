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
      <cButton class="task-column__header-params" variant="text" icon="dots-horizontal" />
    </div>
    <Draggable
      v-model="column.tasks"
      :animation="Numbers.AnimationTaskMove"
      group="tasks"
      class="task-column__tasks"
      item-key="tasks"
      :class="{ 'drop-zone': showDropZone }"
      @start="showDropZone = true"
      @end="dragEnd"
    >
      <template #item="{ element }">
        <Task :task="element" />
      </template>
    </Draggable>
    <AddNewTask :task-length="taskLength" @createTask="createTask" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import type { IWorkingBoardTask, IWorkingBoardTaskColumn } from "@/types/interfaces";
import { Numbers } from "@/types/enums";

import Task from "./Task.vue";
import AddNewTask from "./AddNewTask.vue";
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
    const categoryTitle = ref("");

    const taskLength = computed((): number => {
      return props.column.tasks?.length || 0;
    });

    const showDropZone = ref(false);

    const changeColumnName = (event: Event) => {
      emit("update:column-title", (event.target as HTMLInputElement).innerText);
    };

    const saveColumnName = () => {
      emit("save-changes");
    };

    const dragEnd = () => {
      emit("update:column-tasks", props.columnTasks || []);
      showDropZone.value = false;

      emit("save-changes");
    };

    const createTask = (newTask: IWorkingBoardTask): void => {
      props.columnTasks.push(newTask);
      emit("update:column-tasks", props.columnTasks || []);

      emit("save-changes");
    };

    return {
      taskLength,
      categoryTitle,
      showDropZone,
      Numbers,
      createTask,
      dragEnd,
      saveColumnName,
      changeColumnName,
    };
  },
});
</script>

<style lang="scss" scoped>
.task-column {
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
      min-height: 55px;
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
