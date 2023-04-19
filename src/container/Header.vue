<template>
  <header class="c-header">
    <div class="c-header__wrapper">
      <div class="c-header__search-content not-mobile">
        <Input 
          type="search" 
           placeholder="Поиск" 
          v-model="searchInput"
        />
      </div>
      <SwitchTheme class="not-mobile"/>
      <Date />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Date from "@/components/date/DateTime.vue";
import SwitchTheme from "@/components/ui/SwitchTheme.vue";
import { Theme } from "@/types";

export default defineComponent({
  components: {
    Date,
    SwitchTheme
  },
  setup() {
    const searchInput = ref("");
    const toggleTheme = (theme: Theme): void => {
      document.body.setAttribute('data-theme', theme);

      localStorage.setItem('theme', theme);
    }

    return {
      searchInput,
      toggleTheme,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-header {
  padding: 10px 40px 10px 50px;
  background-color: var(--color-background-secondary);
  box-shadow: 0 2px 1px rgba($color-black, 0.1);
  width: 100%;
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .toggle-theme-switch {
      margin-top: -25px;
    }
  }

  &__search-content {
    width: 50%;
    .c-input {
      width: 100%;
      max-width: 600px;
      padding: 0;
    }
  }

  @include responsive($lg, max) {
    padding: 10px 40px 10px 50px;
    &__search-content {
      width: 40%;
    }
  }

  @include mobile(max) {
    padding: 10px;
    &__wrapper {
      justify-content: flex-end;
    }
  }
}
</style>
