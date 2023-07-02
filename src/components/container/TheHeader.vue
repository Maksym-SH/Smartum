<template>
  <header class="c-header">
    <div class="c-header__wrapper">
      <div class="c-header__search-content not-mobile">
        <AppInput
          v-model="searchInput"
          type="search"
          name="searchContentDesktop"
          :placeholder="$t('labels.search')"
        />
      </div>

      <transition name="toggle-content">
        <Date v-if="showDateTemplate" />
      </transition>

      <div class="c-header__actions">
        <SwitchLanguageButton class="not-mobile" />
        <SwitchTheme name="toggleThemeDesktop" class="not-mobile" />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import useStores from "@/composables/useStores";
import Date from "@/components/date/DateTime.vue";
import SwitchTheme from "@/components/UI/SwitchTheme.vue";
import SwitchLanguageButton from "../UI/SwitchLanguageButton.vue";

export default defineComponent({
  components: {
    Date,
    SwitchTheme,
    SwitchLanguageButton,
  },
  setup() {
    const { configurationStore } = useStores();

    const searchInput = ref("");

    const showDateTemplate = computed((): boolean => {
      return configurationStore.additionalParams.showCurrentDate;
    });

    return {
      searchInput,
      showDateTemplate,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-header {
  position: sticky;
  top: 0;
  z-index: 3;
  padding: 10px 20px 10px 40px;
  background-color: var(--color-background-secondary);
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba($color-black, 0.5);
  width: 100%;
  min-height: 63px;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
  }

  &__search-content {
    width: 40%;

    .c-input {
      width: 100%;
      max-width: 500px;
      padding: 0;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  @include tablet(max) {
    &__actions {
      gap: 10px;
    }
  }

  @include responsive($xs, max) {
    padding: 10px 5px 10px 50px;

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
