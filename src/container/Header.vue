<template>
  <header class="c-header">
    <div class="c-header__wrapper">
      <div class="c-header__search-content not-mobile">
        <Input 
          type="search"
          name="searchContent" 
          placeholder="Поиск" 
          v-model="searchInput"
        />
      </div>
      <transition name="toggle-content">
        <Date v-show="showDateTemplate" />
      </transition>
      <SwitchTheme class="not-mobile"/>
    </div>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";

import Date from "@/components/date/DateTime.vue";
import SwitchTheme from "@/components/ui/SwitchTheme.vue";

export default defineComponent({
  components: {
    Date,
    SwitchTheme
  },
  setup() {
    const store = useStore();

    const searchInput = ref("");

    const showDateTemplate = computed((): boolean => {
      return store.state.Configuration.additionalParams.showCurrentDate;
    })

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
  z-index: 2;
  padding: 10px 20px 10px 50px;
  background-color: var(--color-background-secondary);
  box-shadow: 0 2px 1px rgba($color-black, 0.1);
  width: 100%;
  min-height: 63px;
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
