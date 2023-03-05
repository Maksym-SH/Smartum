<template>
  <div class="forgot-page">
    <div class="forgot-page__window">
      <div class="forgot-page__window-header">
        <h2>
          Восстановление пароля
          <v-icon icon="mdi mdi-form-textbox-password"></v-icon>
        </h2>
        <p>
          Введите почту, которую вы использовали при регистрации а затем мы отправим вам письмо с инструкциями.
        </p>
      </div>
      <form 
        class="forgot-page__window-content"
        @submit.prevent="submitForm"
      >
        <c-input 
          placeholder="Ваша почта"
          required
          v-model="email"
          isEmail
          @invalid="errorEmail = true"
        />
        <c-button 
          class="submit-form"
          title="Отправить"
          size="sm"
        />
      </form>
      <router-link class="forgot-page__window--go-back" :to="{ name: 'Login' }">
          Вернуться на страницу авторизации 
          <v-icon icon="mdi mdi-login"></v-icon>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import firebaseReset from "@/helpers/firebase/firebaseReset";
export default defineComponent({
  setup() {
    const errorEmail = ref(false); 
    const email = ref("");

    const submitForm = () => {
      if(errorEmail.value) return;
      else firebaseReset(email.value);
    }
    watch(() => email.value, () => errorEmail.value = false)
    return {
      email,
      errorEmail,
      submitForm
    }
  }
})
</script>

<style lang="scss" src="./index.scss"></style>