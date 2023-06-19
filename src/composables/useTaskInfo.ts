import { ref, computed, watch, onMounted } from "vue";
import { CreateDebounce, ObjectHasValues, TheSameObject } from "@/helpers/methods";
import { storeToRefs } from "pinia";

import useStores from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import { IUserForList, IWorkingBoardTask } from "@/types/interfaces";
import useDateParseToString from "./useDateParse";
import { notify } from "@kyvg/vue3-notification";
import { Numbers } from "@/types/enums";

export default function useTaskInfo(columnId: number, taskId: number) {
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

    descriptionText.value = "";

    toggleEditDescriptionMode(false);
  };

  const getCurrentTask = (): void => {
    const currentColumn = boardItem.value.columns[columnId];

    columnName.value = currentColumn.title;

    const taskIndex = currentColumn.tasks.findIndex((task) => task.id === taskId);
    currentTask.value = currentColumn.tasks[taskIndex];

    // Set marks.
    const marksExist = currentTask.value.marks;
    currentTask.value.marks = marksExist ?? [];

    // Set description
    const descriptionExist = currentTask.value.description;
    currentTask.value.description = descriptionExist ?? "";
    descriptionText.value = currentTask.value.description;

    editDescriptionMode.value = !currentTask.value.description ? true : false;

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
        title: "Карточка была перемещена!",
        text: "Окно дополнительной информации было закрыто",
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

  const debounce = CreateDebounce(Numbers.Second);
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
    columnName,
    dateSent,
    editDescriptionMode,
    currentMember,
    boardMembers,
    descriptionText,
    saveDescriptionText,
    toggleEditDescriptionMode,
  };
}
