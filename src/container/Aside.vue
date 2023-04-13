<template>
  <aside class="aside" :class="{ 'aside-minimize': minimizeAside }">
    <div class="aside__content">
      <div class="aside__logo">
        <img src="@/assets/img/logo.svg" alt="Logo" />
      </div>
      <Loader :size="defaultLoaderSize" inline v-if="!showContent"/>
      <template v-else>
        <div class="aside__search-content mobile-only">
          <Input
            type="search" 
            placeholder="Поиск" 
            v-model="searchInput"
          />
        </div>
        <div class="aside__user">
          <User 
            @user-menu-picked="setMinimizeValue(true, LayoutMobile)"
            :firstName="userInfo.firstName"
            :lastName="userInfo.lastName" 
            :avatar="userInfo.avatarParams" 
          />
        </div>
        <template v-for="(item, index) in navigation" :key="index">
            <template v-if="item.panels">
              <ExpPanel
                :name="item.title" 
                :icon="item.icon" 
                :content="item.panels"
              />
            </template>
            <template v-else>
              <Button class="aside__navigation-btn" transparent>
                <span 
                  v-if="item.icon"
                  class="icon" 
                  :class="['mdi', `mdi-${ item.icon }`]"
                ></span>
                <span :class="{ 'no-icon': !item.icon }">{{ item.title }}</span>
                <v-badge
                  v-if="item.notify" 
                  class="notify"
                  :class="{'empty-list': item.notify.count === 0 }"
                  :content="item.notify.count"
                >
                </v-badge>
              </Button>
            </template>
        </template>
      </template>
      <footer class="aside__about-author">
        <article>
          Powered by Maksym-SH © 2023
        </article>
      </footer>
    </div>
    <div class="aside__collapse" @click="collapseToggle">
      <span class="aside__collapse--toggle"
        ><img src="@/assets/img/icons/caret.svg" alt="" />
      </span>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { Numbers, Layout } from "@/enums";
import { IUserCreated } from "@/interfaces";
import User from "@/components/user/Container.vue";
import { ObjectNotEmpty, ObjectHasValues } from "@/helpers/methods";
import asideNavigation from "./use/asideNavigation";
import { AsideNavigationItems } from "@/types";

export default defineComponent({
  components: {
    User,
  },
  props: {
    minimizeAside: {
      type: Boolean,
      required: true,
    }
  },
  emits: ["update:minimizeAside"],
  setup(context, { emit }) {
    const store = useStore();

    const searchInput = ref("");

    const minimize = ref(true);

    const defaultLoaderSize = 40;

    const showContent = computed((): boolean => {
      return ObjectHasValues(store.getters.getUserInfo) && ObjectNotEmpty(store.getters.getCurrentUser)
    });

    const userInfo = computed((): IUserCreated => store.getters.getUserInfo);

    const collapseToggle = (): void => setMinimizeValue(!minimize.value);

    const setMinimizeValue = (value: boolean, layoutType?: Layout): void => {
      if (layoutType && window.innerWidth > layoutType) return;

      minimize.value = value;
      emit("update:minimizeAside", minimize.value);
    }

    const navigation: AsideNavigationItems = asideNavigation();

    onMounted((): void => {
      if(window.innerWidth >= Layout.LargeTablet) {
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
      navigation,
      defaultLoaderSize,
      collapseToggle,
      setMinimizeValue,
      LayoutMobile: Layout.LargeTablet
    };
  },
});
</script>

<style lang="scss">
.aside {
  width: 100%;
  height: 100%;
  max-width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: $color-grey;
  transition: transform 0.5s ease;
  box-shadow: 10px 0 10px rgba($color-light-grey, 0.25);
  &.aside-minimize {
    box-shadow: none;
    transform: translateX(-260px);
  }

  &__navigation-btn {
    text-align: start;
    padding-left: 23px;
    color: $color-white1 !important;
    margin: 0;
    display: flex;
    box-shadow: 0px 3px 2px -2px rgba($color-black, 0.4);
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

  &__content {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    color: $color-black;
    overflow: hidden scroll;
    .c-loader {
      position: absolute !important;
      top: 50%;
      display: inline;
      left: calc(50% - 20px);
    }

    &::-webkit-scrollbar {
      width: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $color-dark-grey4;
    }
  }

  &__logo {
    padding: 4.76px 25px;
    background-color: $color-dark-grey;
    width: 100%;
    text-align: center;

    img {
      width: 140px;
    }
  }

  &__search-content {
    padding: 10px 24px;
    .c-input {
      padding: 0;
      opacity: 0.8;
    }
  }

  &__user {
    padding: 30px 24px;

    &--avatar {
      width: 42px;
      height: 24px;
    }
  }

  &__collapse {
    position: absolute;
    bottom: 34px;
    right: -16px;
    cursor: pointer;
    background-color: $color-light-grey;
    padding: 7px 7px 10px 4.2px;
    clip-path: polygon(0 0, 100% 21%, 100% 76%, 0% 100%);
  }

  &__about-author {
    position: sticky;
    margin-top: auto;
    bottom: 0px;
    z-index: 2;
    width: 100%;
    padding: 10px 0;
    background-color: $color-dark-grey;
    color: $color-white1;
    article {
      margin: 0 auto;
      font-size: 10px;
      text-align: center;
    }
  }

  @include responsive($xs, max) {
    transform: translateX(0);
    z-index: 5;
    &__collapse {
      position: absolute;
      top: 0%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba($color-light-grey, 0.8);
      right: -45px;
      bottom: auto;
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
  }
}
</style>
