<template>
  <div class="auth">
    <div class="auth__window">
      <div class="auth__window-logo">
        <img class="auth__window-logo-picture" src="/images/icons/logo.svg" alt="Logo" />
      </div>
      <div class="auth__window-form">
        <form class="auth__window-form-wrapper" @submit.prevent="submitForm">
          <div class="auth__window-form__inputs">
            <AppInput
              v-model="userData.email"
              required
              is-email
              type="email"
              name="userEmail"
              :label="$t('labels.email')"
              transparent
            />
            <AppInput
              v-model="userData.password"
              required
              type="password"
              name="userPassword"
              :label="$t('labels.password')"
              transparent
              :min="Length.PASSWORD"
            />
            <div class="auth__window-form__forgot">
              <i18n-t keypath="signIn.forgotPassword" scope="global" tag="span">
                <template #recover>
                  <router-link
                    :to="{ name: 'Forgot' }"
                    class="auth__window-form__forgot--link"
                  >
                    {{ $t("signIn.recover") }}
                  </router-link>
                </template>
              </i18n-t>
            </div>
          </div>
          <div class="auth__window-form__inputs--send">
            <AppButton :title="$t('buttons.signIn')" type="submit" />
          </div>
        </form>
        <div class="auth__window-form--actions">
          <div class="auth__swap-entry-type">
            <i18n-t
              keypath="signIn.noAccount"
              scope="global"
              tag="span"
              class="auth__description"
            >
              <template #entry>
                <router-link :to="{ name: 'SignUp' }">
                  {{ $t("signIn.regLink") }}
                </router-link>
              </template>
            </i18n-t>
          </div>
        </div>
        <div class="switch-language">
          <SwitchLanguageButton type="button" variant="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";

import * as emailValidator from "email-validator";
import FirebaseAuth from "@/helpers/firebase/firebaseAuth";

import SwitchLanguageButton from "@/components/UI/SwitchLanguageButton.vue";
import AppInput from "@/components/UI/AppInput.vue";
import AppButton from "@/components/UI/AppButton.vue";

import type { IUserLogin } from "@/types/interfaces/user";
import { Length } from "@/types/enums";

export default defineComponent({
  components: {
    AppInput,
    AppButton,
    SwitchLanguageButton,
  },
  setup() {
    const userData: IUserLogin = reactive({
      email: "",
      password: "",
    });

    const { signIn } = FirebaseAuth();

    const valid = computed((): boolean => {
      return (
        emailValidator.validate(userData.email) &&
        userData.password.length >= Length.PASSWORD
      );
    });

    const submitForm = (): void => signIn(userData, valid.value);

    return {
      userData,
      Length,
      submitForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.auth {
  @include auth-window;

  &__swap-entry-type {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 40px;

    .c-button {
      padding: 0;
      color: $color-blue;
      width: fit-content;
      margin: 0 auto;

      &:hover {
        color: $color-blue;
      }
    }

    .auth__description {
      color: $color-white4;
    }
  }

  &__window {
    position: relative;
    min-width: 400px;
    padding: 10px 20px 30px;
    margin: 30px;
    background-color: rgba($color-grey, 0.8);
    box-shadow: 0 30px 10px rgba($color-grey, 0.3);

    &-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 50px;
      height: 40px;
    }

    &--title {
      color: $color-blue;
      font-weight: 500;
      margin-bottom: 45px;
      line-height: 10px;
      text-align: center;
    }

    &-form {
      &__inputs {
        &--send {
          text-align: center;
          margin-top: 80px;

          .c-button {
            color: $color-white1;
            width: 150px;
          }
        }
      }

      &__forgot {
        margin-top: 10px;
        font-size: 14px;
        text-align: end;
        color: $color-white1;
      }
    }
  }

  @include mobile(max) {
    height: 100%;
    min-height: 525px;

    &__window {
      margin: 0;
      min-width: 100%;
      height: 100%;

      &-form {
        display: flex;
        flex-direction: column;
        height: calc(100% - 70px);

        &-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          margin: 0 auto;
          height: 100%;

          .c-input {
            width: 100%;
          }
        }

        &__inputs {
          &--send {
            .c-button {
              width: 100%;
            }
          }
        }
      }

      .auth__swap-entry-type {
        font-size: 14px;
        margin-top: 20px;
        padding-bottom: 10px;
      }
    }
  }
}

.swap-buttons-enter-active,
.swap-buttons-leave-active {
  transition: opacity 0.3s ease;
}
.swap-buttons-enter,
.swap-buttons-leave-to {
  opacity: 0;
}
</style>
