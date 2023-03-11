<template>
  <div class="user-info">
    <Avatar 
      online
      name="Steve Jobs"
      :image="'https://avatars.mds.yandex.net/i?id=884edb525425300d10ba53dd8b1ee02e98861e27-7765566-images-thumbs&n=13&exp=1'"
    />
  </div><!--  image="" -->
</template>

<script>
import { defineComponent } from "vue";

import Avatar from "@/components/user/Avatar.vue";
export default defineComponent({
  components: {
    Avatar
  }
})
</script>

<style>

</style>