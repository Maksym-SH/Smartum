<template>
  <div class="confirmation" @click.self="result(false)">
    <div class="confirmation__window">
      <h2 class="confirmation__window-title">Подтверждение действия</h2>
      <p class="confirmation__window-description">
        Нам нужно убедиться что это действительно вы, введите пароль указанный
        вами при регистрации в поле ниже.
      </p>
      <form class="confirmation__window-input-field" @submit.prevent>
        <cInput
          v-model="password"
          label="Ваш пароль"
          type="password"
          name="userPassword"
          :min="PasswordLength"
        />
        <div class="confirmation__window-forgot-password">
          <router-link
            class="confirmation__window-forgot-password--go-page"
            :to="{ name: 'Forgot' }"
            @click="result(false)"
          >
            Забыли пароль?
          </router-link>
        </div>
        <div class="confirmation__button">
          <cButton
            variant="outlined"
            class="confirmation__button--no"
            @click="result(false)"
          >
            Отмена
          </cButton>
          <cButton
            type="submit"
            :disabled="btnConfirmDisable"
            class="confirmation__buttons--yes"
            @click="result(true)"
          >
            Подтвердить
          </cButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { EmailAuthCredential, User } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";
import { computed } from "@vue/reactivity";
import { Length } from "@/types/enums";
import { Confirmation } from "@/helpers/methods";

import firebaseAuth from "@/helpers/firebase/firebaseAuth";
import useStores from "@/composables/useStores";

export default defineComponent({
  setup() {
    const { commonStore, userStore } = useStores();

    const userInfo: User = userStore.currentUser as User;

    const userEmail = userInfo.email;
    const password = ref("");

    const btnConfirmDisable = computed(
      (): boolean => password.value.length < Length.Password
    );

    const result = (value: boolean): void => {
      if (value && userEmail) {
        const credential: EmailAuthCredential = EmailAuthProvider.credential(
          userEmail,
          password.value
        );

        firebaseAuth()
          .reauthorization(userInfo, credential)
          .then(() => {
            Confirmation(false);
          });
      } else {
        commonStore.setConfirmPopupVisibillity(false);
      }
    };

    return {
      password,
      PasswordLength: Length.Password,
      btnConfirmDisable,
      result,
    };
  },
});
</script>

<style lang="scss" scoped>
.confirmation {
  position: fixed;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: $color-transp-black;

  &__window {
    width: fit-content;
    border-radius: 10px;
    padding: 20px 40px;
    width: 100%;
    max-width: 400px;
    background-color: var(--color-background-modal);

    &-title {
      text-align: center;
      word-break: break-word;
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 10px;
      color: var(--color-text);

      &::first-letter {
        text-transform: uppercase;
      }
    }

    &-description {
      font-size: 14px;
      text-align: center;
      line-height: 20px;
      color: var(--color-text);
      opacity: 0.9;
    }

    &-input-field {
      margin: 20px 0;
      width: 100%;
      max-width: 370px;
      .c-input {
        padding-bottom: 0;
        font-size: 14px;
      }
    }
    &-forgot-password {
      text-align: end;
      padding: 5px 0 20px 0;
    }
    .confirmation__button {
      margin-top: 10px;
      display: flex;
      gap: 15px;
      justify-content: center;
      color: $color-white1;
      .c-button {
        text-transform: none;
        min-width: 49% !important;
      }
    }
  }

  @include responsive($us, max) {
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
      &-forgot-password {
        padding-top: 10px;
        &--go-page {
          font-size: 13px;
        }
      }
      .confirmation__button {
        margin-top: 0;
        .c-button {
          min-width: 48%;
          padding: 10px;
        }
      }
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
