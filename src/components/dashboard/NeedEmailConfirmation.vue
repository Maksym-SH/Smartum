<template>
  <div class="blocked-access">
    <div class="blocked-access__content">
      <img class="blocked-access__image" src="/images/icons/lock-red.svg" alt="" />
      <h2 class="blocked-access__title">Доступ запрещён!</h2>
      <p class="blocked-access__description">
        Чтобы воспользоваться данной услугой приложения, вам необходимо подтвердить
        электронный адрес учётной записи, сделать это можно в меню настроек (возле данных
        пользователя), либо нажать
        <span class="blocked-access--email-confirm" @click="verifyEmail"> Здесь </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import VerifyEmail from "@/helpers/firebase/firebaseVerifyEmail";

export default defineComponent({
  setup() {
    const verifyEmail = () => {
      const { currentUser } = useCurrentUserInfo();
      VerifyEmail(currentUser.value);
    };
    return {
      verifyEmail,
    };
  },
});
</script>

<style lang="scss" scoped>
.blocked-access {
  width: 100%;
  max-width: 470px;
  border-radius: 4px;
  padding: 20px;
  &__content {
    text-align: center;
    color: var(--color-text);
  }
  &__image {
    max-width: 40px;
    height: 40px;
  }
  &__description {
    font-size: 14px;
    line-height: 23px;
  }
  &--email-confirm {
    color: $color-blue;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
