<template>
  <header class="c-header">
    <div class="c-header__wrapper">
      <div class="c-header__search-content not-mobile">
        <cInput
          v-model="searchInput"
          type="search"
          name="searchContent"
          placeholder="Поиск"
        />
      </div>
      <transition name="toggle-content">
        <Date v-show="showDateTemplate" />
      </transition>
      <SwitchTheme class="not-mobile" />
    </div>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

import Date from '@/components/date/DateTime.vue'
import SwitchTheme from '@/components/UI/SwitchTheme.vue'
import useStores from '@/composables/useStores'

export default defineComponent({
  components: {
    Date,
    SwitchTheme,
  },
  setup() {
    const { configurationStore } = useStores()

    const searchInput = ref('')

    const showDateTemplate = computed((): boolean => {
      return configurationStore.additionalParams.showCurrentDate
    })

    return {
      searchInput,
      showDateTemplate,
    }
  },
})
</script>

<style lang="scss" scoped>
.c-header {
  position: sticky;
  top: 0;
  z-index: 3;
  padding: 10px 20px 10px 40px;
  background-color: var(--color-background-secondary);
  box-shadow: 0 2px 5px rgba($color-black, 0.5);
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
