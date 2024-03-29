<template>
  <div ref="columnRef" class="task-column" :class="{ active: activeColumn }">
    <div class="task-column__header">
      <div class="task-column__header-name">
        <AppInput
          ref="columnNameRef"
          v-model="editableColumnName"
          :min="Length.TEXT"
          @blur="saveColumnName"
          @keyup.enter.exact="saveColumnName"
        />
      </div>
      <AppButton
        class="task-column__header-params"
        variant="text"
        icon="dots-horizontal"
        @click="columnSettings"
      />
    </div>
    <Draggable
      v-model="columnTasksList"
      :animation="Numbers.ANIMATION_TASK_MOVE"
      group="tasks"
      class="task-column__tasks"
      item-key="tasks"
      :class="{ 'drop-zone': showDropZone }"
      :style="{ height: showDropZone ? `${dropZoneHeight}px` : 'auto' }"
      @start="dragStart"
      @end="dragEnd"
    >
      <template #item="{ element }">
        <Task
          :task="element"
          :column-id="column.id"
          @show-column="setActiveCurrentColumn"
        />
      </template>
    </Draggable>
    <AddNewTask @create-task="createTask" />
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { computed, defineComponent, ref, watch } from "vue";
import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";
import useStores from "@/composables/useStores";

import Draggable from "vuedraggable";
import Task from "./TaskItem.vue";
import AddNewTask from "./TaskAddNew.vue";
import AppInput from "@/components/UI/AppInput.vue";
import AppButton from "@/components/UI/AppButton.vue";

import type { IWorkingBoardTask, IWorkingBoardTaskColumn } from "@/types/interfaces/board";
import { Activity, Length, Numbers } from "@/types/enums";
import type { InputInstance } from "@/types";

export default defineComponent({
  components: {
    Task,
    AddNewTask,
    Draggable,
    AppInput,
    AppButton,
  },
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
  emits: ["taskCreatedInColumn", "update:columnTitle", "update:columnTasks", "saveChanges"],
  setup(props, { emit }) {
    const { t } = i18n.global;

    const { statisticsStore } = useStores();

    const columnTasksList = computed<IWorkingBoardTask[]>({
      get() {
        return props.column.tasks;
      },
      set(value) {
        emit("update:columnTasks", value);
      },
    });

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

      emit("update:columnTitle", editableColumnName.value);

      emit("saveChanges");
    };

    // Active column handlers.
    const columnRef = ref<HTMLDivElement>();

    const activeColumn = ref(false);

    const setActiveCurrentColumn = (): void => {
      if (columnRef.value) {
        columnRef.value.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }

      activeColumn.value = true;
      setTimeout(() => (activeColumn.value = false), Numbers.SECOND * 2);
    };

    // Drag handlers.
    const dragStart = (e: Event): void => {
      dropZoneHeight.value = (e.target as HTMLDivElement).clientHeight;
      showDropZone.value = true;
    };
    const dragEnd = (): void => {
      emit("update:columnTasks", columnTasksList.value);
      showDropZone.value = false;

      statisticsStore.incrementStatisticItem(Activity.MOVED_TASKS);
      emit("saveChanges");
    };

    const createTask = (newTask: IWorkingBoardTask): void => {
      columnTasksList.value.push(newTask);
      emit("update:columnTasks", columnTasksList.value);

      statisticsStore.incrementStatisticItem(Activity.CREATED_TASKS);
      emit("saveChanges");
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
      columnTasksList,
      editableColumnName,
      showDropZone,
      Numbers,
      dropZoneHeight,
      columnRef,
      columnNameRef,
      activeColumn,
      Length,
      createTask,
      dragEnd,
      dragStart,
      saveColumnName,
      columnSettings,
      setActiveCurrentColumn,
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

  &.active {
    background-color: $color-dark-blue;
  }

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

  @include mobile(max) {
    max-width: 210px;
    min-width: 210px;

    &__header {
      gap: 3px;

      &-name {
        :deep(.c-input) {
          .c-input__field {
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>
