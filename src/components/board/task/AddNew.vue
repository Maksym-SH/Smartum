<template>
  <div class="add-new" :class="{ 'creation-mode': showCreationTemplate }">
    <transition name="toggle-content" mode="out-in">
      <AppButton
        v-if="!showCreationTemplate"
        v-bind="$attrs"
        @click="showCreationTemplate = true"
        icon="plus"
        size="small"
        :title="buttonTitle"
        :variant="buttonVariant"
        class="add-new__button"
      />
      <form v-else class="add-new__params" @submit.prevent="create">
        <AppInput
          class="add-new__params-input"
          v-model="title"
          :maxLength="Length.Maximum"
          :min="Length.Text"
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
            @click="closeCreateMode"
            class="add-new__params-actions--close"
            variant="text"
            icon="close"
          />
        </div>
      </form>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { Length } from "@/types/enums";
import { IWorkingBoardTask, IWorkingBoardTaskColumn } from "@/types/interfaces";
import { ButtonVariant } from "@/types/types";

export default defineComponent({
  inheritAttrs: false,
  emits: ["create", "close"],
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
  setup(props, { emit }) {
    const title = ref("");

    const showCreationTemplate = ref(false);

    const create = () => {
      if (title.value.length < Length.Text) return;

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
}
</style>
