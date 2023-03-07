<template>
  <div class="home-page">
    <c-header />
  </div>
</template>

<script lang="ts">
import cHeader from "@/components/Header/index.vue";
import { defineComponent } from "vue";
export default  defineComponent({
  components: { 
    cHeader
  }
})
</script>

<style>

</style>