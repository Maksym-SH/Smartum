<template>
  <div class="confirmation">
    <div class="confirmation__window">
      <h2 class="confirmation__window-title">
        Подтверждение действия
      </h2>
      <p class="confirmation__window-description">
        Нам нужно убедиться что это действительно вы, 
        введите пароль указанный вами при регистрации в поле ниже.
      </p>
      <form class="confirmation__window-input-field">
        <Input 
          label="Ваш пароль"
          type="password"
          :min="PasswordLength"
          v-model="password"
        />
      </form>
      <div class="confirmation__button">
        <Button 
          @click="result(false)"
          outline
          variant="info"
          size="sm"
          class="confirmation__button--no">
          Отмена
        </Button>
        <Button
          @click="result(true)"
          variant="info"
          size="sm"
          :disabled="btnConfirmDisable"
          class="confirmation__buttons--yes">
            Подтвердить
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { notify } from '@kyvg/vue3-notification';
import { ELength } from '@/enums';
import { computed } from '@vue/reactivity';
import { Confirmation } from '@/helpers/methods';

export default defineComponent({
  setup() {
    const store = useStore();
    
    const userInfo = store.getters.getCurrentUser;

    const currentUserEmail = userInfo.email;
    const password = ref("");

    const btnConfirmDisable = computed((): boolean => password.value.length < ELength.Password);

    const result = (value: boolean): void => {
      if (value) {
        const credential = EmailAuthProvider.credential(currentUserEmail, password.value);
        
        store.dispatch("setLoadingStatus", true);

        reauthenticateWithCredential(userInfo, credential)
        .then(() => Confirmation(false))
        .catch((error) => ShowErrorMessage(error))  
        .finally(() => store.dispatch("setLoadingStatus", false));
      }
      else store.dispatch("setConfirmPopup", false);
    }
    
    return {
      password,
      PasswordLength: ELength.Password,
      btnConfirmDisable,
      result
    }
  }
})
</script>

<style lang="scss" scoped>
.confirmation {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: $color-transp-black;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  &__window {
    width: fit-content;
    border-radius: 10px;
    padding: 20px 40px;
    width: 100%;
    max-width: 400px;
    background-color: $color-white5;

    &-title {
      text-align: center;
      word-break: break-word;
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 10px;

      &::first-letter {
        text-transform: uppercase;
      }
    }

    &-description {
      font-size: 14px;
      text-align: center;
      line-height: 20px;
    }

    &-input-field {
      margin-top: 20px;
      width: 100%;
      max-width: 370px;
      .input-wrapper {
        font-size: 14px;
      }
    }

    .confirmation__button {
      margin-top: 30px;
      display: flex;
      gap: 15px;
      justify-content: center;

      .c-button {
        min-width: 49%;
      }
    }
  }

  @media (max-width: $sm) {
    align-items: flex-end;
    
    &__window {
      width: 100%;
      min-width: 100%;
      border-radius: 10px 10px 0 0;
      &-input-field {
        width: 100%;
        margin: 20px auto;
      }
      .confirmation__button {
        margin-top: 0;
        .c-button {
          padding:  10px;
        }
      }
    }
  }
}
</style>