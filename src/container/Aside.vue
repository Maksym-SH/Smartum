<template>
  <aside class="aside" :class="{ 'aside-minimize': minimize }">
    <div class="aside__content">
      <div class="aside__logo">
        <img src="@/assets/img/logo.svg" alt="Logo" />
      </div>
      <div class="aside__search-content mobile-only">
        <Input type="search" placeholder="Поиск" v-model="searchInput" />
      </div>
      <div class="aside__user">
        <User :name="userName" :avatar="userAvatar" />
      </div>

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

import User from "@/components/user/Container.vue";

export default defineComponent({
  components: {
    User,
  },
  emits: ["toggleAsideShow"],
  setup(_, { emit }) {

    const searchInput = ref("");

    const store = useStore();

    const minimize = ref(true);

    const collapseToggle = (): void => setMinimizeValue(!minimize.value);

    const setMinimizeValue = (value: boolean): void => {
      minimize.value = value;
      emit("toggleAsideShow", minimize.value);
    }

    onMounted((): void => {
      if(window.innerWidth > Layout.Mobile) {
        setTimeout((): void => {
          setMinimizeValue(false);
        }, Numbers.AppearElement);
      }

      window.onresize = (): void => {
        setMinimizeValue(true);
      }
    });

    return {
      userName: computed((): string => store.getters.getCurrentUser?.displayName),
      userAvatar: computed((): string => store.getters.getUserPhoto),
      minimize,
      searchInput,
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
  background-color: $color-grey;
  transition: transform 0.5s ease;

  &.aside-minimize {
    transform: translateX(-260px);
  }

  &__content {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
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
    .input-wrapper {
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

  @media (max-width: $md) {
    transform: translateX(0);
    z-index: 5;

    &__collapse {
      position: absolute;
      top: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba($color-light-grey, 0.8);
      right: -30px;
      bottom: auto;
      clip-path: none;
      border-radius: 0 10px 10px 0;
      width: 30px;
      height: 80px;

      &--toggle {
        img {
          width: 10px;
        }
      }
    }
  }
}
</style>
