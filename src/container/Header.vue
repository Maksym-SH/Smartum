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
      <Date />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import Date from "@/components/date/DateTime.vue";

export default defineComponent({
  components: {
    Date,
  },
  setup() {
    const searchInput = ref("");

    return {
      searchInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-header {
  padding: 10px 40px;
  background-color: $color-white2;
  border-bottom: 1px solid $color-black;
  width: 100%;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__search-content {

    .input-wrapper {
      width: 100%;
      max-width: 440px;
      padding: 0;
    }
  }

  @include respond($lg, max) {
    padding: 10px 40px;
  }

  @include mobile(max) {
    padding:10px 15px;

    &__wrapper {
      justify-content: flex-end;
    }
  }
}
</style>
