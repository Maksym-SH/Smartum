<template>
  <aside class="aside" :class="{ 'aside-minimize': minimize }">
    <div class="aside__content">
      <div class="aside__logo">
        <img src="@/assets/img/logo.svg" alt="Logo" />
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
import User from "@/components/user/Container.vue";

export default defineComponent({
  components: {
    User,
  },
  emits: ["toggleAside"],
  setup(_, { emit }) {
    const store = useStore();

    const minimize = ref(true);

    const collapseToggle = () => {
      minimize.value = !minimize.value;
      emit("toggleAside", minimize.value);
    };

    onMounted(() => {
      setTimeout(() => {
        minimize.value = false;
        emit("toggleAside", minimize.value);
      }, 400);
    });

    return {
      userName: computed(() => store.getters.getCurrentUser.displayName),
      userAvatar: computed(() => store.getters.getCurrentUser.photo),
      minimize,
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
}
</style>
