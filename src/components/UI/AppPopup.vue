<template>
  <div class="popup" @click.self="result(false)">
    <div v-if="showTemplate" class="popup__window">
      <h2 v-if="params.title" class="popup__title">
        {{ params.title }}
      </h2>
      <p class="popup__description">
        {{ params.text }}
      </p>
      <div class="popup__button">
        <AppButton
          outline
          :variant="btnParam.no?.variant"
          :color="btnParam.no?.color"
          class="popup__button--no"
          @click="result(false)"
        >
          {{ btnParam.no?.text }}
        </AppButton>
        <AppButton
          :variant="btnParam.yes.variant"
          :color="btnParam.yes?.color"
          class="popup__buttons--yes"
          type="submit"
          @click="result(true)"
        >
          {{ btnParam.yes.text }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { ObjectFull } from "@/helpers/methods";

import i18n from "@/i18n";
import useStores from "@/composables/useStores";

import AppButton from "./AppButton.vue";

import { Colors } from "@/types/enums";
import type { IPopupParams } from "@/types/interfaces/components";
import type { PopupButtons } from "@/types";

export default defineComponent({
  components: {
    AppButton,
  },
  setup() {
    const { t } = i18n.global;

    const { commonStore } = useStores();

    const params: IPopupParams = commonStore.popupParams as IPopupParams;

    const showTemplate: boolean = ObjectFull(params);

    const btnParam = computed((): PopupButtons => {
      return {
        yes: {
          text: params.buttons.yes?.text || t("buttons.confirm"),
          variant: params.buttons.yes?.variant || "elevated",
          color: params.buttons.yes?.color || Colors.INFO,
        },
        no: {
          text: params.buttons.no?.text || t("buttons.cancel"),
          variant: params.buttons.no?.variant || "outlined",
          color: params.buttons.no?.color || Colors.INFO,
        },
      };
    });

    const ClosePopup = (): void => {
      commonStore.setPopupParams({});
    };

    const result = (result: boolean): void => {
      if (!result) {
        ClosePopup(); // Clear data and close popup.
      } else {
        params.callback();
        ClosePopup();
      }
    };

    return {
      params,
      btnParam,
      showTemplate,
      result,
    };
  },
});
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: $color-transp-black;

  &__window {
    display: flex;
    flex-direction: column;
    padding: 20px 40px;
    width: fit-content;
    min-width: 400px;
    max-width: 440px;
    border-radius: 10px;
    background-color: var(--color-background-modal);
    color: var(--color-text);
  }

  &__title {
    text-align: center;
    word-break: break-word;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  &__description {
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    opacity: 0.9;
  }

  &__button {
    margin-top: auto;
    padding-top: 30px;
    display: flex;
    gap: 15px;
    justify-content: center;
    color: $color-white1;

    .c-button {
      text-transform: none;
      width: 49%;
    }
  }

  @include mobile(max) {
    &__window {
      width: 90%;
      min-width: 300px;
      min-height: 150px;
      padding: 20px;
      margin: 5px;
    }

    &__button {
      .c-button {
        padding: 10px;
      }
    }
  }
}
</style>
