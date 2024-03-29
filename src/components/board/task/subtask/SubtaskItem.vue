<template>
  <span class="subtask">
    <span class="subtask__info">
      <AppButton
        class="subtask__info--delete"
        icon="delete-outline"
        :color="Colors.DANGER"
        @click="deleteSubtask"
      />
      <span class="subtask__info-count"> {{ count }}.</span>
      <AppCheckbox
        v-model="statusModel"
        line-through
        :name="`subtask-${subtask.id}`"
        :label="subtask.title"
        :class="{ active: status }"
      />
    </span>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import AppButton from "@/components/UI/AppButton.vue";
import AppCheckbox from "@/components/UI/AppCheckbox.vue";

import { Colors } from "@/types/enums";
import type { PropType } from "vue";
import type { ISubTask } from "@/types/interfaces/board";

export default defineComponent({
  components: {
    AppButton,
    AppCheckbox,
  },
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
  align-items: flex-start;
  gap: 20px;

  &__info {
    display: inline-flex;
    align-items: center;

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
      width: 100%;
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
        padding: 0 18px;
      }

      .c-checkbox {
        font-size: 11px;
      }
    }
  }
}
</style>
