<template>
  <div class="user-info__name">
    <h5 class="user-info__name--name text-ellipsis">
      {{ firstName }}
    </h5>
    <h5 class="user-info__name--name text-ellipsis">
      {{ lastName }}
    </h5>
    <small
      v-show="firstName && showVerifiedTemplate"
      class="user-info__name--status"
      :class="{ verified: emailVerified }"
    >
      <InlineSvg
        class="user-info__name--status-icon"
        :src="`/images/icons/${statusIcon}.svg`"
      />
      {{ userStatusText }}
    </small>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useInfoProps } from "./use/useProps";

import i18n from "@/i18n";
import useStores from "@/composables/useStores";

import InlineSvg from "vue-inline-svg";

import type { User } from "@firebase/auth";
import type { StatusVueIcon } from "@/types";

export default defineComponent({
  components: {
    InlineSvg,
  },
  props: useInfoProps,
  setup() {
    const { t } = i18n.global;

    const { userStore, configurationStore } = useStores();

    const emailVerified = computed(
      (): boolean => (userStore.currentUser as User).emailVerified
    );
    const showVerifiedTemplate = computed(
      (): boolean => configurationStore.additionalParams.showEmailConfirm
    );

    const userStatusText = computed((): string => {
      if (emailVerified.value) {
        return t("userEmailStatus.confirmed");
      }

      return t("userEmailStatus.notConfirmed");
    });

    const statusIcon: StatusVueIcon = emailVerified.value ? "email-check" : "email-alert";

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
  width: 140px;

  &--name {
    color: $color-white3;
    font-size: 14px;
    line-height: 21px;
    white-space: pre-wrap;
  }

  &--status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding-top: 10px;
    margin-top: auto;
    font-size: 11px;
    line-height: 16.5px;
    color: $color-yellow;

    &.verified {
      color: $color-green;
    }

    &-icon {
      width: 15px;
    }
  }
}
</style>
