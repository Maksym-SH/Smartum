<template>
  <div class="popup">
    <div class="popup__container" v-if="showTemplate">
      <h2 class="popup__title" v-if="params.title">
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
          size="sm"
          class="popup__button--no">
          {{ btnParam.no?.text }}
        </Button>
        <Button
          @click="result(true)"
          :variant="btnParam.yes.variant"
          size="sm"
          class="popup__buttons--yes">
          {{ btnParam.yes.text }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ObjectFull } from '@/helpers/methods';
import { IPopupParams } from '@/interfaces';
import { PopupButtons } from "@/types";
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const params: IPopupParams = store.getters.getPopupParams;

    const showTemplate: boolean = ObjectFull(params);

    const btnParam = computed((): PopupButtons => {
      return {
        yes: {
          text: params.buttons.yes?.text || "Подтвердить",
          variant: params.buttons.yes?.variant || "info"
        },
        no: {
          text: params.buttons.no?.text || "Отмена",
          variant: params.buttons.no?.variant || "info"
        }
      }
    })

    const ClosePopup = (): void => {
      store.dispatch("setPopupParams", {})
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
  width: 100%;
  height: 100vh;
  background-color: $color-transp-black;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  &__container {
    width: fit-content;
    border-radius: 10px;
    padding: 20px 40px;
    min-width: 400px;
    max-width: 440px;
    background-color: $color-white5;
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
  }
  &__button {
    margin-top: 30px;
    display: flex;
    gap: 15px;
    justify-content: center;
    .c-button {
      min-width: 49%;
    }
  }

  @include mobile(max) {
    &__container {
      min-width: 300px;
      padding: 20px;
      margin: 5px;
    }
    &__button {
      .c-button {
        padding:  10px;
      }
    }
  }
}
</style>