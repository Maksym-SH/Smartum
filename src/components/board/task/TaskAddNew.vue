<template>
  <div class="add-new-task">
    <AddNew
      :input-placeholder="$t('labels.newTask')"
      :button-title="$t('buttons.addTask')"
      buttonVariant="text"
      @create="createTask"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import AddNew from "./AddNew.vue";

import { Length } from "@/types/enums";
import { IWorkingBoardTask } from "@/types/interfaces/board";

export default defineComponent({
  components: {
    AddNew,
  },
  emits: ["createTask"],
  setup(_, { emit }) {
    const createTask = (newTask: IWorkingBoardTask) => {
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
