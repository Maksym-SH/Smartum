<template>
  <div class="forgot-page">
    <div class="forgot-page__window">
      <div class="forgot-page__window-header">
        <h2 class="forgot-page__window-header__title">
          Восстановление пароля
        </h2>
        <p class="forgot-page__window-header__description">
          Введите электронный адрес, который вы использовали при регистрации а затем мы
          отправим вам письмо с инструкциями.
        </p>
      </div>
      <form class="forgot-page__window-content" @submit.prevent="submitForm">
        <Input
          label="Введите адрес электронной почты"
          v-model="email"
          isEmail
          required
          light-theme
          @invalid="errorEmail = true"
        />
        <Button class="submit-form" title="Отправить" size="lg" />
      </form>
      <div class="forgot-page__window-link">
        <a
          class="forgot-page__window-link--go-back"
          @click="goBack"
        >
          <v-icon icon="mdi mdi-arrow-left"></v-icon>
          Вернуться назад
        </a>
      </div>
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
    margin: 20px;
    background-color: rgba($color-dark-grey, 0.8);
    box-shadow: 0 30px 10px rgba($color-grey, 0.3);
    padding: 30px;
    max-width: 400px;
    color: $color-white1;
    border-radius: 20px;
    &-header {
      margin-bottom: 40px;
      &__title {
        font-size: 25px;
      }
      &__description {
        line-height: 15px;
      }
    }
    &-content {
      .c-input {
        :deep(.c-input__field) {
          border: 1px solid $color-white1;
        }
      }
      .c-button {
        margin-top: 20px;
        width: 100%;
        padding: 7px 0;
      }
    }
    &-link {
      margin-top: 20px;
      text-align: center;
      
      &--go-back {
        color: $color-blue;
        text-decoration: none;
        cursor: pointer;
        display: inline-block;
        padding-bottom: 2px;
        border-bottom: 1px solid transparent;
        &:hover {
          border-color: inherit;
        }
      }
    }
  }
  @include mobile(max) {
    height: 100%; 
    min-height: 300px;
    &__window {
      height: 100%;
      min-width: 100%;
      border-radius: 0;
      display: flex;
      padding: 15px;
      margin: 0;
      flex-direction: column;
      min-height: 300px;
      &-header {
        margin-bottom: 40px;
        &__title {
          font-size: 18px;
        }
        &__description {
          line-height: 15px;
        }
      }
      &_link {
        margin-top: 0;
        &--go-back {
          font-size: 14px;
        }
      }
      &-content {
        min-height: 70px;
        .c-button {
          position: absolute;
          bottom: 30px;
          left: 15px;
          width: calc(100% - 30px);
          padding: 10px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
