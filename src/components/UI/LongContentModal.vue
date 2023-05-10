<template>
  <v-dialog
    v-model="dialog"
    class="modal"
    persistent
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="indigo" class="modal__actions">
        <v-btn icon dark @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="modal__header-title">
          {{
            modalContent.title
          }}
        </v-toolbar-title>
      </v-toolbar>
      <v-list>
        <v-list-subheader class="modal__header">
          <cCheckbox
            v-model="switchLanguage"
            switch-box
            name="language"
            label="English"
            secondary-label="Русский"
          />
        </v-list-subheader>
        <div class="modal__content" v-html="modalContent.text"></div>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import type { IModalContent } from '@/types/interfaces'
import type {
  ModalContentLanguage,
  ModalContentType,
  ModalLanguageType,
} from '@/types/types'

import TermsOfUse from '@/helpers/content/TermsOfUse.json'
import Confidentially from '@/helpers/content/Сonfidentiality.json'
import useStores from '@/composables/useStores'

export default defineComponent({
  props: {
    contentType: {
      type: String as PropType<ModalContentType>,
      required: true,
    },
  },
  setup(props) {
    const { commonStore } = useStores()

    const dialog = ref(true)
    const switchLanguage = ref(false) // "Русский" by default.

    const currentContentType = computed((): IModalContent => {
      if (props.contentType === 'termsOfUse')
        return TermsOfUse

      return Confidentially
    })

    const closeModal = (): void => {
      commonStore.setModalContentType('')
    }

    watch(dialog, (value) => {
      if (!value)
        commonStore.setModalContentType('')
    })

    const currentLanguage = computed((): ModalLanguageType => {
      return !switchLanguage.value ? 'ru' : 'eng' // "Русский" / "English"
    })

    const modalContent = computed(
      (): ModalContentLanguage =>
        currentContentType.value[currentLanguage.value],
    )

    return {
      dialog,
      modalContent,
      switchLanguage,
      closeModal,
    }
  },
})
</script>

<style lang="scss" scoped>
.modal {
  z-index: 90 !important;
  &__header {
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
