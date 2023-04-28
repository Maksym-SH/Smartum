<template>
  <div class="user-info__name">
    <h5 class="user-info__name--name text-ellipsis">{{ firstName }}</h5>
    <h5 class="user-info__name--name text-ellipsis">{{ lastName }}</h5>
    <small 
      v-show="firstName && showVerifiedTemplate"
      class="user-info__name--status" :class="{ 'verified': emailVerified }">
      <span :class="['mdi', statusIcon]"></span> 
      {{ userStatusText }}
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { EmailVerify, StatusVueIcon } from "@/types";
import { useInfoProps } from "./use/useProps";

export default defineComponent({
  props: useInfoProps,
  setup(props) {
    const store = useStore();

    const emailVerified: boolean = store.state.User.currentUser.emailVerified;

    const showVerifiedTemplate = computed((): Boolean => 
                                            store.state.Configuration.additionalParams.showEmailConfirm);

    const userStatusText = computed((): EmailVerify => {
      if (emailVerified) return "Адрес подтверждён"
      return "Адрес не подтверждён"
    })

    const statusIcon: StatusVueIcon = emailVerified ? "mdi-email-check" : "mdi-email-alert"

    return {
      statusIcon,
      showVerifiedTemplate,
      emailVerified,
      userStatusText,
    }
  }
});
</script>

<style lang="scss" scoped>
.user-info__name {
  display: flex;
  flex-direction: column;
  max-width: 140px;
  &--name {
    color: $color-white3;
    font-size: 14px;
    line-height: 21px;
    white-space: pre-wrap;
  }
  &--status {
    padding-top: 10px;
    margin-top: auto;
    font-size: 11px;
    line-height: 16.5px;
    color: $color-yellow;
    &.verified {
      color: $color-green;
    }
  }
}
</style>
