<template>
  <div class="subtasks">
    <form class="subtasks__new" @submit.prevent="addNewSubtask">
      <cInput
        v-model="newSubtaskTitle"
        :min="Length.Text"
        :maxLength="Length.Maximum"
        placeholder="Добавить новую подзадачу"
      />
      <cButton icon="plus" type="submit" :disabled="!newSubtaskTitle" />
    </form>
    <transition-group class="subtasks__items" tag="div" name="smooth-height">
      <span v-for="(subtask, index) in subtasks" :key="subtask.id" class="subtasks__item">
        <span class="subtaks__item-info">
          <cButton
            class="subtasks__item--delete"
            icon="delete-outline"
            :color="Colors.Danger"
            @click="deleteSubtask(subtask.id, subtask.title)"
          />
          <span class="subtasks__item-count"> {{ index + 1 }}. </span>
          <cCheckbox
            line-through
            :name="`subtask-${subtask.id}`"
            :label="subtask.title"
            v-model="subtask.done"
            :class="{ active: subtask.done }"
          />
        </span>
      </span>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import type { PropType } from "vue";
import type { ISubTasks } from "@/types/interfaces";
import { Length, Colors } from "@/types/enums";
import { OpenPopup } from "@/helpers/methods";

export default defineComponent({
  props: {
    subtasks: {
      type: Array as PropType<ISubTasks[]>,
      required: true,
    },
  },
  emits: ["update:subtasks"],
  setup(props, { emit }) {
    const newSubtaskTitle = ref("");

    const addNewSubtask = () => {
      if (newSubtaskTitle.value.length < Length.Text) return;

      const newSubtask: ISubTasks = {
        id: props.subtasks.length,
        title: newSubtaskTitle.value,
        done: false,
      };

      props.subtasks.push(newSubtask);

      newSubtaskTitle.value = "";
    };

    const deleteSubtask = (id: number, title: string) => {
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

    return {
      newSubtaskTitle,
      Length,
      Colors,
      addNewSubtask,
      deleteSubtask,
    };
  },
});
</script>

<style lang="scss" scoped>
.subtasks {
  width: 100%;
  min-height: 70px;

  &__new {
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

  &__items {
    margin-top: 15px;
    display: inline-flex;
    flex-direction: column;
    gap: 5px;
  }

  &__item {
    display: inline-flex;
    align-items: flex-end;
    gap: 20px;
    white-space: nowrap;

    &--delete {
      width: 15px;
      height: 22px;
      color: $color-white1;
      margin-right: 10px;
    }

    &-count {
      margin-right: 10px;
      color: var(--color-text);
    }
  }

  @include mobile(max) {
    width: 100%;

    .c-input {
      max-width: none;
    }

    .subtasks__item {
      .c-checkbox {
        font-size: 13px;
      }
    }
  }

  @include responsive($us, max) {
    .subtasks__item {
      gap: 8px;

      &-count {
        display: none;
      }

      &--delete {
        padding: 0 10px;
        margin-right: 5px;
      }

      .c-checkbox {
        font-size: 10.7px;
      }
    }
  }
}
</style>
