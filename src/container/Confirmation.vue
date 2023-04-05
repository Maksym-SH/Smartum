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
      <div class="confirmation__window_forgot-password">
        <router-link 
          class="confirmation__window_forgot-password--go-page"
          :to="{name: 'Forgot'}" 
          @click="result(false)"
        >
          Забыли пароль?
        </router-link>
      </div>
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
import { EmailAuthCredential, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
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
        const credential: EmailAuthCredential =
                  EmailAuthProvider.credential(currentUserEmail, password.value);
        
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
      margin: 20px 0;
      width: 100%;
      max-width: 370px;
      .input-wrapper {
        padding-bottom: 0;
        font-size: 14px;
      }
    }
    &_forgot-password {
      text-align: end;
      padding: 5px 0 20px 0;
    }
    .confirmation__button {
      margin-top: 10px;
      display: flex;
      gap: 15px;
      justify-content: center;

      .c-button {
        min-width: 49%;
      }
    }
  }

  @include respond($us, max) {
    &__window {
      width: 310px;
      padding: 15px 18px;
      &-title {
        font-size: 18px;
      }
      &-description {
        font-size: 15px;
      }
      &-input-field {
        width: 100%;
        margin: 20px auto 0 auto;
      }
      &_forgot-password { 
        padding-top: 10px;
        &--go-page {
          font-size: 13px;
        }
      }
      .confirmation__button {
        margin-top: 0;
        .c-button {
          min-width: 48%;
          padding:  10px;
        }
      }
    }
  }
}
</style>