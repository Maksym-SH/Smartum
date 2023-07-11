<template>
  <form class="subtasks-new" @submit.prevent="addNewSubtask">
    <AppInput
      v-model="newSubtaskTitle"
      :min="Length.TEXT"
      :maxLength="Length.MAX"
      name="subtaskNew"
      :placeholder="$t('labels.newSubTask')"
    />
    <AppButton icon="plus" type="submit" :disabled="!newSubtaskTitle" />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { Length } from "@/types/enums";
import { ISubTask } from "@/types/interfaces/board";

export default defineComponent({
  props: {
    listLength: {
      type: Number,
      required: true,
    },
  },
  emits: ["create-new"],
  setup(props, { emit }) {
    const newSubtaskTitle = ref("");

    const addNewSubtask = () => {
      if (newSubtaskTitle.value.length < Length.TEXT) return;

      const newId = props.listLength + 1;

      const newSubtask: ISubTask = {
        id: newId,
        title: newSubtaskTitle.value,
        done: false,
      };

      emit("create-new", newSubtask);

      newSubtaskTitle.value = "";
    };

    return {
      Length,
      newSubtaskTitle,
      addNewSubtask,
    };
  },
});
</script>

<style lang="scss" scoped>
.subtasks-new {
  display: flex;
  align-items: center;
  gap: 5px;

  .c-input {
    padding: 0;
    width: 100%;
    max-width: 300px;

    :deep(.c-input__field) {
      font-size: 13px;
      padding: 5px 10px;
      height: 30px;
      border-radius: 4px 0 0 4px;
    }
  }
  .c-button {
    color: $color-white1;
    padding: 2px 20px;
    border-radius: 0 4px 4px 0;
    height: 30px;
  }
}
</style>
