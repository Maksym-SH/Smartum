<template>
  <div class="add-new-task">
    <AddNew
      input-placeholder="Ввести заголовок для этой карточки"
      button-title="Добавить карточку"
      buttonVariant="text"
      :new-id="taskLength"
      @create="createTask"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Length } from "@/types/enums";
import { IWorkingBoardTask } from "@/types/interfaces";

import AddNew from "./AddNew.vue";

export default defineComponent({
  components: {
    AddNew,
  },
  emits: ["createTask"],
  props: {
    taskLength: {
      type: Number,
      required: true,
    },
  },
  setup(_, { emit }) {
    const createTask = (newTask: IWorkingBoardTask) => {
      newTask.assignedMembers = [];
      newTask.comments = [];

      emit("createTask", newTask);
    };

    return {
      Length,
      createTask,
    };
  },
});
</script>

<style lang="scss" scoped>
.add-new-task {
  transition: all 0.5s ease;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
}
</style>
