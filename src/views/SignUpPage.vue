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
          Добро пожаловать!
        </h3>
        <div class="sign-up__window-content">
          <h4 class="sign-up__window--welcome-description">
            Заполните форму чтобы создать аккаунт.
          </h4>
        </div>
        <div class="sign-up__window--welcome-logo">
          <img
            class="sign-up__window--welcome-logo_image"
            src="/images/icons/logo.svg" alt="Logo" />
        </div>
      </div>
      <div class="sign-up__window--content content">
        <h2 class="sign-up__window--content-title">
          Создание аккаунта
        </h2>
        <form @submit.prevent="submitForm" class="sign-up__window-form-inputs">
          <Input
            v-model.trim="userData.firstName"
            required
            label="Имя"
            name="userFirstName"
            :maxLength="Length.Maximum"
            :min="Length.Text"
            transparent
          />
          <Input
            v-model.trim="userData.lastName"
            :min="userData.lastName ? Length.Text : Length.None"
            name="userLastName"
            :maxLength="Length.Maximum"
            label="Фамилия"
            transparent
          />
          <Input
            v-model.trim="userData.email"
            required
            type="email"
            name="userEmail"
            isEmail
            transparent
            autocomplete
            label="Электронный адрес"
          />
          <Input
            v-model="userData.password"
            required
            type="password"
            name="userPassword"
            transparent
            :min="Length.Password"
            label="Пароль"
            autocomplete="new-password"
          />

          <div class="sign-up__window-form-inputs__send">
            <Button title="Регистрация" type="submit" />
          </div>
          <small class="sign-up__window-description">
            Нажав на кнопку "Регистрация" вы создаете Smartum аккаунт и даёте согласие на
            <span
              class="sign-up__window-description--open-modal" @click="showTermsOfUse">
              Правила использования
            </span> и 
            <span 
              class="sign-up__window-description--open-modal"
              @click="showConfidentiality"
            >
              Политики конфиденциальности
            </span>
          </small>
        </form>
        <div class="content__swap-type-entry">
          <span>
            Уже зарегистрированы?
            <router-link :to="{ name: 'SignIn' }"> 
              Авторизация 
            </router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import * as emailValidator from "email-validator";
import { IUserReg } from "@/interfaces";
import { ModalContentType } from "@/types";
import { Length } from "@/enums";

import useStores from "@/composables/useStores";
import FirebaseAuth from "@/helpers/firebase/firebaseAuth";

export default defineComponent({
  setup() {
    const { commonStore } = useStores();

    const userData: IUserReg = reactive({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    const LengthPassword = Length.Password;
    const LengthText = Length.Text;

    const validPersonDate = computed((): boolean => {
      return (
        userData.firstName.length >= LengthText &&
        (!userData.lastName.length ||
          userData.lastName.length >= LengthText) &&
        userData.password.length >= LengthPassword
      );
    });

    const { signUp } = FirebaseAuth();

    const valid = computed((): boolean => {
      return emailValidator.validate(userData.email) && validPersonDate.value;
    });

    const submitForm = (): void => signUp(userData, valid.value);

    const showTermsOfUse = () => {
      const type: ModalContentType = "termsOfUse";
      commonStore.setModalContentType(type);
    }
    const showConfidentiality = () => {
      const type: ModalContentType = "confidentiality";
      commonStore.setModalContentType(type);
    }

    return {
      userData,
      Length,
      submitForm,
      showTermsOfUse,
      showConfidentiality
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
      height: 611px;
      padding: 65px 30px 20px 30px;
      color: $color-white3;
      &__grid-image {
        outline: none;
        width: 70%;
        position: absolute;
        top: -50px;
        left: -65px;
        opacity: 0.1;
      }
      &__tasks-image {
        outline: none;
        width: 85%;
        opacity: 0.15;
        position: absolute;
        bottom: -88px;
        right: -100px;
      }
      &-title {
        text-align: center;
        font-size: 25px;
      }
      &-description {
        margin-top: 200px;
        font-weight: 500;
        font-size: 20px;
        text-align: center;
      }
      &-logo {
        position: absolute;
        bottom: 5px;
        width: 100%;
        left: 0;
        text-align: center;
        &_image {
          user-select: none;
          width: 50%;
        }
      }
    }
    &--content {
      width: 60%;
      padding: 20px;
      color: $color-white3;
      background-color: rgba($color-grey, 0.8);
      .content__swap-type-entry {
        margin-top: 40px;
        text-align: center;
      }
      &-title {
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
      &--content {
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
      &--content {
        border-radius: 0;
        min-height: 100%;
        .content__swap-type-entry {
          margin: 8px 0 20px 0;
          font-size: 14px;
        }
        .sign-up__window-description {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 11px;
          line-height: 22px;
        }
      }
      &-form-inputs {
        display: flex;
        min-height: calc(100% - 102px);
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
