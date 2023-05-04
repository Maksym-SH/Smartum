<template>
  <aside class="aside" 
    :style="{ 'backgroundColor': asideBackgroundColor }"
    :class="{ 'aside-minimize': minimizeAside }"
  >
    <div class="aside__logo">
      <img class="aside__logo-picture" src="/images/icons/logo.svg" alt="" />
    </div>
    <div class="aside__content">
      <Loader v-if="!showContent" :size="defaultLoaderSize" inline />
      <template v-else>
        <div class="aside__mobile-content mobile-only">
          <SwitchTheme
            class="aside__theme-switch"
            small
          />
          <Input
            type="search" 
            light-theme
            name="searchContent"
            label="Поиск" 
            v-model="searchInput"
          />
        </div>
        <div class="aside__user">
          <User 
            @user-menu-picked="setMinimizeValue(true, LayoutLaptop)"
            :firstName="userInfo.firstName"
            :lastName="userInfo.lastName" 
            :avatar="userInfo.avatarParams" 
          />
        </div>
        <transition-group 
          name="toggle-content" 
          mode="out-in" 
          tag="div"
          class="aside__navigations"
        >
          <template v-for="item in navigationList" :key="item.id">
            <template v-if="item.showed">
              <ExpPanel
                v-if="item.panels"
                :name="item.title" 
                :icon="item.icon" 
                :content="item.panels"
              />
              <Button 
                v-else
                class="aside__navigation-btn" 
                transparent
                @click="navigationCallbackHandler(item?.callback?.())"
              >
                <span 
                  v-if="item.icon"
                  class="icon" 
                  :class="['mdi', `mdi-${ item.icon }`]"
                ></span>
                <span :class="{ 'no-icon': !item.icon }">{{ item.title }}</span>
                <v-badge
                  v-show="notificationCount >= 0 && item.notify" 
                  class="notify"
                  :class="{'empty-list': notificationCount === 0 }"
                  :content="notificationCount"
                >
                </v-badge>
              </Button>
            </template>
          </template>
        </transition-group>
      </template>
    </div>
    <footer class="aside__about-author">
      <article class="aside__about-author_description">
        <span>
          Powered by Maksym-SH © 2023
        </span>
        <span>
          {{ applicationVersion }}
        </span>
      </article> 
    </footer>
    <div class="aside__collapse" @click="collapseToggle">
      <span class="aside__collapse--toggle"
        ><img src="/images/icons/caret.svg" alt="" />
      </span>
      <v-badge
        v-if="notificationCount > 0 && minimizeAside" 
        class="aside__collapse--notify-badge"
        :content="notificationCount"
      >
      </v-badge>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { Numbers, Layout } from "@/enums";
import { IAsideNavigationItem, IUserCreated } from "@/interfaces";
import { ObjectNotEmpty, ObjectHasValues } from "@/helpers/methods";

import User from "@/components/user/Container.vue";
import SwitchTheme from "@/components/UI/SwitchTheme.vue";

import packageJson from 'package.json'

export default defineComponent({
  components: {
    User,
    SwitchTheme
  },
  props: {
    minimizeAside: {
      type: Boolean,
      required: true,
    },
    notificationCount: {
      type: Number,
      required: true,
    }
  },
  emits: ["update:minimizeAside"],
  setup(_, { emit }) {
    const store = useStore();

    const searchInput = ref("");

    const minimize = ref(true);

    const defaultLoaderSize = 40;

    const asideBackgroundColor = computed((): string => {
      return store.state.Configuration.additionalParams.asideBackgroundColor;
    })

    const showContent = computed((): boolean => {
      return ObjectHasValues(store.state.User.userInfo) && 
                ObjectNotEmpty(store.state.User.currentUser) && 
                  ObjectNotEmpty(navigationList.value)
    });


    const userInfo = computed((): IUserCreated => store.state.User.userInfo);

    const collapseToggle = (): void => setMinimizeValue(!minimize.value);

    const setMinimizeValue = (value: boolean, layoutType?: Layout): void => {
      if (layoutType && window.innerWidth > layoutType) return;

      minimize.value = value;
      emit("update:minimizeAside", minimize.value);
    }

    const navigationCallbackHandler = (callback: void | (() => void)): void => {
      setMinimizeValue(true, Layout.LargeTablet); // Close aside panel after click navigation item.
      callback?.();
    };

    const navigationList = computed((): IAsideNavigationItem[] => {
      return store.state.Configuration.asideNavigate;
    });
  
    const applicationVersion = `v ${ packageJson.version }`;

    onMounted((): void => {
      if(window.innerWidth > Layout.Laptop) {
        setTimeout((): void => {
          setMinimizeValue(false);
        }, Numbers.AppearElement);
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
      collapseToggle,
      navigationCallbackHandler,
      setMinimizeValue,
      asideBackgroundColor,
      LayoutLaptop: Layout.Laptop
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

  &__navigation-btn {
    display: flex;
    text-align: start;
    padding-left: 23px;
    color: $color-white1 !important;
    margin: 0;
    box-shadow: 0px 3px 2px -1px rgba($color-black, 0.5);
    .icon {
      width: 14px;
      max-height: 14px;
      margin-right: 12px;
      text-align: center;
    }
    .notify {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      height: 20px;
      font-size: 10px;
      margin-left: auto;
      margin-right: 24px;
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
    overflow: hidden scroll;
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
    padding: 4.76px 25px;
    background-color: $color-dark-grey;
    width: 100%;
    text-align: center;

    &-picture {
      width: 140px;
    }
  }

  &__mobile-content {
    padding: 10px 24px;
    .c-input {
      margin-top: 35px;
      padding: 0;
      :deep(.c-input__field--search) {
        display: none;
        border: 5px solid $color-white1 !important;
      }
    }
    .aside__theme-switch {
      transform: translateX(20px);
      z-index: 2;
      margin-left: auto;
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
    right: -27px;
    cursor: pointer;
    background-color: $color-grey;
    padding: 15px 10px;
    clip-path: polygon(0 0, 100% 21%, 100% 76%, 0% 100%);
    &--toggle {
      img {
        width: 7px;
      }
    }
    &--notify-badge {
      position: absolute;
      top: 60px;
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
    background-color: $color-dark-grey3;
    color: $color-white1;
    &_description {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      font-size: 10px;
      padding: 0 23px;
      
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
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba($color-light-grey, 0.8);
      clip-path: none;
      border-radius: 0 10px 10px 0;
      width: 45px;
      height: 64px;

      &--toggle {
        img {
          width: 10px;
        }
      }
    }
  }
  @include mobile(max) {
    &__logo {
      max-height: 64px;
    }
    &__user {
      min-height: 89px;
      padding: 10px 24px;
    }
  }
}
</style>
