<template>
  <aside class="aside" :class="{ 'aside-minimize': minimizeAside }">
    <div class="aside__logo">
      <img class="aside__logo-picture" src="/images/icons/logo.svg" alt="" />
    </div>
    <div class="aside__content">
      <AppLoader v-if="!showContent" :size="defaultLoaderSize" inline />
      <template v-else>
        <div class="aside__mobile-content mobile-only">
          <span class="aside__mobile-content-wrapper">
            <SwitchLanguageButton />
            <SwitchTheme class="aside__theme-switch" small name="switchThemeMobile" />
          </span>
          <AppInput
            v-model="searchInput"
            type="search"
            light-theme
            name="searchContentMobile"
            :label="$t('labels.search')"
          />
        </div>
        <div class="aside__user">
          <UserInfo
            :first-name="userInfo.firstName"
            :last-name="userInfo.lastName"
            :avatar="userInfo.avatarParams"
            @user-menu-picked="setMinimizeValue(true, LayoutLaptop)"
          />
        </div>
        <transition-group
          name="smooth-height"
          mode="in-out"
          tag="div"
          class="aside__navigations"
        >
          <template v-for="item in navigationList" :key="item.id">
            <template v-if="item.showed">
              <AppExpansionPanel
                v-if="item.panels"
                :title="item.title"
                :icon="item.icon"
                :content="item.panels"
              />
              <VListItem
                v-else
                class="aside__navigation-list-item"
                @click="navigationCallbackHandler(item?.callback?.())"
              >
                <div class="navigation-group-content">
                  <InlineSvg
                    v-if="item.icon"
                    :src="`/images/icons/${item.icon}.svg`"
                    class="icon"
                  />
                  <span class="navigation-title" :class="{ 'no-icon': !item.icon }">
                    {{ item.title }}
                  </span>
                </div>
                <VBadge
                  v-show="notificationCount >= 0 && item.notify"
                  class="notify"
                  :class="{ 'empty-list': notificationCount === 0 }"
                  :content="notificationCount"
                />
              </VListItem>
            </template>
          </template>
        </transition-group>
      </template>
    </div>
    <footer class="aside__about-author">
      <article class="aside__about-author_description">
        <span> Powered by Maksym-SH © 2023 </span>
        <span>
          {{ applicationVersion }}
        </span>
      </article>
    </footer>
    <div class="aside__collapse" @click="collapseToggle">
      <div class="aside__collapse-wrapper">
        <span class="aside__collapse--toggle">
          <img src="/images/icons/caret.svg" alt="" />
        </span>
      </div>
      <transition name="toggle-content">
        <VBadge
          v-show="showNotificationBadge"
          class="aside__collapse--notify-badge"
          :content="notificationCount"
        />
      </transition>
    </div>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { ObjectHasValues, ObjectNotEmpty } from "@/helpers/methods";

import useStores from "@/composables/useStores";
import packageJson from "package.json";

import AppLoader from "../UI/AppLoader.vue";
import AppInput from "../UI/AppInput.vue";
import AppExpansionPanel from "../UI/AppExpansionPanel.vue";
import InlineSvg from "vue-inline-svg";
import SwitchLanguageButton from "../UI/SwitchLanguageButton.vue";
import UserInfo from "../user/UserInfo.vue";
import SwitchTheme from "../UI/SwitchTheme.vue";
import { VBadge, VListItem } from "vuetify/components";

import { Layout, Numbers } from "@/types/enums";
import type { IAsideNavItem } from "@/types/interfaces/components";
import type { IUserCreated } from "@/types/interfaces/user";

export default defineComponent({
  components: {
    UserInfo,
    SwitchTheme,
    InlineSvg,
    SwitchLanguageButton,
    AppInput,
    AppLoader,
    AppExpansionPanel,
    VBadge,
    VListItem,
  },
  props: {
    minimizeAside: {
      type: Boolean,
      required: true,
    },
    notificationCount: {
      type: Number,
      required: true,
    },
  },
  emits: ["update:minimizeAside"],
  setup(props, { emit }) {
    const { userStore, configurationStore } = useStores();

    const searchInput = ref("");

    const minimize = ref(true);

    const defaultLoaderSize = 40;

    const setMinimizeValue = (value: boolean, layoutType?: Layout): void => {
      if (layoutType && window.innerWidth > layoutType) {
        return;
      }

      minimize.value = value;
      emit("update:minimizeAside", minimize.value);
    };

    const navigationList = computed((): IAsideNavItem[] | [] => {
      return configurationStore.asideNavigate || [];
    });

    const asideBackgroundColor = computed((): string => {
      return configurationStore.additionalParams.asideBackgroundColor;
    });

    const showContent = computed((): boolean => {
      return (
        ObjectHasValues(userStore.userInfo) &&
        ObjectNotEmpty(userStore.currentUser) &&
        ObjectNotEmpty(navigationList.value)
      );
    });

    const notificationNavShowed = computed(() => {
      const notificationNavIndex = 2;

      if (configurationStore.asideNavigate) {
        return configurationStore.asideNavigate[notificationNavIndex]?.showed ?? true;
      }

      return [];
    });

    const showNotificationBadge = computed(
      () =>
        props.notificationCount > 0 && props.minimizeAside && notificationNavShowed.value
    );

    const userInfo = computed((): IUserCreated => userStore.userInfo);

    const collapseToggle = (): void => setMinimizeValue(!minimize.value);

    const navigationCallbackHandler = (callback: void | (() => void)): void => {
      setMinimizeValue(true, Layout.LARGE_TABLET); // Close aside panel after click navigation item.
      callback?.();
    };

    const applicationVersion = `v ${packageJson.version}`;

    onMounted((): void => {
      if (window.innerWidth > Layout.LAPTOP) {
        setTimeout((): void => {
          setMinimizeValue(false);
        }, Numbers.APPEAR_ELEMENT);
      }
    });

    return {
      userInfo,
      showContent,
      minimize,
      searchInput,
      navigationList,
      defaultLoaderSize,
      applicationVersion,
      showNotificationBadge,
      collapseToggle,
      navigationCallbackHandler,
      setMinimizeValue,
      asideBackgroundColor,
      LayoutLaptop: Layout.LAPTOP,
    };
  },
});
</script>

<style lang="scss">
.aside {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  max-width: 260px;
  background-color: $color-grey;
  transition: all 0.5s ease;
  box-shadow: 10px 0 10px rgba($color-dark-grey, 0.2);

  &.aside-minimize {
    box-shadow: none;
    transform: translateX(-261px);
  }

  &__navigation-list-item {
    display: flex;
    width: 100%;
    align-items: center !important;
    text-align: start;
    padding-left: 23px;
    height: 48px;
    color: $color-white1 !important;
    margin: 0;
    box-shadow: 0px 3px 2px -1px rgba($color-black, 0.5);

    .v-list-item__content {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    .navigation-group-content {
      display: flex;
      align-items: center;
    }

    .icon {
      width: 17px;
      margin-right: 12px;
    }

    .notify {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      height: 20px;
      font-size: 10px;
      margin-left: auto;
      margin-right: 18px;

      .v-badge__badge {
        background-color: $color-red;
      }

      &.empty-list {
        .v-badge__badge {
          background-color: $color-dark-grey3;
        }
      }
    }

    &:hover {
      background-color: $color-dark-grey2;
    }

    &:active {
      background-color: $color-dark-grey3;
    }
  }

  &__navigations {
    .c-button {
      width: 100%;
    }
  }

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 101px);
    color: $color-black;
    background-color: v-bind(asideBackgroundColor);
    overflow: hidden scroll;
    scrollbar-color: $color-dark-grey3 $color-grey;

    .c-loader {
      position: absolute !important;
      top: 50%;
      left: calc(50% - 20px);
      display: inline;
    }

    &::-webkit-scrollbar {
      width: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: $color-grey;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $color-dark-grey3;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 66.8px;
    background-color: $color-dark-grey;
    width: 100%;

    &-picture {
      width: 140px;
    }
  }

  &__mobile-content {
    padding: 10px 24px;

    .c-input {
      margin-top: 15px;
      padding: 0;

      :deep(.c-input__field--search) {
        display: none;
        border: 5px solid $color-white1 !important;
      }
    }
    &-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: flex-end;
    }

    .aside__theme-switch {
      transform: translateX(20px);
      z-index: 2;
    }
  }

  &__user {
    min-height: 130px;
    padding: 30px 24px;

    &--avatar {
      width: 42px;
      height: 24px;
    }
  }

  &__collapse {
    position: absolute;
    bottom: 34px;
    right: -26.9px;
    cursor: pointer;

    &-wrapper {
      background-color: v-bind(asideBackgroundColor);
      padding: 15px 10px;
      clip-path: polygon(0 0, 100% 21%, 100% 76%, 0% 100%);
    }

    &--toggle {
      img {
        width: 7px;
      }
    }

    &--notify-badge {
      position: absolute;
      top: 10px;
      right: 0;
      pointer-events: none;

      .v-badge__badge {
        background-color: $color-red;
      }
    }
  }

  &__about-author {
    margin-top: auto;
    z-index: 3;
    width: 100%;
    padding: 10px 0;
    background-color: $color-grey;
    color: $color-white1;

    &_description {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      font-style: italic;
      font-size: 10px;
      padding: 0 23px;
      user-select: none;
    }
  }

  @include responsive($xs, max) {
    transform: translateX(0);
    z-index: 5;

    &__collapse {
      position: absolute;
      top: 0%;
      right: -45px;
      bottom: auto;

      &-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0.78;
        clip-path: none;
        border-radius: 0 10px 10px 0;
        width: 45px;
        height: 66px;
      }

      &--toggle {
        img {
          width: 12px;
        }
      }

      &--notify-badge {
        right: 3px;
      }
    }
  }

  @include mobile(max) {
    &__logo {
      min-height: 63px;
    }

    &__user {
      min-height: 89px;
      padding: 10px 24px;
    }

    &__collapse {
      &-wrapper {
        height: 63px;
      }
    }
  }
}
</style>
