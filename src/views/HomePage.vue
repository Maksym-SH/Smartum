<template>
  <div class="home-page">
    <c-aside @toggleAside="toggleAside" />
    <div class="home-page__wrapper" :class="{ 'minimize-info': minimizeAside }">
      <c-header class="home-page__header" />
      <div class="home-page__tab-info">
        <h1 class="page-title">{{ tabName.ru }}</h1>
        <p class="page-description" v-if="true">{{ tabDescription.ru }}</p>
      </div>
      <router-view v-slot="{ Component }">
        <transition
          tag="div"
          name="router-nav"
          mode="out-in"
          class="home-page__content"
        >
          <component v-if="!showLoading" :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, reactive, ref, computed } from "vue";
import cHeader from "@/container/Header.vue";
import cAside from "@/container/Aside.vue";
import { RouteLocation, useRoute } from "vue-router";
import * as DescriptionJSON from "@/helpers/content/tabs.json";
import { ILanguage } from "@/interfaces/index";
import { DynamicDescription } from "@/types/index";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    cHeader,
    cAside,
  },
  setup() {
    const router = useRoute();
    const store = useStore();

    const tabName: ILanguage = reactive({ eng: "", ru: "" });

    const Description: DynamicDescription = DescriptionJSON;

    const tabDescription: ILanguage = reactive({ eng: "", ru: "" });

    // Aside
    const minimizeAside = ref(true);
    const toggleAside = (value: boolean) => {
      minimizeAside.value = value;
    };

    watch(
      (): RouteLocation => router,
      (router) => {
        const tabRouterName: any = router.meta.tabName;
        const routerName: any = router.name;

        if (tabRouterName) {
          tabName.eng = tabRouterName.eng;
          tabName.ru = tabRouterName.ru;

          tabDescription.ru = Description[routerName].ru;
          tabDescription.eng = Description[routerName].eng;
        }
      },
      { immediate: true }
    );

    return {
      tabName,
      tabDescription,
      minimizeAside,
      toggleAside,
      showLoading: computed(() => store.getters.getLoadingStatus),
    };
  },
});
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background-color: $color-white5;

  &__wrapper {
    display: grid;
    height: 100vh;
    grid-template-rows: auto 1fr;
    padding-left: 260px;
    transition: padding-left 0.5s ease;

    &.minimize-info {
      padding-left: 0 !important;
    }
  }

  &__tab-info {
    position: absolute;
    top: 100px;
    font-size: 24px;
    padding-left: 40px;

    .page {
      &-title {
        font-size: 24px;
        line-height: 24px;
      }

      &-description {
        font-size: 14px;
        margin-top: 11px;
      }
    }
  }

  &__content {
    margin-top: 120px;
    width: 100%;
    padding-left: 40px;
  }
}
</style>
