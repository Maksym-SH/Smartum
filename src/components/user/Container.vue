<template>
  <Loader v-if="!showTemplate" inline />
  <div class="user-info" v-else>
    <Avatar online :name="name" :image="avatar" />
    <div class="user-info__content">
      <Info :name="name" />
      <Select :items="actions" @selected="selected" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import router from "@/router";

import { SelectElements } from "@/types";

import Avatar from "@/components/user/Avatar.vue";
import Info from "@/components/user/Info.vue";

import { ObjectNotEmpty } from "@/helpers/methods";
import { computed } from "@vue/reactivity";

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
  setup() {
    const store = useStore();

    const showTemplate = computed(() => ObjectNotEmpty(store.getters.getCurrentUser));

    const actions: SelectElements = reactive([
      {
        title: "Мой профиль",
        callback: () => router.push("/profile"),
        icon: require("@/assets/img/icons/account.svg"),
        variant: "default",
      },
      {
        title: "Выйти с аккаунта",
        callback: () => store.dispatch("userLogout"),
        icon: require("@/assets/img/icons/logout.svg"),
        variant: "danger",
      },
    ]);

    const selected = (callback: Function) => callback();

    return {
      actions,
      showTemplate,
      selected,
    };
  },
});
</script>

<style lang="scss" scoped>
.c-loader {
  display: block !important;
  text-align: center;
  :deep(svg) {
    width: 40px;
    height: 40px;
  }
}

.user-info {
  display: flex;

  .user-avatar {
    margin-right: 16px;
  }

  &__content {

    position: relative;
    min-width: 135px;

    :deep(.c-select) {
      position: absolute;
      top: 2px;
      right: -40px;

      .c-button--round {
        img {
          width: 22px;
        }
      }
    }
  }
}
</style>
