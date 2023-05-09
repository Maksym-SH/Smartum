<template>
  <div class="home-page">
    <c-aside
      v-model:minimizeAside="minimizeAside" 
      :notification-count="notificationsSize" 
    />
    <div class="home-page__wrapper" 
      @click.capture="toggleAsideVisible(false, true)"
      :class="{ 'minimize-info': minimizeAside }"
    >
      <c-header class="home-page__header" />
      <div class="home-page__tab-info">
        <h1 class="page-title">
          {{ tabName.ru }}
        </h1>
        <p class="page-description">
          {{ tabDescription.ru }}
        </p>
      </div>
      <div class="home-page__content">
        <router-view v-slot="{ Component }">
          <transition name="router-nav" mode="out-in">
            <component 
              v-if="showTabContent" 
              :is="Component"
              :notification-list="notificationList"
              @readNotification="notifyAction($event, 'readNotification')"
              @deleteNotification="notifyAction($event, 'deleteNotification')"
              @clearAllNotifications="clearAll"
            />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, reactive, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Layout } from "@/types/enums";
import { ObjectHasValues, ObjectNotEmpty } from "@/helpers/methods";
import { ILanguage, IMetaName } from "@/types/interfaces";
import { RouterMeta, DynamicDescription } from "@/types/types";

import * as DescriptionJSON from "@/helpers/content/TabsInfo.json";
import useNotifications from "@/composables/useNotifications";
import useCurrentUserInfo from '@/composables/useCurrentUserInfo';
import useStores from "@/composables/useStores";
import cHeader from "@/container/Header.vue";
import cAside from "@/container/Aside.vue";

export default defineComponent({
  components: {
    cHeader,
    cAside,
  },
  setup() {
    const { commonStore, userStore } = useStores(); 

    const router = useRoute();
    
    const { currentUser } = useCurrentUserInfo(); 

    const { notificationsSize, notificationList, notifyAction, clearAll } = useNotifications();

    const tabName: ILanguage = reactive({ eng: "", ru: "" });

    const Description: DynamicDescription = DescriptionJSON;

    const tabDescription: ILanguage = reactive({ eng: "", ru: "" });


    const currentUserPresent = computed((): boolean => ObjectNotEmpty(currentUser));
    const additionalUserInfoPresent = computed((): boolean => ObjectHasValues(userStore.userInfo))
    const showTabContent = computed((): boolean => currentUserPresent.value && additionalUserInfoPresent.value);


    // Aside
    const minimizeAside = ref(true);
    const toggleAsideVisible = (value: boolean, capture: boolean = false): void => {
      if (!capture) {
        minimizeAside.value = value;
      }
      else if (window.innerWidth <= Layout.Laptop) {
        minimizeAside.value = capture;
      }
    };

    watch((): IMetaName | RouterMeta => router.meta, (meta): void => {
        const metaName: ILanguage = meta.tabName as ILanguage;

        if (metaName) {
          tabName.eng = metaName.eng;
          tabName.ru = metaName.ru;

          tabDescription.ru = Description[metaName.eng].ru;
          tabDescription.eng = Description[metaName.eng].eng;
        }
        else {
          tabName.ru = tabName.eng = "";
          tabDescription.eng = tabDescription.ru = "";
        }
      },
      { immediate: true }
    );
    

    return {
      tabName,
      tabDescription,
      minimizeAside,
      notificationList,
      notificationsSize,
      showTabContent,
      toggleAsideVisible,
      clearAll,
      notifyAction,
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
    font-size: 24px;
    padding-left: 40px;
    color: var(--color-text);
    .page {
      &-title {
        font-size: 24px;
        line-height: 24px;
      }
      &-description {
        font-size: 14px;
        margin-top: 11px;
        padding-right: 10px;
        line-height: 17px;
      }
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
    &__content{
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
