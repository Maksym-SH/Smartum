<template>
  <div class="add-new" :class="{ 'creation-mode': showCreationTemplate }">
    <transition name="toggle-content" mode="out-in">
      <AppButton
        v-if="!showCreationTemplate"
        v-bind="$attrs"
        icon="plus"
        size="small"
        :title="buttonTitle"
        :variant="buttonVariant"
        class="add-new__button"
        @click="showCreationTemplate = true"
      />
      <form v-else class="add-new__params" @submit.prevent="create">
        <AppInput
          v-model="title"
          class="add-new__params-input"
          :max-length="Length.MAX"
          :min="Length.TEXT"
          :placeholder="inputPlaceholder"
        />
        <div class="add-new__params-actions">
          <AppButton
            class="add-new__params-actions--create"
            type="submit"
            size="small"
            :title="buttonTitle"
          />
          <AppButton
            class="add-new__params-actions--close"
            variant="text"
            icon="close"
            @click="closeCreateMode"
          />
        </div>
      </form>
    </transition>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, ref } from "vue";

import { Length } from "@/types/enums";
import type { IWorkingBoardTask, IWorkingBoardTaskColumn } from "@/types/interfaces/board";
import type { ButtonVariant } from "@/types/types";

export default defineComponent({
  inheritAttrs: false,
  props: {
    newId: {
      type: Number,
      default: 0,
    },
    buttonTitle: {
      type: String,
      required: true,
    },
    inputPlaceholder: {
      type: String,
      required: true,
    },
    buttonVariant: {
      type: String as PropType<ButtonVariant>,
      default: "elevated",
    },
  },
  emits: ["create", "close"],
  setup(props, { emit }) {
    const title = ref("");

    const showCreationTemplate = ref(false);

    const create = () => {
      if (title.value.length < Length.TEXT) {
        return;
      }

      const elementID = props.newId || Date.now();
      const element: Partial<IWorkingBoardTask | IWorkingBoardTaskColumn> = {
        id: elementID,
        title: title.value,
        dateOfCreate: new Date(),
      };

      emit("create", element);

      showCreationTemplate.value = false;
      title.value = "";
    };

    const closeCreateMode = () => {
      showCreationTemplate.value = false;
      emit("close");
    };

    return {
      title,
      showCreationTemplate,
      Length,
      create,
      closeCreateMode,
    };
  },
});
</script>

<style lang="scss" scoped>
.add-new {
  transition: all 0.5s ease;
  border-radius: 4px;

  &.creation-mode {
    padding: 5px;
  }

  &__button {
    width: 100%;
    font-size: 13px;
    font-family: $RobotoRG;
    text-transform: none;
    color: $color-white1;
  }

  &__params {
    .c-input {
      padding-top: 0;

      :deep(.c-input__field) {
        font-size: 11px;
        padding: 6px;
        height: 30px;
      }
    }

    &-actions {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &--create {
        color: $color-white1;
        text-transform: none;
      }

      &--close {
        color: var(--color-text) !important;
        height: fit-content;
        padding: 5px;
      }
    }
  }

  @include mobile(max) {
    &__params {
      .c-input {
        padding-top: 0;

        :deep(.c-input__field) {
          font-size: 10px;
        }
      }

      &-actions {
        &--create {
          font-size: 11px;
        }
      }
    }
  }
}
</style>
