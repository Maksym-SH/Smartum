<template>
  <div class="auth-form">
    <form @submit.prevent="submitForm">
      <div class="form-inputs">
        <c-input 
          required
          isEmail
          placeholder="Почта"
          v-model="userData.email"
          transparent
          autocomplete
        />
        <c-input 
          required
          type="password"
          placeholder="Пароль"
          v-model="userData.password"
          transparent
          :min="minLength"
          autocomplete
        />
        <div class="form-inputs__toggle-content">
          <transition
            mode="out-in"
            name="toggle-content"
          >
            <c-input 
              v-if="signUpType"
              required
              type="password"
              placeholder="Повторите пароль"
              v-model="userData.repeatPassword"
              transparent
              :min="minLength"
            />
            <div v-else class="auth-form__forgot">
              Забыли пароль?
              <router-link
                :to="{name: 'Forgot' }"
                class="auth-form__forgot--link"
              >
                Восстановить
              </router-link>
            </div>
          </transition>
        </div>
      </div>
       <div class="form-inputs__send">
          <transition
            mode="out-in" 
            name="swap-buttons"
          >
            <c-button v-if="signUpType"  title="Регистрация"/>
            <c-button v-else  title="Войти" />
          </transition>
        </div>
    </form>
      <div class="auth-form__actions">
        <div class="auth__swap-entry-type">
          <transition mode="out-in" name="toggle-content">
            <span 
              class="auth__description" 
              :key="authType"
            >
              {{ signUpType ? 'Есть аккаунт?' : "Нет аккаунта?" }}
            </span> 
          </transition>

          <c-button 
            key="button"
            @click="changeAuthType"
            transparent 
            :title="authButtonText"
          /> 
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import { User } from "@/interfaces/common";
import FirebaseAuth from "@/helpers/firebase/firebaseAuth";
export default defineComponent({
  setup() {
    const userData: User = reactive({
      email: "",
      password: "",
      repeatPassword: ""
    })
    const authType = ref('signIn');
    const minLength = 8;

    const changeAuthType = () => {
      if(signUpType.value) authType.value = "signIn";
      else authType.value = "signUp";
    }

    const signUpType = computed(() => authType.value === "signUp")
    const authButtonText = computed(() => signUpType.value ? "Авторизация": "Регистрация")

    const {signIn, signUp } = FirebaseAuth();

    const submitForm = () => {
      signUpType.value ? signUp(userData) : signIn(userData);
    }

    return {
      userData,
      authType,
      minLength,
      signUpType,
      authButtonText,
      submitForm,
      changeAuthType,
    }
  }
})
</script>