<template>
  <span class="subtask">
    <span class="subtaks__info">
      <AppButton
        class="subtask__info--delete"
        icon="delete-outline"
        :color="Colors.Danger"
        @click="deleteSubtask"
      />
      <span class="subtask__info-count"> {{ count }}. </span>
      <AppCheckbox
        line-through
        :name="`subtask-${subtask.id}`"
        :label="subtask.title"
        v-model="subtask.done"
        :class="{ active: subtask.done }"
      />
    </span>
  </span>
</template>

<script lang="ts">
import { ISubTask } from "@/types/interfaces";
import { computed, defineComponent } from "vue";
import type { PropType } from "vue";
import { Colors } from "@/types/enums";

export default defineComponent({
  props: {
    count: {
      type: Number,
      default: 0,
    },
    subtask: {
      type: Object as PropType<ISubTask>,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["delete", "update:status"],
  setup(props, { emit }) {
    const statusModel = computed({
      get: () => props.status,
      set: (value) => emit("update:status", value),
    });

    const deleteSubtask = (): void => {
      emit("delete", {
        id: props.subtask.id,
        title: props.subtask.title,
      });
    };

    return {
      Colors,
      statusModel,
      deleteSubtask,
    };
  },
});
</script>

<style lang="scss" scoped>
.subtask {
  display: inline-flex;
  align-items: flex-end;
  gap: 20px;
  white-space: nowrap;

  &__info {
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
    .c-checkbox {
      font-size: 13px;
    }
  }

  @include responsive($us, max) {
    gap: 8px;
    &__info {
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
