<template>
  <v-dialog v-model="showDialog" transition="dialog-bottom-transition" width="auto">
    <template #activator="{ props }">
      <AppButton class="create-dashboard-btn" v-bind="props" :title="$t('buttons.newBoard')" />
    </template>
    <template #default>
      <v-card>
        <v-toolbar color="primary">
          <h4 class="v-card-header__title">
            {{ $t("modal.createBoard") }}
          </h4>
        </v-toolbar>
        <form class="v-card__form" @submit.prevent="createNewBoard">
          <v-card-text>
            <div class="v-card__wrapper">
              <BoardImageResult
                :background="String(newBoard.background)"
                image-decor="/images/dashboard-template.webp"
                :image="newBoard.background"
              />
              <AppInput
                v-model="newBoard.title"
                :label="$t('labels.boardTitle')"
                required
                name="DashboardHeader"
                :min="Length.TEXT"
                :max-length="Length.MAX"
              />
            </div>
            <div class="v-card__wrapper-background-select">
              <h5 class="v-card__title">
                {{ $t("labels.background") }}
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
            <AppButton
              class="v-card--cancel-create"
              variant="text"
              :title="$t('buttons.cancel')"
              @click="showDialog = false"
            />
            <AppButton
              class="v-card--create-board"
              variant="text"
              type="submit"
              :title="$t('buttons.create')"
            />
          </v-card-actions>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { GenerateJoinCode } from "@/helpers/methods";

import i18n from "@/i18n";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useDashboardItemBackgroundTemplate from "@/composables/useDashboardItemBackground";

import AppButton from "../UI/AppButton.vue";
import AppInput from "../UI/AppInput.vue";
import BoardImageResult from "../board/BoardImageResult.vue";
import ImageBackgroundExample from "../UI/BackgroundItem.vue";

import { Colors, Length, Numbers, UserRole } from "@/types/enums";
import type { IBackgroundDashboard } from "@/types/interfaces/colors";
import type { IWorkingBoardItem } from "@/types/interfaces/board";

export default defineComponent({
  components: {
    AppButton,
    AppInput,
    BoardImageResult,
    ImageBackgroundExample,
  },
  emits: ["createNew"],

  setup(_, { emit }) {
    const { t } = i18n.global;

    const backgrounds: IBackgroundDashboard = useDashboardItemBackgroundTemplate();

    const { unicID } = useCurrentUserInfo();

    const showDialog = ref(false);

    const newBoard = reactive<Partial<IWorkingBoardItem>>({
      title: "",
      background: Colors.GRADIENT_BLUE_PINK,
      columns: [
        {
          id: 0,
          title: t("columnsName[0].title"),
          tasks: [],
        },
        {
          id: 1,
          title: t("columnsName[1].title"),
          tasks: [],
        },
        {
          id: 2,
          title: t("columnsName[2].title"),
          tasks: [],
        },
      ],
      members: [{ role: UserRole.ADMIN, uid: unicID.value }],
      uid: unicID.value,
    });

    const createNewBoard = () => {
      if (newBoard.title!.length < Length.TEXT) {
        return;
      }

      // Set date of creation working board.
      const dateOfCreation: Date = new Date();
      newBoard.dateOfCreation = dateOfCreation.toString();

      // Set unic code for board joining.
      newBoard.joinCode = GenerateJoinCode(Numbers.JOIN_CODE_SIZE);

      emit("createNew", Object.assign({}, newBoard));

      showDialog.value = false;

      // Set default value.
      newBoard.title = "";
      newBoard.background = Colors.GRADIENT_BLUE_PINK;
    };

    return {
      showDialog,
      newBoard,
      backgrounds,
      Length,
      createNewBoard,
    };
  },
});
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
