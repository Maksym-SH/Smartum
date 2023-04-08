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
            :firstName="userInfo.firstName"
            :lastName="userInfo.lastName" 
            :avatar="userInfo.photoURL" 
          />
        </div>
      </template>
      <div class="aside__collapse" @click="collapseToggle">
        <span class="aside__collapse--toggle"
          ><img src="@/assets/img/icons/caret.svg" alt="" />
        </span>
      </div>
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

    const setMinimizeValue = (value: boolean): void => {
      minimize.value = value;
      emit("update:minimizeAside", minimize.value);
    }

    onMounted((): void => {
      if(window.innerWidth >= Layout.LargeTablet) {
        setTimeout((): void => {
          setMinimizeValue(false);
        }, Numbers.AppearElement);
      }

      window.onresize = (): void => {
        if(window.innerWidth <= Layout.LargeTablet)
          setMinimizeValue(true);
      }
    });

    return {
      userInfo, 
      showContent,
      minimize,
      searchInput,
      defaultLoaderSize,
      collapseToggle,
    };
  },
});
</script>

<style lang="scss">
.aside {
  width: 100%;
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

  &__content {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    color: $color-black;
    .c-loader {
      position: absolute !important;
      top: 50%;
      display: inline;
      left: calc(50% - 20px);
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
      right: -30px;
      bottom: auto;
      clip-path: none;
      border-radius: 0 10px 10px 0;
      width: 30px;
      height: 63px;

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
