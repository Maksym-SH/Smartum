<template>
  <div class="task-column">
    <div class="task-column__header">
      <h3
        @input="changeColumnName"
        class="task-column__header-title"
        contenteditable
        @keydown.enter.prevent
      >
        {{ column.title }}
      </h3>
      <cButton
        class="task-column__header-params"
        variant="text"
        icon="mdi-dots-horizontal"
      />
    </div>
    <transition-group
      tag="div"
      name="toggle-content"
      moe="out-in"
      class="task-column__list"
    >
      <Task v-for="task in column.tasks" :key="task.id" :task="task" />
    </transition-group>
    <AddNewTask :task-length="taskLength" @createTask="createTask" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import type { IWorkingBoardTask, IWorkingBoardTaskColumn } from "@/types/interfaces";

import Task from "./Task.vue";
import AddNewTask from "./AddNewTask.vue";

export default defineComponent({
  components: {
    Task,
    AddNewTask,
  },
  emits: ["taskCreatedInColumn", "update:column-title", "update:column-tasks"],
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
      return props.column.tasks.length;
    });

    const changeColumnName = (event: Event) => {
      emit("update:column-title", (event.target as HTMLInputElement).innerText);
    };

    const createTask = (newTask: IWorkingBoardTask): void => {
      props.columnTasks.push(newTask);
      emit("update:column-tasks", props.columnTasks);
    };

    return {
      taskLength,
      categoryTitle,
      createTask,
      changeColumnName,
    };
  },
});
</script>

<style lang="scss" scoped>
.task-column {
  min-width: 250px;
  padding: 5px;
  border-radius: 4px;
  height: fit-content;
  background-color: var(--color-background);
  &__header {
    max-width: 350px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    &-title {
      font-size: 16px;
      width: 80%;
      color: var(--color-text);
      cursor: pointer;
      &:focus {
        border: 0;
        outline: 1px solid var(--color-text);
        cursor: text;
        outline-offset: 2px;
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
