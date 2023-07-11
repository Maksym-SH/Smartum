<template>
  <div class="task-column">
    <div class="task-column__header">
      <div class="task-column__header-name">
        <AppInput
          @blur="saveColumnName"
          @keyup.enter.exact="saveColumnName"
          v-model="editableColumnName"
          :min="Length.TEXT"
          ref="columnNameRef"
        />
      </div>
      <AppButton
        @click="columnSettings"
        class="task-column__header-params"
        variant="text"
        icon="dots-horizontal"
      />
    </div>
    <Draggable
      v-model="column.tasks"
      :animation="Numbers.ANIMATION_TASK_MOVE"
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
import { defineComponent, PropType, ref, watch } from "vue";
import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";
import Task from "./TaskItem.vue";
import AddNewTask from "./TaskAddNew.vue";
import Draggable from "vuedraggable";

import type { IWorkingBoardTask, IWorkingBoardTaskColumn } from "@/types/interfaces/board";
import { Numbers, Length } from "@/types/enums";
import { InputInstance } from "@/types/types";

export default defineComponent({
  components: {
    Task,
    AddNewTask,
    Draggable,
  },
  emits: ["taskCreatedInColumn", "update:column-title", "update:column-tasks", "save-changes"],
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

    const columnNameRef = ref<InputInstance>();

    const editableColumnName = ref(props.columnTitle);

    const showDropZone = ref(false);

    const dropZoneHeight = ref(0);

    const saveColumnName = () => {
      if (columnNameRef.value && editableColumnName.value.length < Length.TEXT) {
        return columnNameRef.value.validator();
      }
      // Blur input;
      columnNameRef.value.inputRef.blur();

      emit("update:column-title", editableColumnName.value);

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

    // Update column name.
    watch(
      () => props.columnTitle,
      (newName) => {
        editableColumnName.value = newName;
      }
    );

    return {
      editableColumnName,
      showDropZone,
      Numbers,
      dropZoneHeight,
      columnNameRef,
      Length,
      createTask,
      dragEnd,
      dragStart,
      saveColumnName,
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
    padding: 0 4px 12px 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;

    &-name {
      width: 100%;

      :deep(.c-input) {
        padding: 0;

        .c-input__field {
          font-size: 14px;
          padding: 2px;
          align-self: center;
          width: 100%;
          cursor: pointer;
          border-color: transparent;
          border-radius: 0;
          line-height: 16px;

          &:focus {
            transition: all 0.2s ease;
            border-color: var(--color-text);
            outline-offset: 2px;
          }
        }
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
