<template>
  <div class="auth">
    <div class="auth__window">
      <div class="auth__window--logo">
        <img src="@/assets/img/logo.svg" alt="Logo" />
      </div>
      <div class="auth__window-form">
        <form @submit.prevent="submitForm">
          <div class="auth__window-form__inputs">
            <Input
              required
              isEmail
              placeholder="Почта"
              v-model="userData.email"
              transparent
              autocomplete
            />
            <Input
              required
              type="password"
              placeholder="Пароль"
              v-model="userData.password"
              transparent
              :min="LengthPassword"
              autocomplete
            />
            <div class="auth__window-form__forgot">
              Забыли пароль?
              <router-link
                :to="{ name: 'Forgot' }"
                class="auth__window-form__forgot--link"
              >
                Восстановить
              </router-link>
            </div>
          </div>
          <div class="auth__window-form__inputs--send">
            <Button title="Войти" />
          </div>
        </form>
        <div class="auth__window-form--actions">
          <div class="auth__swap-entry-type">
            <span class="auth__description" :key="authType">
              Нет аккаунта?
              <router-link :to="{ name: 'SignUp' }"> Регистрация </router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import { IUserLogin } from "@/interfaces";
import FirebaseAuth from "@/helpers/firebase/firebaseAuth";
import { emailValidator } from "@/main";
import { Length } from "@/enums/index";

export default defineComponent({
  setup() {
    const userData: IUserLogin = reactive({
      email: "",
      password: "",
    });

    const authType = ref("signIn");
    const minLength = Length.Password;

    const { signIn } = FirebaseAuth();

    const valid = computed((): boolean => {
      return (
        emailValidator.validate(userData.email) &&
        userData.password.length >= minLength
      );
    });

    const submitForm = (): void => signIn(userData, valid.value);

    return {
      userData,
      authType,
      LengthPassword: Length.Password,
      submitForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.auth {
  @include auth-window;
  &__swap-entry-type {
    text-align: center;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
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
      margin-bottom: 20px;
      color: $color-white5;
    }
  }
  &__window {
    min-width: 400px;
    padding: 10px 20px 30px;
    margin: 30px;
    background-color: rgba($color-grey, 0.8);
    box-shadow: 0 30px 10px rgba($color-grey, 0.3);
    position: relative;
    &--logo {
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
            width: 150px;
          }
        }
      }
      &__forgot {
        font-size: 12px;
        text-align: end;
        color: $color-white1;
      }
    }
  }
  @include mobile(max) {
    &__window {
      margin: 0;
      min-width: 100%;
      height: 100vh;
      min-height: 435px;
      &-form {
        height: calc(100vh - 110px);
        display: flex;
        flex-direction: column;
        min-height: 250px;
        form {
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          .c-input {
            width: 100%;
          }
        }
        &--actions {
          margin-top: 10px;
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
