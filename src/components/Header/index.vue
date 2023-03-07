<template>
  <header class="c-header">
    <c-date />
  </header> 
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cDate from "@/components/Date/index.vue";
export default defineComponent({
  components: {
    cDate
  },
  setup() {

  }
})
</script>

<style lang="scss" src="./index.scss"></style>
