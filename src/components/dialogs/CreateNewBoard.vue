<template>
  <v-dialog
    v-model="showDialog"
    transition="dialog-bottom-transition"
    width="auto"
  >
    <template #activator="{ props }">
      <cButton class="create-dashboard-btn" v-bind="props">
        Создать новую доску
      </cButton>
    </template>
    <template #default>
      <v-card>
        <v-toolbar color="primary">
          <h4 class="v-card-header__title">
            Создание новой доски
          </h4>
        </v-toolbar>
        <form class="v-card__form" @submit.prevent="createNewBoard">
          <v-card-text>
            <div class="v-card__wrapper">
              <BoardImageResult
                :background="String(newBoard.background)"
                image-decor="/images/icons/dashboard-template.webp"
                :image="newBoard.background"
              />
              <cInput
                v-model="newBoard.title"
                label="Заголовок доски"
                required
                name="DashboardHeader"
                :min="Length.Text"
              />
            </div>
            <div class="v-card__wrapper-background-select">
              <h5 class="v-card__title">
                Фон
              </h5>
              <div class="v-card__backgrounds">
                <ImageBackgroundExample
                  v-for="photo in backgrounds.photos"
                  :key="photo"
                  :image="photo"
                  :width="70"
                  :class="{ active: photo === newBoard.background }"
                  @select="newBoard.background = $event"
                />
              </div>
              <div class="v-card__backgrounds">
                <ImageBackgroundExample
                  v-for="gradient in backgrounds.gradients"
                  :key="gradient"
                  :background="gradient"
                  :width="57.5"
                  :class="{ active: gradient === newBoard.background }"
                  @select="newBoard.background = $event"
                />
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="v-card__footer-action">
            <cButton
              class="v-card--cancel-create"
              variant="text"
              @click="showDialog = false"
            >
              Отмена
            </cButton>
            <cButton class="v-card--create-board" variant="text" type="submit">
              Создать
            </cButton>
          </v-card-actions>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import BoardImageResult from '../dashboard/BoardImageResult.vue'
import ImageBackgroundExample from '../UI/BackgroundItem.vue'
import type { IBackgroundDashboard, IWorkingBoardItem } from '@/types/interfaces'
import { Colors, Length, Numbers } from '@/types/enums'
import { GenerateRandomString } from '@/helpers/methods'

import useDashboardItemBackgroundTemplate from '@/composables/useDashboardItemBackground'

export default defineComponent({
  components: {
    BoardImageResult,
    ImageBackgroundExample,
  },
  emits: ['createNew'],

  setup(_, { emit }) {
    const backgrounds: IBackgroundDashboard
      = useDashboardItemBackgroundTemplate()

    const showDialog = ref(false)

    const newBoard = reactive<Partial<IWorkingBoardItem>>({
      title: '',
      background: Colors.GradientBluePink as string,
      tasks: [],
      members: 1,
    })

    const createNewBoard = () => {
      if (newBoard.title!.length < Length.Text)
        return

      // Set date of creation working board.
      const dateOfCreation: Date = new Date()
      newBoard.dateOfCreation = dateOfCreation

      newBoard.joinCode = GenerateRandomString(Numbers.JoinCodeSize) // Set join code for working board.

      emit('createNew', Object.assign({}, newBoard))

      showDialog.value = false
    }

    return {
      showDialog,
      newBoard,
      backgrounds,
      Length,
      createNewBoard,
    }
  },
})
</script>

<style lang="scss" scoped>
.create-dashboard-btn {
  color: $color-white1;
}
.v-dialog {
  z-index: 90 !important;

  :deep(.v-overlay__scrim) {
    opacity: 1;
    background: $color-transp-black;
  }

  .v-card {
    background-color: var(--color-background);
    &-header__title {
      font-size: 15px;
      padding-left: 20px;
    }
    &__wrapper {
      display: flex;
      align-items: center;
      gap: 40px;
      &-background-select {
        margin-top: 20px;
      }
    }
    &__title {
      text-align: center;
      color: var(--color-text);
    }
    &__footer-action {
      display: flex;
      justify-content: flex-end;
    }
    &__backgrounds {
      margin-top: 5px;
      display: flex;
      justify-content: center;
      gap: 5px;
    }
    &--create-board {
      color: $color-blue;
    }
    &--cancel-create {
      color: var(--color-text) !important;
    }
  }

  @include mobile(max) {
    :deep(.v-overlay__content) {
      max-width: 100%;
      max-height: 100%;
      width: 100% !important;
      height: 100%;
      margin: 0;
    }
    .v-card {
      height: 100%;
      &__wrapper {
        display: flex;
        margin: 0 auto;
        max-width: 370px;
        flex-direction: column;
      }
      &__form {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
      &__footer-action {
        margin-top: auto;
      }
    }
  }
}
</style>
