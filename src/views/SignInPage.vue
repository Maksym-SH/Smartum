<template>
  <div class="auth">
    <div class="auth__window">
      <div class="auth__window--image">
        <img src="@/assets/img/logo.svg" alt="Logo" />
      </div>
      <div class="auth-form">
        <form @submit.prevent="submitForm">
          <div class="form-inputs">
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
              :min="minLength"
              autocomplete
            />
            <div class="auth-form__forgot">
              Забыли пароль?
              <router-link
                :to="{ name: 'Forgot' }"
                class="auth-form__forgot--link"
              >
                Восстановить
              </router-link>
            </div>
          </div>
          <div class="form-inputs__send">
            <Button title="Войти" />
          </div>
        </form>
        <div class="auth-form__actions">
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

export default defineComponent({
  setup() {
    const userData: IUserLogin = reactive({
      email: "",
      password: "",
    });
    const authType = ref("signIn");
    const minLength = 8;

    const { signIn } = FirebaseAuth();

    const valid = computed(() => {
      return (
        emailValidator.validate(userData.email) &&
        userData.password.length >= minLength
      );
    });

    const submitForm = () => signIn(userData, valid.value);

    return {
      userData,
      authType,
      minLength,
      submitForm,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixins";
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
      color: $color-info;
      width: fit-content;
      margin: 0 auto;
      &:hover {
        color: $color-info;
      }
    }
    .auth__description {
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
    &-type {
      position: absolute;
      top: 2px;
      left: 2px;
      font-size: 11px;
      color: $color-white1;
    }
    &--image {
      display: flex;
      justify-content: center;
      margin-bottom: 50px;
      height: 40px;
    }
    &--title {
      color: $color-info;
      font-weight: 500;
      margin-bottom: 45px;
      line-height: 10px;
      text-align: center;
    }
  }
  &-form {
    .form-inputs {
      &__toggle-content {
        height: 60.6px;
      }
      &__send {
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

  @media screen and (max-width: $sm) {
    &__window {
      margin: 0;
      min-width: 100%;
      height: 100vh;
      min-height: 428px;
      .auth-form {
        height: calc(100vh - 100px);
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
        &__actions {
          margin-top: auto;
        }
        .form-inputs__send {
          .c-button {
            width: 100%;
          }
        }
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
