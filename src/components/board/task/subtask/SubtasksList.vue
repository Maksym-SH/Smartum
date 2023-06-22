<template>
  <div class="subtasks">
    <AddNewSubtask :new-id="subtasks.length" @create-new="createNewSubtask" />
    <transition-group class="subtasks__items" tag="div" name="smooth-height">
      <Subtask
        v-for="(subtask, index) in subtasks"
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
import { defineComponent, watch } from "vue";
import type { PropType } from "vue";
import type { ISubTask } from "@/types/interfaces";
import { Length, Colors } from "@/types/enums";
import { OpenPopup } from "@/helpers/methods";

import AddNewSubtask from "./SubtaskAddNew.vue";
import Subtask from "./SubtaskItem.vue";

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
    const createNewSubtask = (newSubtask: ISubTask): void => {
      props.subtasks.push(newSubtask);
    };

    const deleteSubtask = ({ id, title }: Omit<ISubTask, "done">) => {
      OpenPopup({
        title: "Удаление подзадачи",
        text: `Вы действительно хотите удалить задачу '${title}'?`,
        buttons: {
          yes: {
            text: "Удалить",
          },
        },
        callback: () => {
          const foundSubtaskIndex = props.subtasks.findIndex(
            (subtask) => subtask.id === id
          );

          if (foundSubtaskIndex !== -1) {
            props.subtasks.splice(foundSubtaskIndex, 1); // Delete subtask item.
          }
        },
      });
    };

    watch(props.subtasks, (list) => {
      emit("update:subtasks", list);
    });

    return { Length, Colors, createNewSubtask, deleteSubtask };
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