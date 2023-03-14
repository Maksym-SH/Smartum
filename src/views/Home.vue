<template>
  <div class="home-page">
    <div class="home-page__navigation">
      <c-aside />
      <c-header />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cHeader from "@/container/Header.vue";
import cAside from "@/container/Aside.vue";

export default defineComponent({
  components: {
    cHeader,
    cAside,
  },
  setup() {},
});
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background-color: $color-white5;
  &__navigation {
    display: flex;
  }
}
</style>
