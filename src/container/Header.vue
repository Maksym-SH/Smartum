<template>
  <header class="c-header">
    <div class="c-header__wrapper">
      <Input type="search" placeholder="Поиск" v-model="searchInput" />
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
  box-sizing: 20px 2px 12px $color-transp-black;
  height: fit-content;
  width: 100%;
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .input-wrapper {
      width: 50%;
      max-width: 440px;
      padding: 0;
    }
  }
}
</style>
