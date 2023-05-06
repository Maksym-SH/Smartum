<template>
  <div class="popup" @click.self="result(false)">
    <div 
      class="popup__window" 
      v-if="showTemplate"
    >
      <h2 
        v-if="params.title"
        class="popup__title"
      >
        {{ params.title }}
      </h2>
      <p class="popup__description">
        {{ params.text }}
      </p> 
      <div class="popup__button">
        <Button 
          @click="result(false)"
          outline
          :variant="btnParam.no?.variant"
          :color="btnParam.no?.color"
          class="popup__button--no"
        >
          {{ btnParam.no?.text }}
        </Button>
        <Button
          @click="result(true)"
          :variant="btnParam.yes.variant"
          :color="btnParam.yes?.color"
          class="popup__buttons--yes"
          type="submit"
        >
          {{ btnParam.yes.text }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Colors } from '@/enums';
import { ObjectFull } from '@/helpers/methods';
import { IPopupParams } from '@/interfaces';
import { PopupButtons } from "@/types";
import { defineComponent, computed } from 'vue';
import useStores from '@/composables/useStores';

export default defineComponent({
  setup() {
    const { commonStore } = useStores();

    const params: IPopupParams = commonStore.popupParams as IPopupParams;

    const showTemplate: boolean = ObjectFull(params);

    const btnParam = computed((): PopupButtons => {
      return {
        yes: {
          text: params.buttons.yes?.text || "Подтвердить",
          variant: params.buttons.yes?.variant || "elevated",
          color: params.buttons.yes?.color || Colors.Info
        },
        no: {
          text: params.buttons.no?.text || "Отмена",
          variant: params.buttons.no?.variant || "outlined",
          color: params.buttons.no?.color || Colors.Info
        }
      }
    })

    const ClosePopup = (): void => {
      commonStore.setPopupParams({})
    };

    const result = (result: boolean): void => {
      if(!result) {
        ClosePopup(); // Clear data and close popup.
      }
      else {
        params.callback();
        ClosePopup();
      }
    }

    return {
      params,
      btnParam,
      showTemplate,
      result
    }
  }
})
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