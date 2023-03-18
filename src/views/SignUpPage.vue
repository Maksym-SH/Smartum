<template>
  <div class="sign-up">
    <div class="sign-up__window">
      <div class="sign-up__window--welcome">
        <img
          class="grid-image"
          svg-inline
          src="@/assets/img/icons/grid.svg"
          alt="Grid"
        />
        <img
          class="tasks-image"
          svg-inline
          src="@/assets/img/icons/list-task.svg"
          alt="Tasks"
        />

        <h3 class="title">Добро пожаловать!</h3>
        <div class="content">
          <h4 class="description">Заполните форму чтобы создать аккаунт.</h4>
        </div>
        <div class="sign-up__window--welcome-logo">
          <img src="@/assets/img/logo.svg" alt="Logo" />
        </div>
      </div>
      <div class="sign-up__window--content content">
        <h2 class="title">Создание аккаунта</h2>
        <form @submit.prevent="submitForm" class="form-inputs">
          <Input
            v-model.trim="userData.firstName"
            required
            placeholder="Имя"
            :min="LengthText"
            transparent
            autocomplete
          />
          <Input
            v-model.trim="userData.lastName"
            :min="LengthText"
            placeholder="Фамилия"
            transparent
            autocomplete
          />
          <Input
            v-model.trim="userData.email"
            required
            isEmail
            transparent
            placeholder="Почта"
          />
          <Input
            v-model="userData.password"
            required
            type="password"
            transparent
            :min="LengthPassword"
            placeholder="Пароль"
            autocomplete
          />

          <div class="form-inputs__send">
            <Button title="Регистрация" />
          </div>
        </form>
        <div class="content__swap-type-entry">
          <span>
            Нет аккаунта?
            <router-link :to="{ name: 'SignIn' }"> Авторизация </router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import { IUserReg } from "@/interfaces/index";
import { emailValidator } from "@/main";
import FirebaseAuth from "@/helpers/firebase/firebaseAuth";
import { ELength } from "@/enums/index";

export default defineComponent({
  setup() {
    const userData: IUserReg = reactive({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    const LengthPassword = ELength.Password;

    const LengthText = ELength.Text;

    const validPersonDate = computed(() => {
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

    const submitForm = () => signUp(userData, valid.value);

    return {
      userData,
      LengthText,
      LengthPassword,
      submitForm,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixins.scss";
.sign-up {
  @include auth-window;

  &__window {
    margin: 30px;
    display: flex;
    box-shadow: 0 30px 10px rgba($color-grey, 0.3);

    &--welcome {
      height: 100%;
      background-color: $color-dark-blue;
      position: relative;
      overflow: hidden;
      height: 500px;
      padding: 55px 30px 20px 30px;
      color: $color-white4;

      .grid-image {
        outline: none;
        width: 70%;
        position: absolute;
        top: -50px;
        left: -65px;
        opacity: 0.1;
      }

      .tasks-image {
        outline: none;
        width: 85%;
        opacity: 0.15;
        position: absolute;
        bottom: -88px;
        right: -100px;
      }

      .title {
        text-align: center;
        font-size: 25px;
      }

      .description {
        margin-top: 120px;
        font-weight: 500;
        font-size: 20px;
        text-align: center;
      }

      &-logo {
        position: absolute;
        bottom: 0;
        width: 100%;
        left: 0;
        text-align: center;
        img {
          user-select: none;
          width: 50%;
        }
      }
    }

    &--content {
      width: 60%;
      padding: 20px;
      color: $color-white4;
      background-color: rgba($color-grey, 0.8);

      .content__swap-type-entry {
        margin-top: 60px;
        text-align: center;
      }

      .title {
        margin-bottom: 30px;
      }

      .form-inputs {
        &__send {
          margin-top: 20px;

          :deep(.c-button) {
            width: 100%;
          }
        }
      }
    }
  }
  @media (max-width: $md) {
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
  @media (max-width: $sm) {
    &__window {
      margin: 0;
      width: 100%;
      height: 100vh;
      min-height: 475px;

      &--content {
        border-radius: 0;

        .form-inputs {
          display: flex;
          min-height: calc(100vh - 150px);
          flex-direction: column;

          &__send {
            margin-top: auto;
            padding-top: 40px;
          }
        }

        .content__swap-type-entry {
          margin: 40px 0 20px 0;
        }
      }
    }
  }
}
</style>
