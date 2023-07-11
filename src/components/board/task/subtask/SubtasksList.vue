<template>
  <div class="subtasks">
    <AddNewSubtask :list-length="subtasksList.length" @create-new="createNewSubtask" />
    <transition-group class="subtasks__items" tag="div" name="smooth-height">
      <Subtask
        v-for="(subtask, index) in subtasksList"
        :key="subtask.id"
        :subtask="subtask"
        :count="index + 1"
        :status="subtask.done"
        @delete="deleteSubtask"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { OpenPopup } from "@/helpers/methods";

import i18n from "@/i18n";
import AddNewSubtask from "./SubtaskAddNew.vue";
import Subtask from "./SubtaskItem.vue";

import { Length, Colors } from "@/types/enums";
import type { PropType } from "vue";
import type { ISubTask } from "@/types/interfaces/board";

export default defineComponent({
  props: {
    subtasks: {
      type: Array as PropType<ISubTask[]>,
      required: true,
    },
  },
  components: {
    AddNewSubtask,
    Subtask,
  },
  emits: ["update:subtasks"],
  setup(props, { emit }) {
    const { t } = i18n.global;

    const subtasksList = ref(props.subtasks);

    const createNewSubtask = (newSubtask: ISubTask): void => {
      subtasksList.value.push(newSubtask);

      emit("update:subtasks", subtasksList.value);
    };

    const deleteSubtask = ({ id, title }: Omit<ISubTask, "done">) => {
      OpenPopup({
        title: t("popup.deleteSubtask.title"),
        text: t("popup.deleteSubtask.text", {
          subtask: title,
        }),
        buttons: {
          yes: {
            text: t("buttons.delete"),
          },
        },
        callback: () => {
          const foundSubtaskIndex = subtasksList.value.findIndex(
            (subtask) => subtask.id === id
          );

          if (foundSubtaskIndex !== -1) {
            subtasksList.value.splice(foundSubtaskIndex, 1); // Delete subtask item.
          }

          emit("update:subtasks", subtasksList.value);
        },
      });
    };

    watch(
      () => props.subtasks,
      (list) => {
        subtasksList.value = list;
      }
    );

    return {
      subtasksList,
      Length,
      Colors,
      createNewSubtask,
      deleteSubtask,
    };
  },
});
</script>

<style lang="scss" scoped>
.subtasks {
  width: 100%;
  min-height: 70px;

  &__items {
    margin-top: 15px;
    display: inline-flex;
    flex-direction: column;
    gap: 5px;
  }

  @include mobile(max) {
    width: 100%;
  }
}
</style>
