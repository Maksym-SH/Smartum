<template>
  <div class="confirmation" @click.self="result(false)">
    <div class="confirmation__window">
      <h2 class="confirmation__window-title">
        {{ $t("popup.confirmPassword.title") }}
      </h2>
      <p class="confirmation__window-description">
        {{ $t("popup.confirmPassword.text") }}
      </p>
      <form class="confirmation__window-input-field" @submit.prevent>
        <AppInput
          v-model="password"
          :label="$t('popup.confirmPassword.yourPassword')"
          type="password"
          name="userPassword"
          :min="Length.PASSWORD"
        />
        <div class="confirmation__window-forgot-password">
          <router-link
            class="confirmation__window-forgot-password--go-page"
            :to="{ name: 'Forgot' }"
            @click="result(false)"
          >
            {{ $t("common.forgotPassword") }}
          </router-link>
        </div>
        <div class="confirmation__button">
          <AppButton
            variant="outlined"
            class="confirmation__button--no"
            :title="$t('buttons.cancel')"
            @click="result(false)"
          />
          <AppButton
            type="submit"
            :disabled="btnConfirmDisable"
            class="confirmation__buttons--yes"
            :title="$t('buttons.confirm')"
            @click="result(true)"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { EmailAuthProvider } from "firebase/auth";
import { Confirmation } from "@/helpers/methods";

import firebaseAuth from "@/helpers/firebase/firebaseAuth";
import useStores from "@/composables/useStores";

import AppInput from "./AppInput.vue";
import AppButton from "./AppButton.vue";

import { Length } from "@/types/enums";
import type { EmailAuthCredential, User } from "firebase/auth";

export default defineComponent({
  components: {
    AppButton,
    AppInput,
  },
  setup() {
    const { commonStore, userStore } = useStores();

    const userInfo: User = userStore.currentUser as User;

    const userEmail = userInfo.email;
    const password = ref("");

    const btnConfirmDisable = computed((): boolean => password.value.length < Length.PASSWORD);

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
      Length,
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
      
      .c-button {
        color: $color-white1;
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
