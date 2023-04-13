<template>
  <div class="home-page">
    <c-aside v-model:minimizeAside="minimizeAside" />
    <div class="home-page__wrapper"
      @click.capture="toggleAsideShow(false, true)"
      :class="{ 'minimize-info': minimizeAside }"
    >
      <c-header class="home-page__header" />
      <div class="home-page__tab-info">
        <h1 class="page-title"  v-if="showTabName">{{ tabName.ru }}</h1>
        <p class="page-description" v-if="showTabDescription">{{ tabDescription.ru }}</p>
      </div>
      <router-view v-slot="{ Component }">
        <transition
          tag="div"
          name="router-nav"
          mode="out-in"
          class="home-page__content"
        >
          <component v-if="showTabContent" :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, reactive, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { Layout } from "@/enums";
import { ObjectFull, ObjectNotEmpty } from "@/helpers/methods";
import { ILanguage, IMetaName } from "@/interfaces/index";
import { RouterMeta, DynamicDescription } from "@/types";
import * as DescriptionJSON from "@/helpers/content/tabs.json";
import cHeader from "@/container/Header.vue";
import cAside from "@/container/Aside.vue";


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

    // Note: ObjectFull - custom method.
    const showTabName = computed((): boolean => ObjectFull(tabName));
    const showTabDescription = computed((): boolean => showTabName.value && ObjectFull(tabDescription))

    const showTabContent = computed((): boolean => ObjectNotEmpty(store.getters.getCurrentUser))
    // Aside
    const minimizeAside = ref(true);
    const toggleAsideShow = (value: boolean, capture: boolean = false): void => {
      if (!capture) {
        minimizeAside.value = value;
      }
      else if (window.innerWidth <= Layout.LargeTablet) {
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
      showTabName,
      showTabDescription,
      showTabContent,
      toggleAsideShow,
      showLoading: computed(() => store.getters.getLoadingStatus),
    };
  },
});
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100%;
  background-color: $color-white5;
  &__wrapper {
    display: grid;
    min-height: 100%;
    grid-template-rows: auto 1fr;
    padding-left: 260px;
    transition: padding-left 0.5s ease;
    &.minimize-info {
      padding-left: 0 !important;
    }
    @include responsive($lg, max) {
      padding-left: 0;
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
        padding-right: 10px;
        line-height: 17px;
      }
    }
  }
  &__content {
    margin-top: 120px;
    width: 100%;
    padding-left: 40px;
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
