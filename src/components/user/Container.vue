<template>
  <Loader v-if="!showTemplate" inline />
  <div class="user-info" v-else>
    <Avatar
      rounded 
      online 
      :firstName="firstName"
      :lastName="lastName" 
      :avatar="avatar"
    />
    <div class="user-info__content">
      <Info  
        :firstName="firstName" 
        :lastName="lastName" 
      />
      <Select :items="actions" @selected="selected" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import Avatar from "@/components/user/Avatar.vue";
import Info from "@/components/user/Info.vue";
import { ObjectNotEmpty } from "@/helpers/methods";
import { SelectElements } from "@/types";

export default defineComponent({
  components: {
    Avatar,
    Info,
  },
  props: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  setup() {
    const store = useStore();

    const showTemplate = computed((): boolean => ObjectNotEmpty(store.getters.getCurrentUser));

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

    const selected = (callback: Function): Function => callback();

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
