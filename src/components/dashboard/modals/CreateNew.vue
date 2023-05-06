<template>
  <v-dialog
    transition="dialog-bottom-transition"
    width="auto"
    v-model="showDialog"
  >
    <template v-slot:activator="{ props }">
      <Button class="create-dashboard-btn" v-bind="props">
        Создать новую доску
      </Button>
    </template>
    <template #default>
      <v-card>
        <v-toolbar color="primary">
          <h4 class="v-card-header__title">Создание новой доски</h4>
        </v-toolbar>
        <form @submit.prevent="createNewBoard">
          <v-card-text>
            <div class="v-card__wrapper">
              <BoardImageResult 
                :background="String(newBoard.background)" 
                image-decor="/images/icons/dashboard-template.webp" 
                :image="newBoard.background" 
              />
              <Input
                v-model="newBoard.title" 
                label="Заголовок доски" 
                required
                name="DashboardHeader"
                :min="Length.Text"
              />
            </div>
            <div class="v-card__wrapper-background-select">
              <h5 class="v-card__title">Фон</h5>
              <div class="v-card__backgrounds">
                <ImageBackgroundExample 
                  v-for="photo in backgrounds.photos"
                  :image="photo"
                  :key="photo" 
                  :width="70"
                  :class="{'active': photo === newBoard.background }" 
                  @select="newBoard.background = $event"
                />
              </div>
              <div class="v-card__backgrounds">
                <ImageBackgroundExample 
                  v-for="gradient in backgrounds.gradients" 
                  :key="gradient"
                  :background="gradient" 
                  @select="newBoard.background = $event"
                  :width="57.5"
                  :class="{'active': gradient === newBoard.background }" 
                />
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="v-card__footer-action">
            <Button
              class="v-card--cancel-create"
              variant="text"
              @click="showDialog = false"
            >
              Отмена
            </Button>
            <Button
              class="v-card--create-board"
              variant="text"
              type="submit"
            >
              Создать
            </Button>
          </v-card-actions>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>


<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import BoardImageResult from '@/components/dashboard/BoardImageResult.vue';
import { IBackgroundDashboard, IWorkingBoardItem } from '@/interfaces';
import { Colors, Length, Numbers } from '@/enums';
import { GenerateRandomString } from "@/helpers/methods";

import useDashboardItemBackgroundTemplate from '@/composables/useDashboardItemBackground';
import ImageBackgroundExample from '@/components/dashboard/ImageBackgroundExample.vue';


export default defineComponent({
  emit:["createNew"],
  components: {
    BoardImageResult,
    ImageBackgroundExample
  },

  setup(_, { emit }) {
    const backgrounds: IBackgroundDashboard = useDashboardItemBackgroundTemplate();

    const showDialog = ref(false);

    const newBoard = reactive<Partial<IWorkingBoardItem>>({
      title: "",
      background: Colors.GradientBluePink as string,
      tasks: [],
      members: 1,
    })

    const createNewBoard = () => {
      if (newBoard.title!.length <= Length.Text) return;

      // Set date of creation working board.
      const dateOfCreation: Date =  new Date();
      newBoard.dateOfCreation = dateOfCreation;
     
      newBoard.joinCode = GenerateRandomString(Numbers.JoinCodeSize);  // Set join code for working board.

      emit("createNew", Object.assign({}, newBoard));

      showDialog.value = false;
    }

    return {
      showDialog,
      newBoard,
      backgrounds,
      Length,
      createNewBoard
    }
  }
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
    .v-card {
      &__wrapper {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>