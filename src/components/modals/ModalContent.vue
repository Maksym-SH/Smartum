<template>
  <VDialog
    v-model="dialog"
    class="modal"
    persistent
    fullscreen
    transition="dialog-bottom-transition"
  >
    <VCard>
      <VToolbar color="indigo" class="modal__actions">
        <AppButton
          class="modal__actions--close"
          icon="close"
          variant="text"
          rounded
          @click="closeModal"
        />
        <VToolbarTitle class="modal__header-title">
          {{ currentContent.title }}
        </VToolbarTitle>
      </VToolbar>
      <VList>
        <div class="modal__content" v-html="currentContent.content" />
      </VList>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";

import i18n from "@/i18n";
import useStores from "@/composables/useStores";

import AppButton from "../UI/AppButton.vue";
import { VCard, VDialog, VList, VToolbar, VToolbarTitle } from "vuetify/components";

import type { PropType } from "vue";
import { ModalContentType } from "@/types/enums";
import type { IModalContent } from "@/types/interfaces/components";

export default defineComponent({
  components: {
    AppButton,
    VCard,
    VDialog,
    VToolbar,
    VList,
    VToolbarTitle,
  },
  props: {
    contentType: {
      type: String as PropType<ModalContentType>,
      required: true,
    },
  },
  setup(props) {
    const { t } = i18n.global;

    const { commonStore } = useStores();

    const dialog = ref(true);

    const currentContent = computed((): IModalContent => {
      if (props.contentType === ModalContentType.TERMS_OF_USE) {
        return {
          title: t("termsOfUse.title"),
          content: t("termsOfUse.content"),
        };
      }

      return {
        title: t("confideniality.title"),
        content: t("confideniality.content"),
      };
    });

    const closeModal = (): void => {
      commonStore.setModalContentType(ModalContentType.NONE);
    };

    watch(dialog, (value) => {
      if (!value) {
        commonStore.setModalContentType(ModalContentType.NONE);
      }
    });

    return {
      dialog,
      currentContent,
      closeModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal {
  z-index: 90 !important;

  &__subheader {
    display: flex;
    justify-content: flex-end;
  }

  .v-list {
    padding: 20px;
    background-color: var(--color-background-secondary);
    color: var(--color-text);

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background: $color-light-grey;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $color-dark-blue;
    }

    .modal__content {
      :deep() {
        h2 {
          margin: 5px;
        }

        ul {
          padding-left: 50px;
        }
      }
    }
  }

  &__actions {
    &--close {
      font-size: 20px;
      color: $color-white1 !important;
      padding: 6px;
    }
  }

  @include tablet(max) {
    .modal {
      &__header {
        padding: 0;
        padding-inline-start: 0 !important;

        &-title {
          margin: 0;
          font-size: 16px;
        }

        :deep(.v-list-subheader__text) {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;

          .modal__mobile-title {
            display: block;
            font-size: 17px;
            color: $color-dark-grey3;
          }

          .c-checkbox {
            align-self: flex-end;
          }
        }
      }
    }

    .v-list {
      padding: 10px;

      &::-webkit-scrollbar {
        width: 3px;
      }

      .modal__content {
        :deep() {
          font-size: 14px;

          h2 {
            margin: 5px;
            font-size: 16px;
          }

          ul {
            padding-left: 10px;
          }
        }
      }
    }
  }
}
</style>
