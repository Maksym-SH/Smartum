<template>
  <div class="user-info__name">
    <h5 class="user-info__name--name text-ellipsis">{{ firstName }}</h5>
    <h5 class="user-info__name--name text-ellipsis">{{ lastName }}</h5>
    <small
      v-show="firstName && showVerifiedTemplate"
      class="user-info__name--status"
      :class="{ verified: emailVerified }"
    >
      <span :class="['mdi', statusIcon]"></span>
      {{ userStatusText }}
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { EmailVerify, StatusVueIcon } from "@/types/types";
import { useInfoProps } from "./use/useProps";
import { User } from "@firebase/auth";

import useStores from "@/composables/useStores";

export default defineComponent({
  props: useInfoProps,
  setup() {
    const { userStore, configurationStore } = useStores();

    const emailVerified = computed(
      (): boolean => (userStore.currentUser as User).emailVerified
    );
    const showVerifiedTemplate = computed(
      (): boolean => configurationStore.additionalParams.showEmailConfirm
    );

    const userStatusText = computed((): EmailVerify => {
      if (emailVerified.value) return "Адрес подтверждён";
      return "Адрес не подтверждён";
    });

    const statusIcon: StatusVueIcon = emailVerified.value
      ? "mdi-email-check"
      : "mdi-email-alert";

    return {
      statusIcon,
      showVerifiedTemplate,
      emailVerified,
      userStatusText,
    };
  },
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
