<template>
  <div class="user-info">
    <Avatar online :name="name" :image="avatar" />
    <div class="user-info--name">
      <Info :name="name" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import Avatar from "@/components/user/Avatar.vue";
import Info from "@/components/user/Info.vue";
export default defineComponent({
  components: {
    Avatar,
    Info,
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
  },
});
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  .user-avatar {
    margin-right: 16px;
  }
}
</style>
