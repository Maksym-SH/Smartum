<template>
  <div class="home-page">
    <TheAside v-model:minimizeAside="minimizeAside" :notification-count="notificationsSize" />
    <div
      class="home-page__wrapper"
      :class="{ 'minimize-info': minimizeAside }"
      @click.capture="toggleAsideVisible(false, true)"
    >
      <TheHeader lass="home-page__header" />
      <div class="home-page__tab-info">
        <h1 class="home-page__tab-info-title">
          {{ tabInfo.title }}
        </h1>
        <p class="home-page__tab-info-description">
          {{ tabInfo.description }}
        </p>
      </div>
      <div class="home-page__content">
        <router-view v-slot="{ Component }">
          <transition name="router-nav" mode="out-in">
            <component :is="Component" v-if="showTabContent" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";

import i18n from "@/i18n";
import useNotifications from "@/composables/useNotifications";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useStores from "@/composables/useStores";
import TheHeader from "@/components/container/TheHeader.vue";
import TheAside from "@/components/container/TheAside.vue";

import { Layout } from "@/types/enums";
import { ObjectHasValues, ObjectNotEmpty } from "@/helpers/methods";
import type { IMetaName, ITabInfo } from "@/types/interfaces";
import { RouterMeta } from "@/types/types";

export default defineComponent({
  components: {
    TheAside,
    TheHeader,
  },
  setup() {
    const { t } = i18n.global;

    const { commonStore, userStore } = useStores();

    const router = useRoute();

    const { currentUser } = useCurrentUserInfo();

    const { notificationsSize } = useNotifications();

    const tabInfo = reactive<ITabInfo>({
      title: "",
      description: "",
    });

    const currentUserPresent = computed((): boolean => ObjectNotEmpty(currentUser.value));
    const additionalUserInfoPresent = computed((): boolean =>
      ObjectHasValues(userStore.userInfo)
    );
    const showTabContent = computed(
      (): boolean => currentUserPresent.value && additionalUserInfoPresent.value
    );

    // Aside
    const minimizeAside = ref(true);
    const toggleAsideVisible = (value: boolean, capture = false): void => {
      if (!capture) minimizeAside.value = value;
      else if (window.innerWidth <= Layout.LAPTOP) minimizeAside.value = capture;
    };

    const translatePageInfo = (tabName: unknown): void => {
      if (tabName) {
        tabInfo.title = computed(() => t(`tab.${tabName}.title`));
        tabInfo.description = computed(() => t(`tab.${tabName}.description`));
      }
    };

    // Update route.
    watch(
      (): IMetaName | RouterMeta => router.meta,
      ({ tabName }): void => translatePageInfo(tabName),
      { immediate: true }
    );

    return {
      tabInfo,
      minimizeAside,
      notificationsSize,
      showTabContent,
      toggleAsideVisible,
      showLoading: computed(() => commonStore.loadingStatus),
    };
  },
});
</script>

<style lang="scss" scoped>
.home-page {
  display: grid;
  grid-template-rows: 1fr;
  min-height: 100%;
  background-color: var(--color-background);
  transition: background-color 0.3s;

  &__wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 100%;
    padding-left: 260px;
    transition: padding-left 0.5s ease;

    &.minimize-info {
      padding-left: 0 !important;
    }

    @include responsive($xs, max) {
      padding-left: 0;
    }
  }

  &__tab-info {
    position: absolute;
    top: 100px;
    padding-left: 40px;
    color: var(--color-text);

    &-title {
      font-size: 24px;
      line-height: 24px;
      font-weight: bold;
    }

    &-description {
      font-size: 14px;
      margin-top: 11px;
      padding-right: 10px;
      line-height: 17px;
    }
  }

  &__content {
    margin-top: 120px;
    width: 100%;
    padding-left: 40px;
    padding-right: 40px;
  }

  @include responsive($xs, max) {
    &__tab-info {
      padding-left: 20px;
    }

    &__content {
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  @include mobile(max) {
    &__tab-info {
      top: 70px;
      padding-left: 10px;
    }

    &__content {
      padding: 10px;
      margin-top: 110px;
    }
  }
}
</style>
