<template>
  <div class="sign-up">
    <div class="sign-up__window">
      <div class="sign-up__window--welcome">
        <img
          class="sign-up__window--welcome__grid-image"
          src="/images/icons/grid.svg"
          alt="Grid"
        />
        <img
          class="sign-up__window--welcome__tasks-image"
          src="/images/icons/list-task.svg"
          alt="Tasks"
        />
        <h3 class="sign-up__window--welcome-title">
          {{ $t("common.welcome") }}
        </h3>
        <h4 class="sign-up__window--welcome-description">
          {{ $t("signUp.description") }}
        </h4>
        <div class="sign-up__window--welcome-logo">
          <img
            class="sign-up__window--welcome-logo-image"
            src="/images/icons/logo.svg"
            alt="Logo"
          />
        </div>
      </div>
      <div class="sign-up__window-content content">
        <h2 class="sign-up__window-content-title">
          {{ $t("signUp.title") }}
        </h2>
        <form class="sign-up__window-form-inputs" @submit.prevent="submitForm">
          <AppInput
            v-model.trim="userData.firstName"
            required
            :label="$t('labels.name')"
            name="userFirstName"
            :max-length="Length.MAX"
            :min="Length.TEXT"
            transparent
          />
          <AppInput
            v-model.trim="userData.lastName"
            :min="userData.lastName ? Length.TEXT : Length.NONE"
            name="userLastName"
            :max-length="Length.MAX"
            :label="$t('labels.lastName')"
            transparent
          />
          <AppInput
            v-model.trim="userData.email"
            required
            type="email"
            name="userEmail"
            is-email
            transparent
            :label="$t('labels.email')"
          />
          <AppInput
            v-model="userData.password"
            required
            type="password"
            name="userPassword"
            transparent
            :min="Length.PASSWORD"
            :label="$t('labels.password')"
            autocomplete="new-password"
          />
          <div class="sign-up__window-form-inputs__send">
            <AppButton :title="$t('buttons.signUp')" type="submit" />
          </div>
          <small class="sign-up__window-description">
            <i18n-t keypath="signUp.agreement" scope="global">
              <template #terms>
                <span
                  class="sign-up__window-description--open-modal"
                  @click="showTermsOfUse"
                >
                  {{ $t("signUp.termsOfUse") }}
                </span>
              </template>
              <template #confidentiality>
                <span
                  class="sign-up__window-description--open-modal"
                  @click="showConfidentiality"
                >
                  {{ $t("signUp.confidentiality") }}
                </span>
              </template>
            </i18n-t>
          </small>
        </form>
        <div class="content__swap-type-entry">
          <i18n-t keypath="signUp.hasAccount" scope="global">
            <template #entry>
              <router-link :to="{ name: 'SignIn' }">
                {{ $t("signUp.authLink") }}
              </router-link>
            </template>
          </i18n-t>
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
import useStores from "@/composables/useStores";
import FirebaseAuth from "@/helpers/firebase/firebaseAuth";

import AppInput from "@/components/UI/AppInput.vue";
import AppButton from "@/components/UI/AppButton.vue";
import SwitchLanguageButton from "@/components/UI/SwitchLanguageButton.vue";

import type { IUserReg } from "@/types/interfaces/user";
import { Length, ModalContentType } from "@/types/enums";

export default defineComponent({
  components: {
    AppInput,
    AppButton,
    SwitchLanguageButton,
  },
  setup() {
    const { commonStore } = useStores();

    const userData: IUserReg = reactive({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    const validPersonDate = computed((): boolean => {
      return (
        userData.firstName.length >= Length.TEXT &&
        (!userData.lastName.length || userData.lastName.length >= Length.TEXT) &&
        userData.password.length >= Length.PASSWORD
      );
    });

    const { signUp } = FirebaseAuth();

    const valid = computed((): boolean => {
      return emailValidator.validate(userData.email) && validPersonDate.value;
    });

    const submitForm = (): void => signUp(userData, valid.value);

    const showTermsOfUse = () => {
      commonStore.setModalContentType(ModalContentType.TERMS_OF_USE);
    };
    const showConfidentiality = () => {
      commonStore.setModalContentType(ModalContentType.CONFIDENTIALITY);
    };

    return {
      userData,
      Length,
      submitForm,
      showTermsOfUse,
      showConfidentiality,
    };
  },
});
</script>

<style lang="scss" scoped>
.sign-up {
  @include auth-window;

  &__window {
    margin: 30px;
    display: flex;
    box-shadow: 0 30px 10px rgba($color-grey, 0.3);

    &--welcome {
      position: relative;
      background-color: $color-dark-blue;
      overflow: hidden;
      width: 360px;
      padding: 65px 30px 20px 30px;
      color: $color-white3;

      &__grid-image {
        outline: none;
        width: 70%;
        position: absolute;
        top: -42px;
        left: -65px;
        opacity: 0.1;
        user-select: none;
      }

      &__tasks-image {
        outline: none;
        width: 85%;
        opacity: 0.15;
        position: absolute;
        bottom: -86px;
        right: -100px;
        user-select: none;
      }

      &-title {
        text-align: center;
        font-size: 25px;
        font-family: $RobotoRG;
      }

      &-description {
        margin-top: 200px;
        font-weight: 500;
        font-size: 20px;
        text-align: center;
        font-family: $RobotoRG;
      }

      &-logo {
        position: absolute;
        bottom: 0;
        width: 100%;
        left: 0;
        text-align: center;

        &-image {
          user-select: none;
          width: 50%;
        }
      }
    }

    &-content {
      width: 60%;
      width: 400px;
      padding: 20px;
      color: $color-white3;
      background-color: rgba($color-grey, 0.8);

      .content__swap-type-entry {
        margin-top: 40px;
        text-align: center;
      }

      &-title {
        font-weight: bold;
        margin-bottom: 30px;
      }

      .modal-terms-of-use {
        color: $color-blue;
        cursor: pointer;
      }

      .sign-up__window-description {
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
        margin-top: 20px;
        text-align: center;
        font-size: 12px;

        &--open-modal {
          cursor: pointer;
          color: $color-blue;

          &:hover {
            color: $color-dark-blue;
          }
        }
      }
    }

    &-form-inputs {
      height: calc(400px + 50px);
      display: flex;
      flex-direction: column;

      &__send {
        margin-top: auto;

        :deep(.c-button) {
          width: 100%;
        }
      }
    }
  }

  @include responsive($md, max) {
    &__window {
      width: 400px;

      &--welcome {
        display: none;
      }

      &-content {
        width: 100%;
      }
    }
  }

  @include mobile(max) {
    height: 100%;
    min-height: 660px;

    &__window {
      margin: 0;
      width: 100%;
      height: 100%;

      &-content {
        border-radius: 0;
        min-height: 100%;

        .content__swap-type-entry {
          margin: 8px 0 20px 0;
          font-size: 14px;
        }

        .sign-up__window-description {
          margin-top: 0;
          margin-bottom: 15px;
          min-width: 280px;
          font-size: 12px;
          line-height: 17px;
        }
      }

      &-form-inputs {
        display: flex;
        min-height: calc(100% - 140px);
        flex-direction: column;

        &__send {
          margin-top: auto;
          padding-top: 40px;
          margin-bottom: 25px;
        }
      }
    }
  }
}
</style>
