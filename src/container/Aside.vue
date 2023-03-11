<template>
  <aside class="aside">
      <div class="aside__logo">
          <img src="@/assets/img/logo.svg" alt="Logo">
      </div>
      <div class="aside__user">
        <User />
      </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import User from "@/components/user/Container.vue";
export default defineComponent({
  components: {
    User
  }
})
</script>

<style lang="scss">
.aside {
  min-height: 100vh;
  width: 100%;
  max-width: 260px;
  background-color: $color-grey;
  display: flex;
  flex-direction: column;
  &__logo {
    padding: 9px 25px;
    background-color: $color-dark-grey;
    width: 100%;
    text-align: center;
    img {
      width: 115px;
    }
  }
  &__user {
    padding: 30px 24px;
    &--avatar {
      width: 42px;
      height: 24px;
    }
  }
}

</style>