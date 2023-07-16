import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { notify } from "@kyvg/vue3-notification";
import { CreateDebounce, ObjectHasValues, TheSameObject } from "@/helpers/methods";

import i18n from "@/i18n";
import useStores from "@/composables/useStores";
import useDateParseToString from "./useDateParse";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";

import { Length } from "@/types/enums";
import type { IUserForList } from "@/types/interfaces/user";
import type { IWorkingBoardTask } from "@/types/interfaces/board";
import type { InputInstance } from "@/types";

export default function useTaskInfo(columnId: number, taskId: number) {
  const { t } = i18n.global;

  const { dashboardStore } = useStores();

  const { unicID } = useCurrentUserInfo();

  const { boardItem, boardMembers } = storeToRefs(dashboardStore);

  const currentTask = ref<IWorkingBoardTask>({} as IWorkingBoardTask);

  const columnName = ref("");

  const dateSent = ref("");

  const descriptionText = ref("");

  const editDescriptionMode = ref(false);

  const currentMember = computed((): IUserForList => {
    return boardMembers.value.find((item) => item.uid === unicID.value) as IUserForList;
  });

  const toggleEditDescriptionMode = (value: boolean) => {
    if (!currentTask.value.description && !value) {
      editDescriptionMode.value = true;
    } else {
      editDescriptionMode.value = value;
    }
  };

  const saveDescriptionText = (): void => {
    currentTask.value.description = descriptionText.value;

    toggleEditDescriptionMode(false);
  };

  // Task name actions.
  const editableTaskTitle = ref("");

  const taskTitleRef = ref<InputInstance>(null);

  const saveTaskName = (): void => {
    if (editableTaskTitle.value.length < Length.TEXT) {
      return taskTitleRef.value?.validator();
    }

    currentTask.value.title = editableTaskTitle.value;
  };

  const getCurrentTask = (): void => {
    const currentColumn = boardItem.value.columns[columnId];

    columnName.value = currentColumn.title;

    const taskIndex = currentColumn.tasks.findIndex((task) => task.id === taskId);
    currentTask.value = currentColumn.tasks[taskIndex];

    // Set edit title.
    editableTaskTitle.value = currentTask.value.title;

    // Set marks.
    const marksExist = currentTask.value.marks;
    currentTask.value.marks = marksExist ?? [];

    // Set description
    const descriptionExist = currentTask.value.description;
    currentTask.value.description = descriptionExist ?? "";
    descriptionText.value = currentTask.value.description;

    editDescriptionMode.value = !currentTask.value.description;

    // Set comments
    const commentsExist = currentTask.value.comments;
    currentTask.value.comments = commentsExist ?? [];

    // Set assigned members.
    const assignedMembersExist = currentTask.value.assignedMembers;
    currentTask.value.assignedMembers = assignedMembersExist ?? [];

    // Set subtasks.
    const subtasksExist = currentTask.value.subtasks;
    currentTask.value.subtasks = subtasksExist ?? [];
  };

  watch(boardItem, (updatedBoard) => {
    const updatedTask = updatedBoard.columns[columnId].tasks.find(
      (task) => task.id === taskId
    );
    if (!updatedTask) {
      notify({
        title: t("notify.taskModalClosed.title"),
        text: t("notify.taskModalClosed.text"),
      });
    } else if (!TheSameObject(updatedTask, currentTask.value)) {
      getCurrentTask();
    }
  });

  onMounted(() => {
    getCurrentTask();
    dateSent.value = useDateParseToString(currentTask.value.dateOfCreate);
  });

  // Save changes.
  const debounce = CreateDebounce(0); // 0s

  watch(
    currentTask,
    (_, oldValue) => {
      if (ObjectHasValues(oldValue)) {
        const updatedTaskIndex = boardItem.value.columns[columnId].tasks.findIndex(
          (task) => task.id === taskId
        );
        boardItem.value.columns[columnId].tasks[updatedTaskIndex] = currentTask.value;

        debounce(() => dashboardStore.updateWorkingBoard(boardItem.value, false));
      }
    },
    { deep: true }
  );

  return {
    currentTask,
    editableTaskTitle,
    taskTitleRef,
    columnName,
    dateSent,
    editDescriptionMode,
    currentMember,
    boardMembers,
    descriptionText,
    saveTaskName,
    saveDescriptionText,
    toggleEditDescriptionMode,
  };
}
