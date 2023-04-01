<template>
  <div class="forgot-page">
    <div class="forgot-page__window">
      <div class="forgot-page__window-header">
        <h2>
          Восстановление пароля
          <v-icon icon="mdi mdi-form-textbox-password"></v-icon>
        </h2>
        <p>
          Введите почту, которую вы использовали при регистрации а затем мы
          отправим вам письмо с инструкциями.
        </p>
      </div>
      <form class="forgot-page__window-content" @submit.prevent="submitForm">
        <Input
          placeholder="Ваша почта"
          required
          v-model="email"
          isEmail
          @invalid="errorEmail = true"
        />
        <Button class="submit-form" title="Отправить" size="sm" />
      </form>
      <a
        class="forgot-page__window--go-back"
        @click="goBack"
      >
        <v-icon icon="mdi mdi-arrow-left"></v-icon>
        Вернуться назад
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import firebaseReset from "@/helpers/firebase/firebaseReset";
import router from "@/router";

export default defineComponent({
  setup() {
    const errorEmail = ref(false);

    const email = ref("");

    const submitForm = (): void => {
      if (errorEmail.value) return;
      else firebaseReset(email.value);
    };
    
    const goBack = () => {
      if (window.history.length >= 2) {
        router.go(-1); // Navigate to previous page.
      }
      else {
        router.push({ name : "Home" })
      }
    }

    watch((): string => email.value, (): boolean => errorEmail.value = false);

    return {
      email,
      errorEmail,
      submitForm,
      goBack,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixins";
.forgot-page {
  @include auth-window;
  &__window {
    position: relative;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 1px $color-grey;
    background-color: $color-grey;
    color: $color-text;
    max-width: 450px;
    &-header {
      margin-bottom: 20px;
      p {
        margin-top: 10px;
      }
    }
    &-content {
      text-align: end;
      .c-button {
        padding: 5px 20px;
      }
      :deep(.c-input) {
        border-color: $color-white1 !important;
        &::placeholder {
          font-size: 14px;
        }
      }
    }
    &--go-back {
      text-align: center;
      color: $color-blue;
      font-size: 12px;
      display: block;
      margin: 20px 0 10px 0;
      text-align: center;
      transform: color 0.3s ease;
      &:hover {
        color: $color-blue-hover;
        text-decoration: none;
      }
    }
    @include mobile(max) {
      height: 100vh;
      min-width: 100%;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 330px;
      &-content {
        .c-button {
          position: absolute;
          bottom: 15px;
          left: 10px;
          padding: 10px;
          font-size: 14px;
          width: calc(100% - 20px);
        }
      }
    }
  }
}
</style>
